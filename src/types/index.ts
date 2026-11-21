export type CivicCategory =
  | "Pothole/Road Damage"
  | "Garbage/Sanitation"
  | "Streetlight"
  | "Water Leakage/Supply"
  | "Drainage/Sewage"
  | "Electricity"
  | "Public Safety"
  | "Other";

export type UrgencyLevel = "Critical" | "High" | "Medium" | "Low";

export type IssueStatus = "REPORTED" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

export interface AIAnalysisResult {
  category: CivicCategory;
  subcategory: string;
  urgency: UrgencyLevel;
  impact_score: number; // 0 - 100
  recommended_department: string;
  department_confidence: number; // 0.0 - 1.0
  department_reasoning: string;
  one_line_summary: string;
  suggested_action_for_authority: string;
  estimated_resolution_time_hours: number;
  flags: {
    possible_duplicate: boolean;
    possibly_spam: boolean;
    image_matches_description: boolean;
  };
  visual_severity_notes?: string;
  source: "Gemini 2.5 Flash" | "Rule-based fallback";
}

export interface StatusAuditRecord {
  id: string;
  issueId: string;
  previousStatus: string | null;
  newStatus: string;
  changedBy: string;
  remarks: string | null;
  timestamp: string | Date;
}

export interface IssueItem {
  id: string;
  title: string;
  description: string;
  category: CivicCategory;
  subcategory?: string | null;
  urgency: UrgencyLevel;
  impactScore: number;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  address: string;
  ward: string;
  imageUrl?: string | null;
  resolvedImageUrl?: string | null;
  assignedDepartment: string;
  departmentConfidence: number;
  departmentReasoning: string;
  oneLineSummary?: string | null;
  suggestedAction?: string | null;
  estimatedResolutionHours: number;
  slaDeadline: string | Date;
  isOverdue: boolean;
  citizenName: string;
  citizenPhone?: string | null;
  upvotesCount: number;
  aiModelUsed: string;
  userOverridden: boolean;
  overrideDetails?: string | null;
  officialRemarks?: string | null;
  resolvedAt?: string | Date | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  statusAudits?: StatusAuditRecord[];
}

export interface DashboardAnalytics {
  total: number;
  reported: number;
  inProgress: number;
  resolved: number;
  criticalOpen: number;
  overdueCount: number;
  avgResolutionHours: number;
  slaComplianceRate: number;
  categoryBreakdown: { category: string; count: number }[];
  priorityBreakdown: { priority: string; count: number; color: string }[];
  departmentBreakdown: { department: string; open: number; resolved: number; compliance: number }[];
  wardBreakdown: { ward: string; count: number; lat: number; lng: number }[];
  dailyTrend: { date: string; reported: number; resolved: number }[];
}
