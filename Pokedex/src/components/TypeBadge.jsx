import { typeClass } from "../utils/pokemon";

export default function TypeBadge({ type }) {
  return <span className={`type-badge ${typeClass(type)}`}>{type}</span>;
}
