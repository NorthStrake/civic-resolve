import { NextRequest, NextResponse } from "next/server";
import { analyzeCivicIssueWithGemini } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, address, imageBase64, imageMimeType } = body;

    if (!title && !description) {
      return NextResponse.json(
        { error: "Title or description required for AI analysis" },
        { status: 400 }
      );
    }

    const analysis = await analyzeCivicIssueWithGemini({
      title: title || "",
      description: description || "",
      address: address || "",
      imageBase64,
      imageMimeType,
    });

    return NextResponse.json({ success: true, data: analysis });
  } catch (error: any) {
    console.error("Error in /api/ai/analyze:", error);
    return NextResponse.json(
      { error: "AI analysis failed", details: error.message },
      { status: 500 }
    );
  }
}
