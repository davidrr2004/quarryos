export type AssignedVehicle = {
  vtype: string;
  vnum: string;
};

export type Worker = {
  id: number;
  name: string;
  initials: string;
  avatar: string;
  eid: string;
  phone: string;
  assigned: AssignedVehicle | null;
};

export type WorkerFormValues = {
  name: string;
  eid: string;
  phone: string;
};
