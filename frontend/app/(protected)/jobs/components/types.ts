export type VehicleType = "truck" | "pickup" | "minivan";

export interface Worker {
  id: string;
  name: string;
  initials: string;
  vehicleType?: VehicleType;
  vehicleNumber?: string;
  wage?: number;
}

export interface VehicleOption {
  type: VehicleType;
  plates: string[];
  wagePerRun: number;
}
