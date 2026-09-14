import type { NewTravelDestination, TravelDestination } from "../api.ts";

const travelFormTemplate = document.createElement("template");
travelFormTemplate.innerHTML = `
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
      <label for="imgSrc">image link</label>
      <input id="imgSrc" name="imgSrc" type="url" required />
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
`;

export function renderTravelForm(
  app: HTMLDivElement,
  submitLabel: string,
  onSubmit: (data: NewTravelDestination) => Promise<void>,
  initial?: TravelDestination,
) {
  const form = travelFormTemplate.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLFormElement;

  const submit = form.querySelector<HTMLElement>('[data-field="submit"]');

  if (!submit) {
    throw new Error("Template is missing required fields");
  }

  submit.textContent = submitLabel;

  if (initial) {
    (["title", "location", "country", "imgSrc", "description"] as const).forEach(
      (field) => {
        const input = form.elements.namedItem(field) as HTMLInputElement;

        if (input) input.value = initial[field] ?? "";
      },
    );
    (["dateFrom", "dateTo"] as const).forEach((field) => {
      const input = form.elements.namedItem(field) as HTMLInputElement | null;
      if (input) input.value = initial[field].slice(0, 10);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form));

    try {
      await onSubmit({
        title: String(data.title ?? ""),
        location: String(data.location ?? ""),
        country: String(data.country ?? ""),
        imgSrc: String(data.imgSrc ?? ""),
        dateFrom: String(data.dateFrom ?? ""),
        dateTo: String(data.dateTo ?? ""),
        description: String(data.description ?? "") || null,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save travel");
    }
  });

  app.replaceChildren(form);
}
