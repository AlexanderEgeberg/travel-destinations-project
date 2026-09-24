import type { TravelDestination } from "../api.ts";
import { formatDateDdMmYyyy } from "../utils/date.ts";

const travelTemplate = document.createElement("template");
travelTemplate.innerHTML = `
  <article class="travel-card">
    <h2 data-field="title"></h2>
    <div>
      <img data-field="image" alt="" />
      <div class="travel-card-details">
        <p data-field="location"></p>
        <p data-field="dates"></p>
        <p data-field="description"></p>
      </div>
    </div>
  </article>
`;

export function createTravelCard(travel: TravelDestination, detailed = false) {
  const fragment = travelTemplate.content.cloneNode(true) as DocumentFragment;

  const article = fragment.querySelector<HTMLElement>("article");
  const image = fragment.querySelector<HTMLImageElement>(
    '[data-field="image"]',
  );
  const title = fragment.querySelector<HTMLElement>('[data-field="title"]');
  const location = fragment.querySelector<HTMLElement>(
    '[data-field="location"]',
  );
  const dates = fragment.querySelector<HTMLElement>('[data-field="dates"]');
  const description = fragment.querySelector<HTMLElement>(
    '[data-field="description"]',
  );

  if (!article || !image || !title || !location || !dates || !description) {
    throw new Error("Template is missing required fields");
  }

  article.id = String(travel.id);
  article.classList.toggle("detailed", detailed);

  if (!detailed) {
    article.addEventListener("click", () => {
      window.location.hash = `#/travel/${travel.id}`;
    });
  }

  location.hidden = !detailed;
  description.hidden = !detailed;

  image.src = travel.imgSrc;
  image.alt = travel.title;

  title.textContent = `${travel.title} - ${travel.location}, ${travel.country}`;
  location.textContent = `${travel.location}, ${travel.country}`;
  dates.textContent = `${formatDateDdMmYyyy(travel.dateFrom)} - ${formatDateDdMmYyyy(travel.dateTo)}`;
  description.textContent = travel.description || "No description provided.";

  return fragment;
}
