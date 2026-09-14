import "../style.css";
import travel from "../assets/travel.png";
import { login } from "../api";

export function renderLogin(app: HTMLDivElement) {
  const accessToken = localStorage.getItem("accessToken");
  console.log("accessToken", accessToken);

  if (accessToken) {
    window.location.hash = "#/";
  }

  app.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${travel}" class="base" width="170" height="179">
  </div>
  <div>
    <h1>Login</h1>
      <form>
        <div class="form-group">
          <label for="username">username</label>
          <input id="username" name="username" type="text" required autocomplete="given-name" aria-errormessage="username-error" />
          <p class="error-message" id="username-error">
            Skriv et username.
          </p>
        </div>
        <div class="form-group">
          <label for="password">password</label>
          <input id="password" name="password" type="password" required autocomplete="family-name" aria-errormessage="password-error" />
          <p class="error-message" id="password-error">
            Skriv et password.
          </p>
        </div>
        <button class="button" type="submit">Tilføj tilmelding</button>
      </form>

      <button class="button"><a href="/#/create-account">sign up</a></button>

  </div>

</section>
`;

  // const homeButton = document.querySelector<HTMLButtonElement>("#home");
  const form = document.querySelector("form");

  if (!form) {
    throw new Error("Missing required DOM elements");
  }

  async function handleSubmit(event: Event) {
    try {
      event.preventDefault();

      if (!form) {
        throw new Error("Missing required DOM elements");
      }
      const data = Object.fromEntries(new FormData(form));

      console.log("event", data);

      const token = await login({
        username: data.username as string,
        password: data.password as string,
      });

      console.log("token", token);
      localStorage.setItem("accessToken", token.accessToken);
      window.location.hash = "#/";
    } catch (error) {
      alert(`error login in: ${error}`);
    }
  }
  form.addEventListener("submit", handleSubmit);
}
