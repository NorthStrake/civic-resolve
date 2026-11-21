import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        statusAudits: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Also fetch nearby issues within ~1km for local context
    const nearby = await prisma.issue.findMany({
      where: {
        id: { not: id },
        latitude: {
          gte: issue.latitude - 0.015,
          lte: issue.latitude + 0.015,
        },
        longitude: {
          gte: issue.longitude - 0.015,
          lte: issue.longitude + 0.015,
        },
      },
      take: 4,
    });

    return NextResponse.json({ success: true, data: issue, nearby });
  } catch (error: any) {
    console.error("Error in GET /api/issues/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch issue", details: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const {
      status,
      assignedDepartment,
      officialRemarks,
      resolvedImageUrl,
      changedBy = "Municipal Operations Desk",
    } = body;

    const existing = await prisma.issue.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const updateData: any = {};
    let statusChanged = false;

    if (status && status !== existing.status) {
      updateData.status = status;
      statusChanged = true;
      if (status === "RESOLVED") {
        updateData.resolvedAt = new Date();
      }
    }

    if (assignedDepartment && assignedDepartment !== existing.assignedDepartment) {
      updateData.assignedDepartment = assignedDepartment;
    }

    if (officialRemarks) {
      updateData.officialRemarks = officialRemarks;
    }

    if (resolvedImageUrl) {
      updateData.resolvedImageUrl = resolvedImageUrl;
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: {
        ...updateData,
        statusAudits: {
          create: [
            {
              previousStatus: existing.status,
              newStatus: status || existing.status,
              changedBy,
              remarks: officialRemarks || (statusChanged ? `Status updated to ${status}` : "Issue metadata updated"),
            },
          ],
        },
      },
      include: {
        statusAudits: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: updatedIssue });
  } catch (error: any) {
    console.error("Error in PATCH /api/issues/[id]:", error);
    return NextResponse.json({ error: "Failed to update issue", details: error.message }, { status: 500 });
  }
}
