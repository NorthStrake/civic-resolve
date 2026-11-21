import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const sampleIssues = [
  // 1. Critical Pothole - Peelamedu
  {
    id: "CR-2026-1001",
    title: "Massive crater pothole causing vehicle skid near PSG Tech",
    description: "Deep 1.2-meter pothole right in front of PSG Tech main gate on Avinashi Road. Two scooter riders slipped during evening downpour. Heavy traffic disruption.",
    category: "Pothole/Road Damage",
    subcategory: "Deep Hazardous Crater",
    urgency: "Critical",
    impactScore: 94,
    status: "IN_PROGRESS",
    latitude: 11.0272,
    longitude: 77.0018,
    address: "Avinashi Road, Peelamedu, Ward 45",
    ward: "Ward 45 - Peelamedu",
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Roads & Highways Department (Highways & CCMC Wing)",
    departmentConfidence: 0.96,
    departmentReasoning: "Primary arterial highway road surface rupture causing direct accident hazards to commuters.",
    oneLineSummary: "Severe road crater outside premier educational institute causing commuter skids and congestion.",
    suggestedAction: "Mobilize quick-setting cold mix asphalt crew; erect reflective barricades immediately.",
    estimatedResolutionHours: 18,
    slaDeadline: new Date(Date.now() + 6 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Karthik Subramanian",
    citizenPhone: "+91 98421 88320",
    upvotesCount: 14,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 14 * 3600 * 1000),
    officialRemarks: "Zonal highway team dispatched with road roller and 2 tons cold asphalt mix.",
  },

  // 2. Resolved Pothole with Before/After Proof - RS Puram
  {
    id: "CR-2026-1002",
    title: "Hazardous road cave-in on D.B. Road shopping lane",
    description: "Sub-surface subsidence created a sharp 8-inch depression near the popular bakery junction. Rickshaws and cars bottoming out.",
    category: "Pothole/Road Damage",
    subcategory: "Bitumen Surface Subsidence",
    urgency: "High",
    impactScore: 82,
    status: "RESOLVED",
    latitude: 11.0092,
    longitude: 76.9492,
    address: "D.B. Road, RS Puram West, Ward 23",
    ward: "Ward 23 - RS Puram",
    imageUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: "https://images.unsplash.com/photo-1584463699042-4b2a8d32ca13?auto=format&fit=crop&w=800&q=80",
    assignedDepartment: "Roads & Highways Department (Highways & CCMC Wing)",
    departmentConfidence: 0.95,
    departmentReasoning: "Commercial district roadway maintenance belongs to CCMC West Zone engineering team.",
    oneLineSummary: "Road cave-in on commercial corridor resolved with hot-mix resurfacing and leveling.",
    suggestedAction: "Excavate loose aggregate base, compact gravel foundation, and finish with dense bituminous macadam.",
    estimatedResolutionHours: 24,
    slaDeadline: new Date(Date.now() - 10 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Meenakshi Sundaram",
    citizenPhone: "+91 97894 12093",
    upvotesCount: 9,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 36 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 12 * 3600 * 1000),
    officialRemarks: "Resurfacing verified and quality-checked by Junior Engineer Thiru. R. Venkatesh.",
  },

  // 3. Overflowing Garbage - Gandhipuram Bus Stand
  {
    id: "CR-2026-1003",
    title: "Large municipal garbage container overflowing onto pedestrian pathway",
    description: "Sanitation bin hasn't been cleared for 4 days. Organic food waste and plastic debris spilling onto Cross Cut Road pavement near interstate bus stand. Foul odor and flies.",
    category: "Garbage/Sanitation",
    subcategory: "Commercial Zone Waste Accumulation",
    urgency: "High",
    impactScore: 88,
    status: "REPORTED",
    latitude: 11.0185,
    longitude: 76.9682,
    address: "Cross Cut Road, Gandhipuram, Ward 49",
    ward: "Ward 49 - Gandhipuram",
    imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Solid Waste Management & Public Health Wing",
    departmentConfidence: 0.97,
    departmentReasoning: "Solid waste overflow at public transit node creates severe vector-borne disease and health risks.",
    oneLineSummary: "Sanitation emergency at high-footfall commercial transit hub requiring compactor clearance.",
    suggestedAction: "Dispatch 14-cubic-meter hydraulic compactor truck and apply calcium hypochlorite powder.",
    estimatedResolutionHours: 24,
    slaDeadline: new Date(Date.now() + 10 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Anand Rajan",
    citizenPhone: "+91 94432 55019",
    upvotesCount: 21,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 8 * 3600 * 1000),
    officialRemarks: null,
  },

  // 4. Resolved Garbage - Saibaba Colony with Proof
  {
    id: "CR-2026-1004",
    title: "Illegal debris and green waste dump cleared near park",
    description: "Garden cuttings and building plaster bags left on corner of 7th cross street blocking park entrance.",
    category: "Garbage/Sanitation",
    subcategory: "Illegal Corner Dumping",
    urgency: "Medium",
    impactScore: 62,
    status: "RESOLVED",
    latitude: 11.0312,
    longitude: 76.9421,
    address: "7th Cross, Saibaba Colony, Ward 17",
    ward: "Ward 17 - Saibaba Colony",
    imageUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    assignedDepartment: "Solid Waste Management & Public Health Wing",
    departmentConfidence: 0.93,
    departmentReasoning: "Sanitary inspector zonal unit is responsible for neighborhood solid waste regulation.",
    oneLineSummary: "Residential debris pile removed, pavement cleared, and waste segregation notice posted.",
    suggestedAction: "Load debris into municipal dumper placer and wash sidewalk with pressurized water jet.",
    estimatedResolutionHours: 48,
    slaDeadline: new Date(Date.now() - 20 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Revathi Sridhar",
    citizenPhone: "+91 98940 33412",
    upvotesCount: 6,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 52 * 3600 * 1000),
    resolvedAt: new Date(Date.now() - 18 * 3600 * 1000),
    officialRemarks: "Cleared by Ward 17 sanitation team. Warning board erected against dumping.",
  },

  // 5. Critical Electricity - Transformer Sparking Town Hall
  {
    id: "CR-2026-1005",
    title: "Loud sparking from roadside distribution transformer near bazaar",
    description: "Sparks flying from overhead ceramic insulator with buzzing electrical arching. Crowded shopping street. People afraid to walk past.",
    category: "Electricity",
    subcategory: "Distribution Transformer Arching",
    urgency: "Critical",
    impactScore: 97,
    status: "IN_PROGRESS",
    latitude: 10.9962,
    longitude: 76.9638,
    address: "Opposite Clock Tower, Town Hall, Ward 62",
    ward: "Ward 62 - Town Hall",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Tamil Nadu Generation and Distribution Corporation (TANGEDCO)",
    departmentConfidence: 0.99,
    departmentReasoning: "Direct electrical hazard involving high-tension distribution transformer falls under TANGEDCO.",
    oneLineSummary: "High voltage transformer arching sparking in dense commercial street threatening public life.",
    suggestedAction: "Trigger remote SCADA feeder breaker trip; send 11kV emergency line breakdown crew.",
    estimatedResolutionHours: 12,
    slaDeadline: new Date(Date.now() + 4 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Murugan Selvaraj",
    citizenPhone: "+91 93452 11984",
    upvotesCount: 32,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 4 * 3600 * 1000),
    officialRemarks: "TANGEDCO Central sub-station line inspector on site. Transformer isolated for replacement.",
  },

  // 6. Water Leakage - Ukkadam High Pressure Pipeline
  {
    id: "CR-2026-1006",
    title: "Drinking water main line burst flooding bypass junction",
    description: "Siruvani drinking water pipeline joint rupture. Potable drinking water gushing up like a fountain onto the main road. Water pressure lost in adjacent residential colonies.",
    category: "Water Leakage/Supply",
    subcategory: "Siruvani Main Distribution Line Burst",
    urgency: "Critical",
    impactScore: 92,
    status: "REPORTED",
    latitude: 10.9884,
    longitude: 76.9592,
    address: "Sungam Bypass Junction, Ukkadam, Ward 78",
    ward: "Ward 78 - Ukkadam",
    imageUrl: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Coimbatore Municipal Water Supply & Sewerage Board (TWAD)",
    departmentConfidence: 0.98,
    departmentReasoning: "Main distribution water transmission line belongs to TWAD/CCMC joint engineering cell.",
    oneLineSummary: "High-volume drinking water line burst inundating bypass corridor and starving local supply.",
    suggestedAction: "Close Sectional Valve #4 to reduce head pressure; deploy trench excavator and collar sleeve.",
    estimatedResolutionHours: 18,
    slaDeadline: new Date(Date.now() + 8 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Fatima Begum",
    citizenPhone: "+91 98433 99201",
    upvotesCount: 18,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 5 * 3600 * 1000),
    officialRemarks: null,
  },

  // 7. Streetlight Outage - Race Course Jogging Track
  {
    id: "CR-2026-1007",
    title: "Four consecutive LED street poles dark along southern jogging lane",
    description: "Streetlights from pole #14 to #18 completely non-functional. Women walkers feel unsafe in the dark stretch after 7:30 PM.",
    category: "Streetlight",
    subcategory: "Multiple Consecutive Streetlight Outage",
    urgency: "Medium",
    impactScore: 68,
    status: "IN_PROGRESS",
    latitude: 11.0031,
    longitude: 76.9745,
    address: "Thomas Park Outer Ring, Race Course, Ward 28",
    ward: "Ward 28 - Race Course",
    imageUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Electrical Engineering & Street Lighting Wing",
    departmentConfidence: 0.96,
    departmentReasoning: "Street lighting network and feeder pillars in public recreation loop managed by electrical section.",
    oneLineSummary: "Dark cluster of 4 streetlight poles on premier jogging track affecting evening safety.",
    suggestedAction: "Test subterranean armored cable continuity and replace faulty timer contactor at Feeder #2.",
    estimatedResolutionHours: 36,
    slaDeadline: new Date(Date.now() + 18 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Deepak Narayanan",
    citizenPhone: "+91 99940 77821",
    upvotesCount: 8,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 16 * 3600 * 1000),
    officialRemarks: "Line electrician inspected timer box; cable replacement scheduled for today 11 AM.",
  },

  // 8. Drainage / Sewage - Singanallur Clogged Culvert
  {
    id: "CR-2026-1008",
    title: "Open stormwater drain overflowing black septic sewage onto street",
    description: "Culvert blocked with plastic silt. Stagnant foul sewage spilling onto residential colony road. High mosquito breeding risk for dengue.",
    category: "Drainage/Sewage",
    subcategory: "Stormwater Silt Block & Sewage Backflow",
    urgency: "High",
    impactScore: 84,
    status: "REPORTED",
    latitude: 10.9991,
    longitude: 77.0189,
    address: "Trichy Road, Kamarajar Street, Singanallur, Ward 57",
    ward: "Ward 57 - Singanallur",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Stormwater Drainage & Sewerage Operations",
    departmentConfidence: 0.94,
    departmentReasoning: "Stormwater channel obstruction and domestic blackwater contamination handled by drainage division.",
    oneLineSummary: "Choked culvert resulting in black septic backflow threatening public health in residential ward.",
    suggestedAction: "Mobilize high-pressure robotic jetting machine and dislodge plastic silt barrier.",
    estimatedResolutionHours: 24,
    slaDeadline: new Date(Date.now() + 14 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Senthil Nathan",
    citizenPhone: "+91 94862 33100",
    upvotesCount: 11,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 9 * 3600 * 1000),
    officialRemarks: null,
  },

  // 9. Overdue Issue - Ganapathy Road Damage
  {
    id: "CR-2026-1009",
    title: "Broken bridge approach ramp with protruding steel reinforcement",
    description: "Approach slab to railway overbridge has crumbled. Exposed rebar punctured car tires and poses high hazard to cyclists.",
    category: "Pothole/Road Damage",
    subcategory: "Structural Bridge Approach Damage",
    urgency: "Critical",
    impactScore: 96,
    status: "REPORTED",
    latitude: 11.0396,
    longitude: 76.9792,
    address: "Sathy Road ROB, Ganapathy, Ward 20",
    ward: "Ward 20 - Ganapathy",
    imageUrl: "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Roads & Highways Department (Highways & CCMC Wing)",
    departmentConfidence: 0.97,
    departmentReasoning: "Railway overbridge approach ramps require structural highway engineering intervention.",
    oneLineSummary: "Exposed rebar and concrete spalling on overbridge approach road posing severe danger.",
    suggestedAction: "Cut protruding rebar, apply structural bonding epoxy, and pour rapid-hardening concrete.",
    estimatedResolutionHours: 18,
    slaDeadline: new Date(Date.now() - 8 * 3600 * 1000), // OVERDUE!
    isOverdue: true,
    citizenName: "Vigneshwaran P.",
    citizenPhone: "+91 97908 66522",
    upvotesCount: 27,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 32 * 3600 * 1000),
    officialRemarks: "Overdue alert escalated to Superintending Engineer. Inspection ordered.",
  },

  // 10. Public Safety - Open Manhole Vadavalli
  {
    id: "CR-2026-1010",
    title: "Cast iron manhole cover broken leaving 6-foot uncovered pit",
    description: "Heavy truck crushed the manhole lid last night. Open vertical pit right next to bus stop. Residents placed a tree branch as makeshift warning.",
    category: "Public Safety",
    subcategory: "Dangerous Open Pit / Broken Manhole",
    urgency: "Critical",
    impactScore: 98,
    status: "IN_PROGRESS",
    latitude: 11.0258,
    longitude: 76.9019,
    address: "Marudhamalai Main Road, Vadavalli, Ward 36",
    ward: "Ward 36 - Vadavalli",
    imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?auto=format&fit=crop&w=800&q=80",
    resolvedImageUrl: null,
    assignedDepartment: "Public Safety & Municipal Rapid Response Cell",
    departmentConfidence: 0.95,
    departmentReasoning: "Life-threatening pedestrian trap requires immediate rapid barricade and replacement casting.",
    oneLineSummary: "Open 6-foot vertical sewer pit at bus stop posing fatal risk to commuters in darkness.",
    suggestedAction: "Install emergency safety perimeter immediately; install heavy-duty ductile iron SFRC cover.",
    estimatedResolutionHours: 12,
    slaDeadline: new Date(Date.now() + 2 * 3600 * 1000),
    isOverdue: false,
    citizenName: "Jayanthi Raman",
    citizenPhone: "+91 98422 41188",
    upvotesCount: 45,
    aiModelUsed: "Gemini 2.5 Flash",
    createdAt: new Date(Date.now() - 6 * 3600 * 1000),
    officialRemarks: "Barricades placed by traffic police. New SFRC cover dispatched from central yard.",
  },
];

