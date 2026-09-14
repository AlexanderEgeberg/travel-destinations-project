import "../style.css";
import { postTravel } from "../api";
import { createTravelForm } from "../components/travelForm.ts";

export function renderCreateTravel(app: HTMLDivElement) {
  app.appendChild(
    createTravelForm("Create travel", async (data) => {
      await postTravel(data);
      window.location.hash = "#/";
    }),
  );
}
