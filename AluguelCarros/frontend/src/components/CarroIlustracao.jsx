// Ilustração de carro de perfil. A cor da lataria vem de "currentColor".
export default function CarroIlustracao({ className }) {
  return (
    <svg className={className} viewBox="0 0 240 112" aria-hidden="true">
      <ellipse cx="122" cy="108" rx="100" ry="3.5" fill="rgba(18, 61, 43, 0.14)" />
      <path
        d="M14 80 C14 68 20 62 32 60 L58 55 C70 37 84 29 104 29 L150 29 C168 29 180 39 190 55 L216 61 C228 63 232 71 232 81 L232 87 C232 91 229 93 225 93 L19 93 C16 93 14 91 14 87 Z"
        fill="currentColor"
      />
      <path d="M70 55 C78 43 88 37 104 37 L128 37 L128 55 Z" fill="#f8f5ec" opacity="0.9" />
      <path d="M136 37 L150 37 C162 37 170 45 176 55 L136 55 Z" fill="#f8f5ec" opacity="0.9" />
      <rect x="222" y="67" width="9" height="7" rx="2" fill="#f4b942" />
      <rect x="14" y="70" width="7" height="7" rx="2" fill="#d99a1c" />
      <circle cx="62" cy="93" r="17" fill="#292d2a" />
      <circle cx="62" cy="93" r="8" fill="#f4b942" />
      <circle cx="62" cy="93" r="3" fill="#292d2a" />
      <circle cx="184" cy="93" r="17" fill="#292d2a" />
      <circle cx="184" cy="93" r="8" fill="#f4b942" />
      <circle cx="184" cy="93" r="3" fill="#292d2a" />
    </svg>
  )
}
