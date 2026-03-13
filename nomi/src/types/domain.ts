export type WorkflowStatus = "pending" | "in-progress" | "completed" | "failed";

export interface WorkflowEvent {
  id: string;
  type: string;
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt?: Date;
  payload?: Record<string, unknown>;
}
