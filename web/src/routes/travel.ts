import "../style.css";
import travel from "../assets/travel.png";
import { fetchTravel } from "../api";
import { createTravelCard } from "../components/travelCard";

export async function renderTravel(app: HTMLDivElement) {
  const travelId = window.location.hash.split("/").at(-1) ?? "";

  app.innerHTML = `
<section id="center">
    <div class="hero">
        <img src="${travel}" class="base" width="170" height="179">
    </div>

    <section>
        <h1>Travel item</h1>
        <p>Travel id: ${travelId}</p>
        <div id="travelList"></div>
    </section>
</section>
`;

  const travelList = document.querySelector<HTMLDivElement>("#travelList");

  if (!travelList) {
    throw new Error("Missing required DOM elements");
  }

  travelList.textContent = "Loading...";

  try {
    const { travel } = await fetchTravel(travelId);

    travelList.replaceChildren();

    if (!travel) {
      travelList.textContent = "No travel destinations yet.";
      return;
    }

    const card = createTravelCard(travel);
    travelList.replaceChildren(card);
  } catch (error) {
    travelList.textContent = "Failed to load travel destinations.";
    console.error(error);
  }
}
