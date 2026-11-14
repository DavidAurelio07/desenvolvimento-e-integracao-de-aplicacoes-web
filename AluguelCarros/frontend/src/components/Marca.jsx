import { Link } from "react-router-dom";
import "./Marca.css";

export default function Marca({ para = "/" }) {
  return (
    <Link to={para} className="marca">
      <img
        src="/logo-horizontal.png"
        alt="Bão de Roda - Aluguel de Carros"
        className="marca-imagem"
      />
    </Link>
  );
}
