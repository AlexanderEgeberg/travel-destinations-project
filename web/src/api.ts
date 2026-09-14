export type TravelDestination = {
  id: number;
  title: string;
  dateFrom: string;
  dateTo: string;
  description: string | null;
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

export async function fetchTravels() {
  const response = await fetch(endpoint + "/travel_destinations", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`GET fejlede: ${response.status}`);

  const result = (await response.json()) as {
    travels: TravelDestination[];
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

export async function postEntry(data: NewTravelDestination) {
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

export async function deleteEntry(id: number) {
  // TODO 4: DELETE til `${endpoint}/${id}`. Kontrollér response.ok.
  // UI behøver ikke svar-bodyen, så undlad response.json() her.
  void id;
}
export async function updateEntry(id: number, data: TravelDestination) {
  // TODO 4: DELETE til `${endpoint}/${id}`. Kontrollér response.ok.
  // UI behøver ikke svar-bodyen, så undlad response.json() her.
  void id;
}
