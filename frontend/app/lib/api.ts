const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type ApiResponse<T = unknown> = {
  success: boolean;
  data: T;
  error: string | null;
};

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("quarryos_token");
}

function setToken(token: string): void {
  localStorage.setItem("quarryos_token", token);
}

function clearToken(): void {
  localStorage.removeItem("quarryos_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Unauthorized", 401);
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.detail || body.error || "Request failed", res.status);
  }

  return res.json();
}

export const api = {
  getToken,
  setToken,
  clearToken,

  async login(email: string, password: string): Promise<{ access_token: string; token_type: string }> {
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);

    const res = await fetch(`${API_BASE}/login/access-token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new ApiError(body.detail || "Login failed", res.status);
    }

    const data = await res.json();
    setToken(data.access_token);
    return data;
  },

  logout(): void {
    clearToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },

  me(): Promise<ApiResponse> {
    return request("/login/me");
  },

  // Dashboard
  dashboardStats(): Promise<ApiResponse> {
    return request("/dashboard/stats");
  },

  // Workers
  listWorkers(params?: { active_only?: boolean }): Promise<ApiResponse> {
    const qs = params?.active_only === false ? "?active_only=false" : "";
    return request(`/workers${qs}`);
  },
  getWorker(id: string): Promise<ApiResponse> {
    return request(`/workers/${id}`);
  },
  createWorker(data: { name: string; employee_id: string; phone?: string }): Promise<ApiResponse> {
    return request("/workers", { method: "POST", body: JSON.stringify(data) });
  },
  updateWorker(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return request(`/workers/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  deleteWorker(id: string): Promise<ApiResponse> {
    return request(`/workers/${id}`, { method: "DELETE" });
  },

  // Vehicles
  listVehicles(params?: { active_only?: boolean }): Promise<ApiResponse> {
    const qs = params?.active_only === false ? "?active_only=false" : "";
    return request(`/vehicles${qs}`);
  },
  listAvailableVehicles(): Promise<ApiResponse> {
    return request("/vehicles/available");
  },
  getVehicle(id: string): Promise<ApiResponse> {
    return request(`/vehicles/${id}`);
  },
  createVehicle(data: { plate_number: string; vehicle_type: string; status?: string }): Promise<ApiResponse> {
    return request("/vehicles", { method: "POST", body: JSON.stringify(data) });
  },
  updateVehicle(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return request(`/vehicles/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },
  deleteVehicle(id: string): Promise<ApiResponse> {
    return request(`/vehicles/${id}`, { method: "DELETE" });
  },

  // Wage Rates
  listWageRates(): Promise<ApiResponse> {
    return request("/wage-rates");
  },
  getCurrentRate(vehicleType: string): Promise<ApiResponse> {
    return request(`/wage-rates/current/${vehicleType}`);
  },
  createWageRate(data: { vehicle_type: string; rate_per_run: number; effective_from: string; notes?: string }): Promise<ApiResponse> {
    return request("/wage-rates", { method: "POST", body: JSON.stringify(data) });
  },

  // Job Batches
  listBatches(params?: { status?: string }): Promise<ApiResponse> {
    const qs = params?.status ? `?status=${params.status}` : "";
    return request(`/batches${qs}`);
  },
  getBatch(id: string): Promise<ApiResponse> {
    return request(`/batches/${id}`);
  },
  createBatch(data: { route_from: string; route_to: string; distance_km: number; est_hours?: number }): Promise<ApiResponse> {
    return request("/batches", { method: "POST", body: JSON.stringify(data) });
  },
  updateBatch(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return request(`/batches/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  // Assignments
  listAssignments(params?: { batch_id?: string; worker_id?: string }): Promise<ApiResponse> {
    const parts: string[] = [];
    if (params?.batch_id) parts.push(`batch_id=${params.batch_id}`);
    if (params?.worker_id) parts.push(`worker_id=${params.worker_id}`);
    const qs = parts.length ? `?${parts.join("&")}` : "";
    return request(`/assignments${qs}`);
  },
  createAssignment(data: {
    batch_id: string;
    worker_id: string;
    vehicle_id: string;
    pickup_destination?: string;
    dropping_destination?: string;
  }): Promise<ApiResponse> {
    return request("/assignments", { method: "POST", body: JSON.stringify(data) });
  },
  updateAssignment(id: string, data: Record<string, unknown>): Promise<ApiResponse> {
    return request(`/assignments/${id}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  // Payments
  listPayments(params?: { worker_id?: string }): Promise<ApiResponse> {
    const qs = params?.worker_id ? `?worker_id=${params.worker_id}` : "";
    return request(`/payments${qs}`);
  },
  createPayment(data: { worker_id: string; amount: number; advance_payment?: number; notes?: string }): Promise<ApiResponse> {
    return request("/payments", { method: "POST", body: JSON.stringify(data) });
  },

  // Vehicle Costs
  listCosts(params?: { vehicle_id?: string }): Promise<ApiResponse> {
    const qs = params?.vehicle_id ? `?vehicle_id=${params.vehicle_id}` : "";
    return request(`/costs${qs}`);
  },
  createCost(data: { vehicle_id: string; cost_type: string; amount: number; note?: string }): Promise<ApiResponse> {
    return request("/costs", { method: "POST", body: JSON.stringify(data) });
  },
};

export { ApiError };
export type { ApiResponse };
