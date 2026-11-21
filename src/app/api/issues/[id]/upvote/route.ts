import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json().catch(() => ({}));
    const { citizenId = `user_${Date.now()}` } = body;

    const issue = await prisma.issue.findUnique({ where: { id } });
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Increment upvotes count and boost impact score by 4 (max 100)
    const newImpact = Math.min(100, issue.impactScore + 4);
    let newUrgency = issue.urgency;
    if (newImpact >= 85) newUrgency = "Critical";
    else if (newImpact >= 70 && issue.urgency !== "Critical") newUrgency = "High";

    const updated = await prisma.issue.update({
      where: { id },
      data: {
        upvotesCount: { increment: 1 },
        impactScore: newImpact,
        urgency: newUrgency,
        duplicateVotes: {
          create: {
            citizenId,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Upvoted successfully. Priority elevated.",
      data: updated,
    });
  } catch (error: any) {
    console.error("Error in POST /api/issues/[id]/upvote:", error);
    return NextResponse.json({ error: "Failed to upvote", details: error.message }, { status: 500 });
  }
}
