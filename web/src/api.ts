// Indsæt dit eget MockAPI resource-endpoint uden afsluttende /.
const endpoint = "http://localhost:3000";

export async function getEntries() {
  const response = await fetch(endpoint + "/travel_destinations", {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error(`GET fejlede: ${response.status}`);

  const result = await response.json();
  console.log("res", result);
  return result;
}

export async function addEntry(data) {
  // TODO 3: POST til endpoint. Send data som JSON med Content-Type-header.
  // Kontrollér response.ok, og returnér response.json().
}

export async function deleteEntry(id) {
  // TODO 4: DELETE til `${endpoint}/${id}`. Kontrollér response.ok.
  // UI behøver ikke svar-bodyen, så undlad response.json() her.
}
