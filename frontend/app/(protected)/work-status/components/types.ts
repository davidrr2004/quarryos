export type WorkerStatus = "returned" | "pending" | "issue";

export type WorkerCard = {
  id: number;
  name: string;
  initials: string;
  avatar: string;
  vehicleNumber: string;
  vehicleType: string;
  route: string;
  runs: number;
  wage: number;
  status: WorkerStatus;
};
