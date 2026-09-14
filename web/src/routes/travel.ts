import "../style.css";
import travel from "../assets/travel.png";
import { deleteTravel, fetchTravel, updateTravel } from "../api";
import { createTravelCard } from "../components/travelCard";
import { createTravelForm } from "../components/travelForm.ts";
import { useState } from "../hooks/useState.ts";

export async function renderTravel(app: HTMLDivElement) {
  const [editable, setEditable] = useState(false, () => renderTravel(app));
  const travelId = window.location.hash.split("/").at(-1) ?? "";
  const isLoggedIn = !!localStorage.getItem("accessToken");

  app.innerHTML = `
<section id="center">
    <div class="hero">
        <img src="${travel}" class="base" width="170" height="179">
    </div>

    <section>
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

    travelList.appendChild(createTravelCard(travel));

    if (!isLoggedIn) return;

    travelList.appendChild(createToggleButton(editable, setEditable));
    travelList.appendChild(createDeleteButton(travel.id));

    if (editable) {
      travelList.appendChild(
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
