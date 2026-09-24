import { fetchTravels } from "../api.ts";
import { createTravelCard } from "../components/travelCard.ts";

export async function renderHomepage(app: HTMLDivElement) {
  const isLoggedIn = !!localStorage.getItem("accessToken");
  app.innerHTML = `
<section>

  <h1 class="text-center">Travel destinations</h1>
  ${!isLoggedIn ? '<p class="text-muted text-center">Login to add travel destinations</p>' : ""}
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
    const { data } = await fetchTravels();

    //clear old elemnts
    travelList.replaceChildren();

    const cards: Node[] = data.map((card) => createTravelCard(card));

    if (isLoggedIn) {
      cards.push(createAddDestinationCard());
    }

    if (cards.length === 0) {
      travelList.textContent = "No travel destinations yet.";
      return;
    }

    travelList.replaceChildren(...cards);
  } catch (error) {
    travelList.textContent = "Failed to load travel destinations.";
    console.error(error);
  }
}

function createAddDestinationCard() {
  const card = document.createElement("article");
  card.className = "travel-card add-card";
  card.innerHTML = `
    <span class="add-card-icon">+</span>
    <span>Add destination</span>
  `;
  card.addEventListener("click", () => {
    window.location.hash = "#/create-travel";
  });
  return card;
}
