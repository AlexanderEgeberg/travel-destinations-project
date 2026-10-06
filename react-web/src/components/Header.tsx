import { NavLink } from "react-router";

const Header = () => {
  console.log("header rendered");
  return (
    <ul>
      <li className="nav-home">
        <NavLink to="/">
          <img src="../assets/travel.png" alt="home icon" />
          Homepage
        </NavLink>
      </li>
      <li>
        <span>Welcome </span>
      </li>
      <NavLink to="/login">
        <button>Login</button>
      </NavLink>
    </ul>
  );
};

export default Header;