// Generate 32 additional realistic Coimbatore complaints to make 42+ total issues
const wardsList = [
  { name: "Ward 12 - Saravanampatti", lat: 11.0792, lng: 76.9998, area: "IT Corridor / Keeranatham Road" },
  { name: "Ward 17 - Saibaba Colony", lat: 11.0289, lng: 76.9412, area: "NSR Road & Alagesan Road" },
  { name: "Ward 20 - Ganapathy", lat: 11.0392, lng: 76.9789, area: "Sathy Road & Athipalayam Junction" },
  { name: "Ward 23 - RS Puram", lat: 11.0084, lng: 76.9497, area: "Diwan Bahadur Road & TV Samy Road" },
  { name: "Ward 28 - Race Course", lat: 11.0028, lng: 76.9742, area: "Scheme Road & Court Corridor" },
  { name: "Ward 36 - Vadavalli", lat: 11.0255, lng: 76.9015, area: "Marudhamalai Road & Navavoor Pirivu" },
  { name: "Ward 43 - Hopes College", lat: 11.0261, lng: 77.0125, area: "Avinashi Road & GRD College Lane" },
  { name: "Ward 45 - Peelamedu", lat: 11.0270, lng: 77.0016, area: "PSG Tech Junction & Fun Mall Road" },
  { name: "Ward 49 - Gandhipuram", lat: 11.0183, lng: 76.9678, area: "Cross Cut Road & 100 Feet Road" },
  { name: "Ward 57 - Singanallur", lat: 10.9984, lng: 77.0185, area: "Trichy Road & Bus Terminus" },
  { name: "Ward 62 - Town Hall", lat: 10.9958, lng: 76.9632, area: "Big Bazaar Street & Oppanakara St" },
  { name: "Ward 65 - Ramanathapuram", lat: 10.9961, lng: 76.9856, area: "Trichy Road & Sungam Bypass" },
  { name: "Ward 78 - Ukkadam", lat: 10.9882, lng: 76.9589, area: "Bus Stand Circle & Fish Market" },
  { name: "Ward 85 - Sundarapuram", lat: 10.9521, lng: 76.9682, area: "Pollachi Road & SIDCO Industrial Estate" },
];

