import "./style.css";
import heroImg from "./assets/hero.png";
import typescriptLogo from "./assets/typescript.svg";
import viteLogo from "./assets/vite.svg";
import { getEntries } from "./api.ts";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${heroImg}" class="base" width="170" height="179">
    <img src="${typescriptLogo}" class="framework" alt="TypeScript logo"/>
    <img src="${viteLogo}" class="vite" alt="Vite logo" />
  </div>
  <div>
    <h1>Get started</h1>
    <p>Edit <code>src/main.ts</code> and save to test <code>HMR</code></p>
  </div>

  <button id="fetchTravels" type="button" class="counter">Click me</button>

</section>
`;

document
  .querySelector<HTMLButtonElement>("#fetchTravels")!
  .addEventListener("click", getEntries);
