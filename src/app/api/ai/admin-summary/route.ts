import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAdminExecutiveSummary } from "@/lib/gemini";

export async function POST() {
  try {
    const openIssues = await prisma.issue.findMany({
      where: {
        status: { in: ["REPORTED", "IN_PROGRESS"] },
      },
      select: {
        id: true,
        title: true,
        category: true,
        urgency: true,
        ward: true,
        status: true,
      },
      orderBy: { impactScore: "desc" },
      take: 25,
    });

    const summary = await generateAdminExecutiveSummary(openIssues);

    return NextResponse.json({
      success: true,
      data: summary,
      sampleCount: openIssues.length,
    });
  } catch (error: any) {
    console.error("Error in /api/ai/admin-summary:", error);
    return NextResponse.json(
      { error: "Failed to generate admin summary", details: error.message },
      { status: 500 }
    );
  }
}
