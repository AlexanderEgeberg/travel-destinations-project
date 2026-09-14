import travelImage from "../assets/travel.png";
import type { NewTravelDestination, TravelDestination } from "../api.ts";

const travelFormTemplate = document.createElement("template");
travelFormTemplate.innerHTML = `
  <section id="center">
    <div class="hero">
      <img src="${travelImage}" class="base" width="170" height="179">
    </div>
    <div>
      <h1 data-field="heading"></h1>
      <form>
        <div class="form-group">
          <label for="title">title</label>
          <input id="title" name="title" type="text" required />
        </div>
        <div class="form-group">
          <label for="location">location</label>
          <input id="location" name="location" type="text" required />
        </div>
        <div class="form-group">
          <label for="country">country</label>
          <input id="country" name="country" type="text" required />
        </div>
        <div class="form-group">
          <label for="dateFrom">date from</label>
          <input id="dateFrom" name="dateFrom" type="date" required />
        </div>
        <div class="form-group">
          <label for="dateTo">date to</label>
          <input id="dateTo" name="dateTo" type="date" required />
        </div>
        <div class="form-group">
          <label for="description">description</label>
          <textarea id="description" name="description"></textarea>
        </div>
        <button class="button" type="submit" data-field="submit"></button>
      </form>
    </div>
  </section>
`;

export function renderTravelForm(
  app: HTMLDivElement,
  options: {
    heading: string;
    submitLabel: string;
    initial?: TravelDestination;
    onSubmit: (data: NewTravelDestination) => Promise<void>;
  },
) {
  const fragment = travelFormTemplate.content.cloneNode(
    true,
  ) as DocumentFragment;

  const heading = fragment.querySelector<HTMLElement>(
    '[data-field="heading"]',
  );
  const submit = fragment.querySelector<HTMLElement>('[data-field="submit"]');
  const form = fragment.querySelector<HTMLFormElement>("form");

  if (!heading || !submit || !form) {
    throw new Error("Template is missing required fields");
  }

  heading.textContent = options.heading;
  submit.textContent = options.submitLabel;

  if (options.initial) {
    const initial = options.initial;
    (
      ["title", "location", "country", "description"] as const
    ).forEach((field) => {
      const input = form.elements.namedItem(field) as
        | HTMLInputElement
        | HTMLTextAreaElement
        | null;
      if (input) input.value = initial[field] ?? "";
    });
    (["dateFrom", "dateTo"] as const).forEach((field) => {
      const input = form.elements.namedItem(field) as HTMLInputElement | null;
      if (input) input.value = initial[field].slice(0, 10);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    try {
      await options.onSubmit({
        title: String(data.title ?? ""),
        location: String(data.location ?? ""),
        country: String(data.country ?? ""),
        dateFrom: String(data.dateFrom ?? ""),
        dateTo: String(data.dateTo ?? ""),
        description: String(data.description ?? "") || null,
      });
    } catch (error) {
      alert(
        error instanceof Error ? error.message : "Failed to save travel",
      );
    }
  });

  app.replaceChildren(fragment);
}
