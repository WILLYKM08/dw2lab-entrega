import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>React Products</h2>

      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>

        <li>
          <Link to="/products">Productos</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
