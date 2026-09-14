import { fetchTravels } from "../api.ts";
import { createTravelCard } from "../components/travelCard.ts";

export async function renderHomepage(app: HTMLDivElement) {
  app.innerHTML = `
<section id="center">
  <h1>Travel destinations</h1>
  <section>
    <div id="travelList" class="travel-grid"></div>
  </section>
</section>
`;

  const travelList = document.querySelector<HTMLDivElement>("#travelList");

  if (!travelList) {
    throw new Error("Missing required DOM elements");
  }

  travelList.textContent = "Loading...";

  try {
    const { travels } = await fetchTravels();

    travelList.replaceChildren();

    if (travels.length === 0) {
      travelList.textContent = "No travel destinations yet.";
      return;
    }

    const cards = travels.map((t) => createTravelCard(t, false));
    travelList.replaceChildren(...cards);
  } catch (error) {
    travelList.textContent = "Failed to load travel destinations.";
    console.error(error);
  }
}