const categoryTemplates = [
  {
    category: "Pothole/Road Damage",
    dept: "Roads & Highways Department (Highways & CCMC Wing)",
    titles: [
      "Series of 3 deep asphalt potholes on bus route",
      "Crumbled bitumen shoulder causing bicycle falls",
      "Uneven road trench left after telecom optic-fiber digging",
      "Pothole swarm expanding after overnight monsoon rain",
    ],
    urgencies: ["Critical", "High", "Medium"],
  },
  {
    category: "Garbage/Sanitation",
    dept: "Solid Waste Management & Public Health Wing",
    titles: [
      "Stinking fish market waste spilled across access road",
      "Commercial cardboard and plastic dumping behind shopping complex",
      "Sanitation bin door broken causing waste to scatter on street",
      "Uncollected leaf waste piled high blocking rainwater drain",
    ],
    urgencies: ["High", "Medium", "Low"],
  },
  {
    category: "Streetlight",
    dept: "Electrical Engineering & Street Lighting Wing",
    titles: [
      "Streetlight fixture flickering continuously causing migraine",
      "Entire cross-lane plunged in darkness after fuse blown",
      "Tilted lamp post leaning toward overhead telecom wire",
      "Solar street fixture battery stolen, dark junction",
    ],
    urgencies: ["High", "Medium", "Low"],
  },
  {
    category: "Water Leakage/Supply",
    dept: "Coimbatore Municipal Water Supply & Sewerage Board (TWAD)",
    titles: [
      "Sub-surface drinking water leak bubbling through asphalt",
      "Broken public tap wasting clean water 24 hours continuously",
      "Air valve leaking drinking water with whistling sound",
      "Low water pressure and muddy water supply in residential lane",
    ],
    urgencies: ["High", "Medium", "Critical"],
  },
  {
    category: "Drainage/Sewage",
    dept: "Stormwater Drainage & Sewerage Operations",
    titles: [
      "Sewerage chamber overflowing with pungent black water",
      "Plastic bottles clogging storm drain entry inlet",
      "Stinking wastewater stagnating in front of primary health center",
      "Broken concrete slab over stormwater channel",
    ],
    urgencies: ["Critical", "High", "Medium"],
  },
  {
    category: "Electricity",
    dept: "Tamil Nadu Generation and Distribution Corporation (TANGEDCO)",
    titles: [
      "Low hanging electrical service cable brushing against delivery trucks",
      "Roadside junction box cover missing with exposed fuses",
      "Frequent voltage surges damaging household appliances in colony",
      "Tree branch touching high tension 11kV conductor with sparking",
    ],
    urgencies: ["Critical", "High", "Medium"],
  },
  {
    category: "Public Safety",
    dept: "Public Safety & Municipal Rapid Response Cell",
    titles: [
      "Aggressive pack of stray dogs chasing two-wheelers at night",
      "Dead branches of massive banyan tree hanging over traffic signal",
      "Abandoned rusted commercial truck narrowing narrow blind turn",
      "Broken pedestrian railing near stormwater canal bridge",
    ],
    urgencies: ["High", "Medium", "Critical"],
  },
];

