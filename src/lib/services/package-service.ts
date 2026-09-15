import { supabaseAdmin, supabaseServer } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type PackageRow = Database["public"]["Tables"]["packages"]["Row"];
export type PackageInsert = Database["public"]["Tables"]["packages"]["Insert"];

export interface PackageWithServices extends PackageRow {
  services: string[];
}

export interface CreatePackageInput {
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  bdtPrice: number;
  bdtPromoPrice?: number;
  durationMins?: number;
  isActive?: boolean;
  isPromotional?: boolean;
  services?: string[];
}

/**
 * Controller / Service Layer for Spa Packages & Tiered BDT Pricing (Supabase Native)
 */
export class PackageService {
  /**
   * Fetches all packages for Admin studio
   */
  static async getAllPackages(): Promise<PackageWithServices[]> {
    const { data, error } = await supabaseAdmin
      .from("packages")
      .select("*, package_services(name, duration)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[PackageService.getAllPackages] Error:", error);
      throw new Error(`Failed to fetch packages: ${error.message}`);
    }

    return (data || []).map((pkg: any) => ({
      ...pkg,
      services: (pkg.package_services || []).map((s: any) => s.name),
    }));
  }

  /**
   * Fetches active packages for customer portal / catalog
   */
  static async getActivePackages(): Promise<PackageWithServices[]> {
    const { data, error } = await supabaseServer
      .from("packages")
      .select("*, package_services(name, duration)")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[PackageService.getActivePackages] Error:", error);
      throw new Error(`Failed to fetch active packages: ${error.message}`);
    }

    return (data || []).map((pkg: any) => ({
      ...pkg,
      services: (pkg.package_services || []).map((s: any) => s.name),
    }));
  }

  /**
   * Creates a new Package with sub-services using Supabase RPC for atomic transaction handling
   */
  static async createPackage(input: CreatePackageInput): Promise<any> {
    const servicesPayload = (input.services || []).map((svcName) => ({
      name: svcName,
      duration: Math.round((input.durationMins || 60) / Math.max(1, (input.services?.length || 1))),
    }));

    // 1. Try atomic RPC execution
    const { data, error } = await supabaseAdmin.rpc("create_package_with_services", {
      p_title: input.title,
      p_title_bn: input.titleBn || null,
      p_description: input.description,
      p_description_bn: input.descriptionBn || null,
      p_bdt_price: input.bdtPrice,
      p_bdt_promo_price: input.bdtPromoPrice || null,
      p_duration_mins: input.durationMins || 60,
      p_is_active: input.isActive ?? true,
      p_is_promotional: input.isPromotional ?? false,
      p_services: servicesPayload,
    });

    if (error) {
      console.warn("[PackageService.createPackage] RPC error, using fallback transaction:", error.message);
      return this.createPackageManual(input);
    }

    return data;
  }

  /**
   * Manual multi-step insert fallback
   */
  static async createPackageManual(input: CreatePackageInput): Promise<PackageWithServices> {
    const { data: pkg, error: pkgErr } = await supabaseAdmin
      .from("packages")
      .insert({
        title: input.title,
        title_bn: input.titleBn || null,
        description: input.description,
        description_bn: input.descriptionBn || null,
        bdt_price: input.bdtPrice,
        bdt_promo_price: input.bdtPromoPrice || null,
        duration_mins: input.durationMins || 60,
        is_active: input.isActive ?? true,
        is_promotional: input.isPromotional ?? false,
      })
      .select()
      .single();

    if (pkgErr || !pkg) {
      console.error("[PackageService.createPackageManual] Insert error:", pkgErr);
      throw new Error(`Failed to create package: ${pkgErr?.message}`);
    }

    if (input.services && input.services.length > 0) {
      const serviceRecords = input.services.map((s) => ({
        package_id: pkg.id,
        name: s,
        duration: Math.round((input.durationMins || 60) / input.services!.length),
      }));

      const { error: svcErr } = await supabaseAdmin
        .from("package_services")
        .insert(serviceRecords);

      if (svcErr) {
        console.warn("[PackageService.createPackageManual] Package services insert error:", svcErr);
      }
    }

    return {
      ...pkg,
      services: input.services || [],
    };
  }

  /**
   * Toggles active visibility status
   */
  static async toggleActive(id: string, isActive: boolean): Promise<PackageRow> {
    const { data, error } = await supabaseAdmin
      .from("packages")
      .update({ is_active: isActive })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("[PackageService.toggleActive] Error:", error);
      throw new Error(`Failed to toggle package status: ${error.message}`);
    }

    return data;
  }

  /**
   * Deletes a package and its cascading service relations
   */
  static async deletePackage(id: string): Promise<boolean> {
    const { error } = await supabaseAdmin
      .from("packages")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("[PackageService.deletePackage] Error:", error);
      throw new Error(`Failed to delete package: ${error.message}`);
    }

    return true;
  }
}
