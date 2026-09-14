import "../style.css";
import travel from "../assets/travel.png";
import { createUser } from "../api";

export function renderCreateAccount(app: HTMLDivElement) {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    window.location.hash = "#/";
  }

  app.innerHTML = `
<section id="center">
  <div class="hero">
    <img src="${travel}" class="base" width="170" height="179">
  </div>
  <div>
    <h1>Create account</h1>
      <form>
        <div class="form-group">
          <label for="username">username</label>
          <input id="username" name="username" type="text" required autocomplete="given-name" aria-errormessage="username-error" />
          <p class="error-message" id="username-error">
            Username must be at least 8 characters and only use letters and numbers.
          </p>
        </div>
        <div class="form-group">
          <label for="password">password</label>
          <input id="password" name="password" type="password" required autocomplete="family-name" aria-errormessage="password-error" />
          <p class="error-message" id="password-error">
            Password must be at least 12 characters, include an uppercase letter and a number.
          </p>
        </div>
        <div class="form-group">
          <label for="confirmPassword">confirm password</label>
          <input id="confirmPassword" name="confirmPassword" type="password" required autocomplete="new-password" />
          <p class="error-message" id="confirm-password-error">
            Passwords must match.
          </p>
        </div>
        <button class="button" type="submit">Create account</button>
      </form>
      <p>Already have an account? <a href="/#/login">Login here</a>.</p>
  </div>
</section>
`;

  const form = document.querySelector<HTMLFormElement>("form");

  if (!form) {
    throw new Error("Missing required DOM elements");
  }

  const createAccountForm = form;

  async function handleSubmit(event: Event) {
    try {
      event.preventDefault();

      const data = Object.fromEntries(new FormData(createAccountForm));

      const username = String(data.username ?? "");
      const password = String(data.password ?? "");
      const confirmPassword = String(data.confirmPassword ?? "");

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!password || !username) {
        throw new Error("Missing username or password");
      }

      const token = await createUser({
        username,
        password,
      });

      console.log("token", token);
      localStorage.setItem("accessToken", token.accessToken);
      window.location.hash = "#/";
    } catch (error) {
      alert(`error creating account: ${error}`);
    }
  }

  createAccountForm.addEventListener("submit", handleSubmit);
}
