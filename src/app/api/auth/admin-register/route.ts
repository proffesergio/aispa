import { NextRequest, NextResponse } from "next/server";
import { POST as handleAdminRegister } from "@/app/api/admin/register/route";

/**
 * Backward-compatible endpoint for Admin Registration
 * Delegates directly to the dedicated /api/admin/register handler.
 */
export async function POST(req: NextRequest) {
  return handleAdminRegister(req);
}
