export type WorkerStatus = "returned" | "pending" | "issue";

export interface WorkerCard {
  id: string;
  name: string;
  initials: string;
  avatar: string;
  vehicleNumber: string;
  vehicleType: "Pickup" | "Truck" | "Minivan";
  route: string;
  runs: number;
  wage: number;
  status: WorkerStatus;
};
