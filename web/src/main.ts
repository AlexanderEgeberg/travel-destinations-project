import { renderHomepage } from "./routes/home.ts";
import { resetState } from "./hooks/useState.ts";
import travelIcon from "./assets/travel.png";
import "./style.css";

type Route = "home" | "login" | "travel" | "create-account" | "create-travel";

const publicRoutes: Record<string, () => Promise<void>> = {
  login: async () => {
    const { renderLogin } = await import("./routes/login.ts");
    renderLogin(app);
  },
  "create-account": async () => {
    const { renderCreateAccount } = await import("./routes/createAccount.ts");
    renderCreateAccount(app);
  },
  travel: async () => {
    const { renderTravel } = await import("./routes/travel.ts");
    renderTravel(app);
  },
};

const protectedRoutes: Record<string, () => Promise<void>> = {
  "create-travel": async () => {
    const { renderCreateTravel } = await import("./routes/createTravel.ts");
    renderCreateTravel(app);
  },
};

const navElement = document.querySelector<HTMLDivElement>("#nav");

const appElement = document.querySelector<HTMLDivElement>("#app");

if (!appElement || !navElement) {
  throw new Error("Missing app element or nav element");
}

const nav = navElement;
const app = appElement;

function parseJwt(token?: string) {
  if (!token) return;
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(""),
  );

  return JSON.parse(jsonPayload);
}

const loginHTML = `<button class="button"><a href="/#/login">login</a></button>`;
const logoutHTML = `<button id="logout" class="button">logout</button>`;

function renderNav() {
  const accessToken = localStorage.getItem("accessToken");
  const authButtonHTML = accessToken ? logoutHTML : loginHTML;
  console.log(parseJwt(accessToken ?? ""));
  const user = accessToken ? parseJwt(accessToken).username : "gæst";

  nav.innerHTML = `
  <ul>
    <li class="nav-home">
      <a href="/#"><img src="${travelIcon}" alt="" />home</a>
    </li>
    <li class="nav-auth">
      <span>Welcome ${user}</span>
      ${authButtonHTML}
    </li>
  </ul>`;

  const logoutButton = nav.querySelector<HTMLButtonElement>("#logout");

  logoutButton?.addEventListener("click", () => {
    localStorage.clear();
    renderNav();
  });
}

async function renderRoute() {
  renderNav();
  resetState();
  const routePath = window.location.hash.slice(2);
  const route = routePath.split("/")[0] as Route | "";

  if (route in protectedRoutes) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      window.location.hash = "#/login";
      return;
    }

    await protectedRoutes[route]();
    return;
  }

  if (route in publicRoutes) {
    await publicRoutes[route]();
    return;
  }

  await renderHomepage(app);
}

window.addEventListener("hashchange", renderRoute);

renderNav();
renderRoute();
