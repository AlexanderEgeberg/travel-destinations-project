export type TravelDestination = {
  id: number;
  title: string;
  dateFrom: string;
  dateTo: string;
  description: string | null;
  imgSrc: string;
  location: string;
  country: string;
  createdAt: string;
};

const endpoint = "http://localhost:3000";

export async function login(credentials: {
  username: string;
  password: string;
}) {
  const response = await fetch(endpoint + "/login", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) throw new Error(`GET fejlede: ${response.status}`);

  const result = (await response.json()) as {
    accessToken: string;
  };
  console.log("res", result);
  return result;
}

export async function createUser(user: { username: string; password: string }) {
  const response = await fetch(endpoint + "/create-user", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!response.ok) throw new Error(`POST fejlede: ${response.status}`);

  const result = (await response.json()) as {
    accessToken: string;
  };

  return result;
}

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export async function fetchTravels(params?: { page?: number; limit?: number }) {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  const queryString = query.toString();

  const response = await fetch(
    endpoint + "/travel_destinations" + (queryString ? `?${queryString}` : ""),
    {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!response.ok) throw new Error(`GET fejlede: ${response.status}`);

  const result = (await response.json()) as {
    data: TravelDestination[];
    pagination: Pagination;
  };
  console.log("res", result);
  return result;
}
export async function fetchTravel(id: string) {
  const response = await fetch(endpoint + "/travel_destination/" + id, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`GET fejlede: ${response.status}`);

  const result = (await response.json()) as {
    travel: TravelDestination;
  };
  console.log("res", result);
  return result;
}

export type NewTravelDestination = Omit<TravelDestination, "id" | "createdAt">;

export async function postTravel(data: NewTravelDestination) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(endpoint + "/travel_destination", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`POST fejlede: ${response.status}`);

  const result = (await response.json()) as { travel: TravelDestination };
  return result;
}

export async function deleteTravel(id: number) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(endpoint + "/travel_destination/" + id, {
    method: "delete",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  if (!response.ok) throw new Error(`DELETE fejlede: ${response.status}`);
}

export async function updateTravel(id: number, data: NewTravelDestination) {
  const accessToken = localStorage.getItem("accessToken");

  const response = await fetch(endpoint + "/travel_destination/" + id, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`PUT fejlede: ${response.status}`);

  const result = (await response.json()) as {
    travelDestination: TravelDestination;
  };
  return result.travelDestination;
}
