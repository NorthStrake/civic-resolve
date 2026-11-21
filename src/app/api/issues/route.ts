import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Haversine formula to compute distance in meters
function getDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const urgency = searchParams.get("urgency");
    const category = searchParams.get("category");
    const department = searchParams.get("department");
    const ward = searchParams.get("ward");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "date_desc";

    const where: any = {};

    if (status && status !== "ALL") where.status = status;
    if (urgency && urgency !== "ALL") where.urgency = urgency;
    if (category && category !== "ALL") where.category = category;
    if (department && department !== "ALL") where.assignedDepartment = { contains: department };
    if (ward && ward !== "ALL") where.ward = { contains: ward };

    if (search) {
      where.OR = [
        { id: { contains: search } },
        { title: { contains: search } },
        { description: { contains: search } },
        { address: { contains: search } },
        { citizenName: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: "desc" };
    if (sortBy === "date_asc") orderBy = { createdAt: "asc" };
    if (sortBy === "impact_desc") orderBy = { impactScore: "desc" };
    if (sortBy === "urgency_desc") orderBy = { impactScore: "desc" };
    if (sortBy === "sla_asc") orderBy = { slaDeadline: "asc" };

    const issues = await prisma.issue.findMany({
      where,
      orderBy,
      include: {
        statusAudits: {
          orderBy: { timestamp: "desc" },
        },
      },
    });

    return NextResponse.json({ success: true, count: issues.length, data: issues });
  } catch (error: any) {
    console.error("Error in GET /api/issues:", error);
    return NextResponse.json({ error: "Failed to fetch issues", details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      category,
      subcategory,
      urgency,
      impactScore,
      latitude,
      longitude,
      address,
      ward,
      imageUrl,
      assignedDepartment,
      departmentConfidence,
      departmentReasoning,
      oneLineSummary,
      suggestedAction,
      estimatedResolutionHours,
      citizenName,
      citizenPhone,
      aiModelUsed,
      userOverridden,
      overrideDetails,
      checkDuplicatesOnly,
    } = body;

    if (!title || !description || !latitude || !longitude) {
      return NextResponse.json(
        { error: "Title, description, latitude, and longitude are required." },
        { status: 400 }
      );
    }

    // Check for duplicates within 300 meters with same or similar category
    const nearbyIssues = await prisma.issue.findMany({
      where: {
        status: { in: ["REPORTED", "IN_PROGRESS"] },
      },
    });

    const duplicates = nearbyIssues.filter((issue) => {
      const dist = getDistanceMeters(latitude, longitude, issue.latitude, issue.longitude);
      const isSameCategory = issue.category === category || issue.category.includes(category) || category.includes(issue.category);
      return dist <= 350 && isSameCategory;
    });

    if (checkDuplicatesOnly) {
      return NextResponse.json({
        success: true,
        hasDuplicates: duplicates.length > 0,
        duplicates: duplicates.slice(0, 3),
      });
    }

    // Generate unique Issue ID: CR-2026-XXXX
    let nextId = `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    let exists = await prisma.issue.findUnique({ where: { id: nextId } });
    while (exists) {
      nextId = `CR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      exists = await prisma.issue.findUnique({ where: { id: nextId } });
    }

    const slaHours = estimatedResolutionHours || (urgency === "Critical" ? 18 : urgency === "High" ? 36 : 48);
    const slaDeadline = new Date(Date.now() + slaHours * 3600 * 1000);

    const issue = await prisma.issue.create({
      data: {
        id: nextId,
        title,
        description,
        category: category || "Other",
        subcategory: subcategory || `${category || "Other"} Maintenance`,
        urgency: urgency || "Medium",
        impactScore: impactScore || 50,
        status: "REPORTED",
        latitude: +latitude,
        longitude: +longitude,
        address: address || "Coimbatore, Tamil Nadu",
        ward: ward || "Ward 23 - RS Puram",
        imageUrl: imageUrl || null,
        assignedDepartment: assignedDepartment || "General Civic Administration",
        departmentConfidence: departmentConfidence || 0.9,
        departmentReasoning: departmentReasoning || "Automated triage assignment by CivicResolve AI.",
        oneLineSummary: oneLineSummary || title,
        suggestedAction: suggestedAction || "Dispatch field inspection unit for verification.",
        estimatedResolutionHours: slaHours,
        slaDeadline,
        isOverdue: false,
        citizenName: citizenName || "Citizen Reporter",
        citizenPhone: citizenPhone || null,
        upvotesCount: 1,
        aiModelUsed: aiModelUsed || "Gemini 2.5 Flash",
        userOverridden: !!userOverridden,
        overrideDetails: overrideDetails || null,
        statusAudits: {
          create: [
            {
              previousStatus: null,
              newStatus: "REPORTED",
              changedBy: (citizenName || "Citizen") + " (Citizen)",
              remarks: "Citizen complaint registered via CivicResolve.",
            },
          ],
        },
      },
      include: {
        statusAudits: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: issue,
      nearbyDuplicates: duplicates.length > 0 ? duplicates.slice(0, 3) : [],
    });
  } catch (error: any) {
    console.error("Error in POST /api/issues:", error);
    return NextResponse.json({ error: "Failed to create issue", details: error.message }, { status: 500 });
  }
}
