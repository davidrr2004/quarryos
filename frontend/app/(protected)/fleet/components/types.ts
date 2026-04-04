export type FleetFilterStatus = "all" | "Working" | "Maintenance" | "Not Working";

export type FleetVehicleStatus = Exclude<FleetFilterStatus, "all">;

export type FleetCostType = "Fuel" | "Maintenance" | "Parking";

export interface FleetCostEntry {
  type: FleetCostType;
  amt: number;
  note: string;
}

export interface FleetTripEntry {
  route: string;
  runs: number;
  earn: number;
  date: string;
  worker: string;
}

export interface FleetVehicle {
  num: string;
  status: FleetVehicleStatus;
  assignedTo: string | null;
  totalRuns: number;
  totalEarn: number;
  costs: FleetCostEntry[];
  trips: FleetTripEntry[];
}

export interface FleetAddVehicleValues {
  plate: string;
  type: FleetVehicleType;
  status: FleetVehicleStatus;
}

export type FleetVehicleType = "Truck" | "Pickup" | "Minivan";
