import "../style.css";
import { postTravel } from "../api";
import { renderTravelForm } from "../components/travelForm.ts";

export function renderCreateTravel(app: HTMLDivElement) {
  renderTravelForm(app, {
    heading: "Create travel",
    submitLabel: "Create travel",
    onSubmit: async (data) => {
      await postTravel(data);
      window.location.hash = "#/";
    },
  });
}
