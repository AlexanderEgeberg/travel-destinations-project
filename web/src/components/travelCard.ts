import roadtrip from "../assets/roadtrip.png";
import type { TravelDestination } from "../api.ts";
import { formatDateDdMmYyyy } from "../utils/date.ts";

const travelTemplate = document.createElement("template");
travelTemplate.innerHTML = `
  <article class="travel-card">
    <h3 data-field="title"></h3>
    <img src="${roadtrip}" alt="Road trip" />
    <p data-field="location"></p>
    <p data-field="dates"></p>
    <p data-field="description"></p>
  </article>
`;

export function createTravelCard(travel: TravelDestination) {
  const fragment = travelTemplate.content.cloneNode(true) as DocumentFragment;

  const article = fragment.querySelector<HTMLElement>("article");
  const title = fragment.querySelector<HTMLElement>('[data-field="title"]');
  const location = fragment.querySelector<HTMLElement>(
    '[data-field="location"]',
  );
  const dates = fragment.querySelector<HTMLElement>('[data-field="dates"]');
  const description = fragment.querySelector<HTMLElement>(
    '[data-field="description"]',
  );

  if (!article || !title || !location || !dates || !description) {
    throw new Error("Template is missing required fields");
  }

  article.id = String(travel.id);
  article.addEventListener("click", () => {
    window.location.hash = `#/travel/${travel.id}`;
  });
  title.textContent = travel.title;
  // location.textContent = `${travel.location}, ${travel.country}`;
  dates.textContent = `${formatDateDdMmYyyy(travel.dateFrom)} - ${formatDateDdMmYyyy(travel.dateTo)}`;
  // description.textContent = travel.description || "No description provided.";

  return fragment;
}
