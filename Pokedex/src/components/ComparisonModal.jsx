import { useEffect, useRef } from "react";
import "../css/Details.css";
import useEscapeKey from "../hooks/useEscapeKey";
import {
  STATS,
  getImage,
  getTotal,
  getTypeNames,
  handleImageError,
  statColor,
  statWidth,
} from "../utils/pokemon";
import TypeBadge from "./TypeBadge";

function CompareSide({ value, side, isWinner }) {
  return (
    <div className={`compare-side ${side} ${isWinner ? "win" : ""}`}>
      <span className="compare-value">{value}</span>
      <div className="stat-bar">
        <div
          className="stat-fill"
          style={{ width: statWidth(value), backgroundColor: statColor(value) }}
        />
      </div>
    </div>
  );
}

export default function ComparisonModal({ a, b, onClose }) {
  const backRef = useRef(null);
  useEscapeKey(onClose);
  useEffect(() => { backRef.current?.focus({ preventScroll: true }); }, []);

  const winsA = STATS.filter(({ key }) => a.stats[key] > b.stats[key]).length;
  const winsB = STATS.filter(({ key }) => b.stats[key] > a.stats[key]).length;

  let summary = "Empate técnico: os dois vencem o mesmo número de atributos.";
  if (winsA !== winsB) {
    const winner = winsA > winsB ? a : b;
    summary = `${winner.name} vence em ${Math.max(winsA, winsB)} de ${STATS.length} atributos.`;
  }

  const totalA = getTotal(a);
  const totalB = getTotal(b);

  return (
    <article
        className="compare-modal"
        aria-label={`Comparação entre ${a.name} e ${b.name}`}
      >
        <button
          type="button"
          ref={backRef}
          className="tool-btn details-back"
          onClick={onClose}
          aria-label="Voltar à lista de Pokémon"
        >
          ← Voltar
        </button>

        <div className="compare-heads">
          {[a, b].map((pokemon) => (
            <div className="compare-head" key={pokemon.id}>
              <img
                src={getImage(pokemon)}
                alt={pokemon.name}
                onError={(event) => handleImageError(event, pokemon)}
              />
              <h3>{pokemon.name}</h3>
              <div className="details-types">
                {getTypeNames(pokemon).map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="compare-rows">
          {STATS.map(({ key, label, icon }) => (
            <div className="compare-row" key={key}>
              <CompareSide
                side="left"
                value={a.stats[key]}
                isWinner={a.stats[key] > b.stats[key]}
              />
              <span className="compare-label">
                {icon} {label}
              </span>
              <CompareSide
                side="right"
                value={b.stats[key]}
                isWinner={b.stats[key] > a.stats[key]}
              />
            </div>
          ))}

          <div className="compare-row compare-total">
            <div className={`compare-side left ${totalA > totalB ? "win" : ""}`}>
              <span className="compare-value">{totalA}</span>
            </div>
            <span className="compare-label">Total</span>
            <div
              className={`compare-side right ${totalB > totalA ? "win" : ""}`}
            >
              <span className="compare-value">{totalB}</span>
            </div>
          </div>
        </div>

        <p className="compare-summary">{summary}</p>
    </article>
  );
}
