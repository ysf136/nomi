export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  statusCode?: number;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface IncidentCreateRequest {
  description: string;
  incidentType: string;
  affectedPeople: string;
  actionsTaken: string;
  date: string;
  time: string;
  severity?: "low" | "medium" | "high" | "critical";
}

export interface IncidentCreateResponse {
  id: string;
}

export interface IncidentAnalysisRequest {
  incidentId: string;
}

export interface IncidentAnalysisResponse {
  incidentId: string;
  analysisId: string;
}
