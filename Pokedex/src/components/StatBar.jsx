import { statColor, statWidth } from "../utils/pokemon";

// Uma linha de atributo: nome, valor e barra de progresso.
export default function StatBar({ icon, label, value }) {
  return (
    <div className="stat-row">
      <span className="stat-name">
        {icon} {label}
      </span>
      <span className="stat-value">{value}</span>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{ width: statWidth(value), backgroundColor: statColor(value) }}
        />
      </div>
    </div>
  );
}
