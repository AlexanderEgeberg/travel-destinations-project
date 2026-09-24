import "../style.css";
import { deleteTravel, fetchTravel, updateTravel } from "../api.ts";
import { createTravelCard } from "../components/travelCard.ts";
import { createTravelForm } from "../components/travelForm.ts";
import { useState } from "../hooks/useState.ts";

export async function renderTravel(app: HTMLDivElement) {
  const [editable, setEditable] = useState(false, () => renderTravel(app));
  const travelId = window.location.hash.split("/").at(-1) ?? "";
  const isLoggedIn = !!localStorage.getItem("accessToken");

  app.innerHTML = `
    <section>
        <div id="travelList"></div>
        ${!isLoggedIn ? '<p class="text-muted">Login to edit travel destinations</p>' : ""}
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

    travelList.appendChild(createTravelCard(travel, true));

    if (!isLoggedIn) return;

    const details = travelList.querySelector(".travel-card-details");

    if (!details) {
      throw new Error("Missing required DOM elements");
    }

    const actions = document.createElement("div");
    actions.appendChild(createToggleButton(editable, setEditable));
    actions.appendChild(createDeleteButton(travel.id));
    details.prepend(actions);

    if (editable) {
      details.querySelectorAll("p").forEach((p) => (p.hidden = true));
      details.appendChild(
        createTravelForm(
          "Save changes",
          async (data) => {
            await updateTravel(travel.id, data);
            setEditable(false);
          },
          travel,
        ),
      );
    }
  } catch (error) {
    travelList.textContent = "Failed to load travel destinations.";
    console.error(error);
  }
}

const createToggleButton = (
  editable: boolean,
  setEditable: (value: boolean) => void,
) => {
  const button = document.createElement("button");
  button.className = "button";
  button.textContent = editable ? "Cancel edit" : "Edit";
  button.addEventListener("click", () => setEditable(!editable));
  return button;
};

const createDeleteButton = (travelId: number) => {
  const button = document.createElement("button");
  button.className = "button";
  button.textContent = "Delete";
  button.addEventListener("click", async () => {
    if (!window.confirm("Delete this travel destination?")) return;

    try {
      await deleteTravel(travelId);
      window.location.hash = "#/";
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete travel");
    }
  });
  return button;
};
