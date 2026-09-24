import "../style.css";
import { postTravel } from "../api.ts";
import { createTravelForm } from "../components/travelForm.ts";

export function renderCreateTravel(app: HTMLDivElement) {
  app.innerHTML = `
    <section>
      <div class="form-card">
        <h1>Create travel</h1>
      </div>
    </section>
  `;

  const card = app.querySelector<HTMLDivElement>(".form-card");

  if (!card) {
    throw new Error("Missing required DOM elements");
  }

  card.appendChild(
    createTravelForm("Create travel", async (data) => {
      await postTravel(data);
      window.location.hash = "#/";
    }),
  );
}