const citizenNames = [
  "Ramesh Kumar", "Priya Venkataraman", "Suresh Balaji", "Anitha Natarajan",
  "Manoj Prabhakar", "Divya Krishnan", "Ganesh Moorthy", "Subramaniam V.",
  "Kavitha Rajendran", "Saravanan T.", "Lakshmi Narayanan", "Praveen Chandran",
  "Bhuvaneshwari K.", "Arun Prasad", "Shanthi Mohan", "Kishore Kumar",
  "Naveen Raj", "Gayathri Shankaran", "Santhosh Mani", "Geetha Radhakrishnan",
  "Venkatesh Babu", "Archana Swaminathan", "Vijay Anand", "Sangeetha Ravichandran",
  "Dinesh Karthik", "Meera Sundaram", "Harish Raghavan", "Usha Ramanathan",
  "Sridhar Ganesan", "Deepa Senthil", "Ashok Varadhan", "Swaminathan R."
];

async function seed() {
  console.log("Starting CivicResolve Coimbatore Database Seeding...");

  // Clear existing
  await prisma.statusAudit.deleteMany();
  await prisma.duplicateVote.deleteMany();
  await prisma.issue.deleteMany();

  console.log("Seeding core verified issues with before/after imagery...");

  for (const issue of sampleIssues) {
    const created = await prisma.issue.create({
      data: {
        ...issue,
        statusAudits: {
          create: [
            {
              previousStatus: null,
              newStatus: "REPORTED",
              changedBy: issue.citizenName + " (Citizen)",
              remarks: "Citizen grievance filed through CivicResolve platform.",
              timestamp: issue.createdAt,
            },
            ...(issue.status === "IN_PROGRESS" || issue.status === "RESOLVED"
              ? [
                  {
                    previousStatus: "REPORTED",
                    newStatus: "IN_PROGRESS",
                    changedBy: "Municipal Operations Desk",
                    remarks: `Assigned to ${issue.assignedDepartment} field response team.`,
                    timestamp: new Date(issue.createdAt.getTime() + 2 * 3600 * 1000),
                  },
                ]
              : []),
            ...(issue.status === "RESOLVED"
              ? [
                  {
                    previousStatus: "IN_PROGRESS",
                    newStatus: "RESOLVED",
                    changedBy: "Assistant Executive Engineer",
                    remarks: issue.officialRemarks || "Resolution inspected and verified on-site with photographic evidence.",
                    timestamp: issue.resolvedAt || new Date(issue.createdAt.getTime() + 14 * 3600 * 1000),
                  },
                ]
              : []),
          ],
        },
      },
    });
    console.log(`✓ Seeded ${created.id}: ${created.title.slice(0, 45)}... [${created.status}]`);
  }

  console.log("Generating 32 additional realistic Coimbatore municipal issues across 14 wards...");

  const statuses = ["REPORTED", "IN_PROGRESS", "RESOLVED", "REPORTED", "IN_PROGRESS", "RESOLVED", "REPORTED"];

  for (let i = 0; i < 32; i++) {
    const wardObj = wardsList[i % wardsList.length];
    const catObj = categoryTemplates[i % categoryTemplates.length];
    const title = catObj.titles[i % catObj.titles.length];
    const urgency = catObj.urgencies[i % catObj.urgencies.length];
    const status = statuses[i % statuses.length];
    const id = `CR-2026-${1011 + i}`;
    const citizen = citizenNames[i % citizenNames.length];

    const offsetHours = (i + 1) * 3;
    const createdAt = new Date(Date.now() - offsetHours * 3600 * 1000);
    const isOverdue = i === 4 || i === 11; // Mark 2 specific issues as overdue for demonstration
    const slaDeadline = isOverdue
      ? new Date(Date.now() - 4 * 3600 * 1000)
      : new Date(Date.now() + (24 + (i % 36)) * 3600 * 1000);

    const latJitter = (Math.random() - 0.5) * 0.008;
    const lngJitter = (Math.random() - 0.5) * 0.008;

    let impactScore = 50 + (i % 45);
    if (urgency === "Critical") impactScore = Math.min(99, 85 + (i % 14));
    if (urgency === "Low") impactScore = Math.max(15, 25 + (i % 20));

    const isResolved = status === "RESOLVED";
    const resolvedAt = isResolved ? new Date(createdAt.getTime() + 18 * 3600 * 1000) : null;

    await prisma.issue.create({
      data: {
        id,
        title: `${title} - ${wardObj.area}`,
        description: `Resident complaint logged regarding ${title.toLowerCase()} in ${wardObj.name} near ${wardObj.area}. Requires municipal crew attention.`,
        category: catObj.category,
        subcategory: `${catObj.category} Standard Maintenance`,
        urgency,
        impactScore,
        status,
        latitude: +(wardObj.lat + latJitter).toFixed(5),
        longitude: +(wardObj.lng + lngJitter).toFixed(5),
        address: `${wardObj.area}, ${wardObj.name}, Coimbatore`,
        ward: wardObj.name,
        imageUrl: `https://images.unsplash.com/photo-${1515162816999 + (i * 10000)}?auto=format&fit=crop&w=800&q=80`,
        resolvedImageUrl: isResolved
          ? "https://images.unsplash.com/photo-1584463699042-4b2a8d32ca13?auto=format&fit=crop&w=800&q=80"
          : null,
        assignedDepartment: catObj.dept,
        departmentConfidence: 0.92,
        departmentReasoning: `Jurisdiction designated to ${catObj.dept} per municipal service catalog.`,
        oneLineSummary: `${catObj.category} issue logged in ${wardObj.name} requiring routine operational dispatch.`,
        suggestedAction: `Dispatch zonal response unit to ${wardObj.area} for investigation.`,
        estimatedResolutionHours: urgency === "Critical" ? 18 : urgency === "High" ? 36 : 48,
        slaDeadline,
        isOverdue,
        citizenName: citizen,
        citizenPhone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
        upvotesCount: 1 + Math.floor(Math.random() * 12),
        aiModelUsed: "Gemini 2.5 Flash",
        createdAt,
        resolvedAt,
        officialRemarks: isResolved ? "Resolved and certified by CCMC Zonal Supervisor." : null,
        statusAudits: {
          create: [
            {
              previousStatus: null,
              newStatus: "REPORTED",
              changedBy: citizen + " (Citizen)",
              remarks: "Issue submitted with automated Gemini classification.",
              timestamp: createdAt,
            },
            ...(status === "IN_PROGRESS" || status === "RESOLVED"
              ? [
                  {
                    previousStatus: "REPORTED",
                    newStatus: "IN_PROGRESS",
                    changedBy: "Coimbatore City Operations Control Room",
                    remarks: `Work order dispatched to ${catObj.dept}.`,
                    timestamp: new Date(createdAt.getTime() + 3 * 3600 * 1000),
                  },
                ]
              : []),
            ...(status === "RESOLVED"
              ? [
                  {
                    previousStatus: "IN_PROGRESS",
                    newStatus: "RESOLVED",
                    changedBy: "CCMC Zonal Field Officer",
                    remarks: "Work completed, verified on-site, and before/after proof documented.",
                    timestamp: resolvedAt || new Date(),
                  },
                ]
              : []),
          ],
        },
      },
    });
  }

  const total = await prisma.issue.count();
  console.log(`\n🎉 SEED COMPLETE: Total ${total} realistic issues seeded in Coimbatore!`);
}

seed()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
