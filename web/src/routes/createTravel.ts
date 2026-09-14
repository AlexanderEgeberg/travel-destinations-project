import "../style.css";
import travel from "../assets/travel.png";
import { postEntry } from "../api";

export function renderCreateTravel(app: HTMLDivElement) {
  app.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${travel}" class="base" width="170" height="179">
  </div>
  <div>
    <h1>Create travel</h1>
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
        <button class="button" type="submit">Create travel</button>
      </form>
  </div>
</section>
`;

  const form = document.querySelector<HTMLFormElement>("form");

  if (!form) {
    throw new Error("Missing required DOM elements");
  }

  const createTravelForm = form;

  async function handleSubmit(event: Event) {
    try {
      event.preventDefault();

      const data = Object.fromEntries(new FormData(createTravelForm));

      await postEntry({
        title: String(data.title ?? ""),
        location: String(data.location ?? ""),
        country: String(data.country ?? ""),
        dateFrom: String(data.dateFrom ?? ""),
        dateTo: String(data.dateTo ?? ""),
        description: String(data.description ?? "") || null,
      });

      window.location.hash = "#/";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create travel");
    }
  }

  createTravelForm.addEventListener("submit", handleSubmit);
}
