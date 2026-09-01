import { NextRequest, NextResponse } from "next/server";
import { authorizeRoles } from "@/lib/auth/rbac";

// Mock Database Storage
let mockPackages: {
  id: string;
  title: string;
  description: string;
  bdtPrice: number;
  bdtPromoPrice?: number;
  durationMins: number;
  isActive: boolean;
  isPromotional: boolean;
  services: string[];
}[] = [
  {
    id: "pkg-1",
    title: "Royal Bride Luxury Glow Spa Bundle",
    description: "Full bridal head-to-toe package: Hydro-O2 facial, Japanese gel nail couture, and Hot Stone Spa massage.",
    bdtPrice: 12500,
    bdtPromoPrice: 9800,
    durationMins: 180,
    isActive: true,
    isPromotional: true,
    services: ["Hydro-O2 Oxygen Facial", "Japanese Gel Nails", "Hot Stone Aromatherapy"],
  },
];

export async function GET(req: NextRequest) {
  // In production: const auth = authorizeRoles(req, ["ADMIN", "MANAGER", "STYLIST"]);
  return NextResponse.json({ success: true, packages: mockPackages });
}

export async function POST(req: NextRequest) {
  const auth = authorizeRoles(req, ["ADMIN", "MANAGER"]);

  if (!auth.authorized) {
    // For demo/development ease: allow fallback if not strictly authenticated
    console.log("RBAC Warning: Request unauthorized or missing token. Proceeding for development mode.");
  }

  try {
    const body = await req.json();
    const { title, description, bdtPrice, bdtPromoPrice, durationMins, services, isPromotional } = body;

    if (!title || !bdtPrice) {
      return NextResponse.json(
        { error: "Title and BDT Price are required fields." },
        { status: 400 }
      );
    }

    const newPackage = {
      id: `pkg-${Date.now()}`,
      title,
      description: description || "",
      bdtPrice: Number(bdtPrice),
      bdtPromoPrice: bdtPromoPrice ? Number(bdtPromoPrice) : undefined,
      durationMins: durationMins || 60,
      isActive: true,
      isPromotional: Boolean(isPromotional),
      services: services || [],
    };

    mockPackages.unshift(newPackage);

    return NextResponse.json(
      { success: true, message: "Package created successfully", package: newPackage },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create package" }, { status: 500 });
  }
}
