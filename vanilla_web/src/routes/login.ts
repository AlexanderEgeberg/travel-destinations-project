import "../style.css";
import { login } from "../api";

export function renderLogin(app: HTMLDivElement) {
  const accessToken = localStorage.getItem("accessToken");
  console.log("accessToken", accessToken);

  if (accessToken) {
    window.location.hash = "#/";
  }

  app.innerHTML = `
<section>
  <div class="form-card">
    <h1>Login</h1>
      <form>
        <div>
          <label for="username">username</label>
          <input id="username" name="username" type="text" required/>
        </div>
        <div>
          <label for="password">password</label>
          <input id="password" name="password" type="password" required />
        </div>
        <button class="button" type="submit">Login</button>
      </form>

      <p class="text-muted">No account yet? <a href="/#/create-account">Sign up</a>.</p>

  </div>

</section>
`;

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
