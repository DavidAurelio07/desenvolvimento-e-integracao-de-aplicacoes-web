// Silhueta de serra em camadas, usada como detalhe decorativo
export default function Serra({ className }) {
  return (
    <svg className={className} viewBox="0 0 1200 220" preserveAspectRatio="none" aria-hidden="true">
      <path
        d="M0 220 L0 120 L90 70 L170 130 L270 40 L380 140 L470 80 L590 160 L700 50 L830 150 L920 100 L1040 170 L1130 90 L1200 130 L1200 220 Z"
        fill="#1d5a40"
      />
      <path
        d="M0 220 L0 160 L120 110 L210 170 L320 100 L420 175 L550 110 L660 180 L780 120 L900 185 L1010 130 L1110 180 L1200 140 L1200 220 Z"
        fill="#174b35"
      />
      <path
        d="M0 220 L0 192 L140 160 L260 195 L400 165 L540 200 L700 170 L860 205 L1000 175 L1120 205 L1200 185 L1200 220 Z"
        fill="#0e3123"
      />
    </svg>
  )
}
