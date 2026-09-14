import "../style.css";
import travel from "../assets/travel.png";
import { deleteTravel, fetchTravel, updateTravel } from "../api";
import { createTravelCard } from "../components/travelCard";
import { renderTravelForm } from "../components/travelForm.ts";
import { useState } from "../hooks/useState.ts";

export async function renderTravel(app: HTMLDivElement) {
  const [editable, setEditable] = useState(false, () => renderTravel(app));
  const travelId = window.location.hash.split("/").at(-1) ?? "";

  app.innerHTML = `
<section id="center">
    <div class="hero">
        <img src="${travel}" class="base" width="170" height="179">
    </div>

    <section>
        <h1>Travel item</h1>
        <p>Travel id: ${travelId}</p>
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

    const isLoggedIn = !!localStorage.getItem("accessToken");

    if (isLoggedIn) {
      const toggleButton = document.createElement("button");
      toggleButton.className = "button";
      toggleButton.textContent = editable ? "Cancel" : "Edit";
      toggleButton.addEventListener("click", () => setEditable(!editable));
      travelList.appendChild(toggleButton);

      const deleteButton = document.createElement("button");
      deleteButton.className = "button";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", async () => {
        if (!window.confirm("Delete this travel destination?")) return;

        try {
          await deleteTravel(travel.id);
          window.location.hash = "#/";
        } catch (error) {
          alert(
            error instanceof Error ? error.message : "Failed to delete travel",
          );
        }
      });
      travelList.appendChild(deleteButton);
    }

    if (isLoggedIn && editable) {
      renderTravelForm(
        travelList,
        "Save changes",
        async (data) => {
          await updateTravel(travel.id, data);
          setEditable(false);
        },
        travel,
      );
      return;
    }

    const card = createTravelCard(travel);
    travelList.appendChild(card);
  } catch (error) {
    travelList.textContent = "Failed to load travel destinations.";
    console.error(error);
  }
}
