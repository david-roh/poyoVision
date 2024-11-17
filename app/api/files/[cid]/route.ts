import { NextResponse } from "next/server";
import { pinata } from "@/utils/config";

export async function GET(
  request: Request,
  { params }: { params: { cid: string } }
) {
  try {
    const response = await pinata.gateways.get(params.cid);
    return new NextResponse(response.data, {
      headers: {
        'Content-Type': response.contentType || 'application/octet-stream'
      }
    });
  } catch (error) {
    console.error('Failed to fetch file:', error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
