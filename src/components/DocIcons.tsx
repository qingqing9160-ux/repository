// Self-contained glass-style SVG icons with purple/violet gradient
// Each icon has its own gradient IDs to avoid DOM conflicts

interface IconProps {
  size?: number
}

function GlassBg({ id, from = '#818cf8', to = '#7c3aed' }: { id: string; from?: string; to?: string }) {
  return (
    <defs>
      <linearGradient id={`bg-${id}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={from} />
        <stop offset="100%" stopColor={to} />
      </linearGradient>
      <linearGradient id={`gl-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="white" stopOpacity="0.28" />
        <stop offset="55%" stopColor="white" stopOpacity="0" />
      </linearGradient>
    </defs>
  )
}

export function WorkSummaryIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="ws" from="#818cf8" to="#6d28d9" />
      <rect width="48" height="48" rx="13" fill="url(#bg-ws)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-ws)" />
      <rect x="9" y="27" width="7" height="12" rx="2" fill="white" fillOpacity="0.95" />
      <rect x="20.5" y="19" width="7" height="20" rx="2" fill="white" fillOpacity="0.95" />
      <rect x="32" y="12" width="7" height="27" rx="2" fill="white" fillOpacity="0.95" />
      <line x1="8" y1="39.5" x2="40" y2="39.5" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
    </svg>
  )
}

export function IncidentIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="inc" from="#f472b6" to="#be185d" />
      <rect width="48" height="48" rx="13" fill="url(#bg-inc)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-inc)" />
      <path d="M24 9L7 38h34L24 9z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="white" fillOpacity="0.15" />
      <rect x="22.25" y="20" width="3.5" height="10" rx="1.75" fill="white" />
      <circle cx="24" cy="34" r="2" fill="white" />
    </svg>
  )
}

export function PurchaseIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="pur" from="#818cf8" to="#7c3aed" />
      <rect width="48" height="48" rx="13" fill="url(#bg-pur)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-pur)" />
      <rect x="12" y="14" width="24" height="28" rx="3" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15" />
      <rect x="19" y="9" width="10" height="7" rx="2.5" fill="white" fillOpacity="0.9" />
      <line x1="17" y1="22" x2="31" y2="22" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="28" x2="31" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="34" x2="25" y2="34" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function AnnualPlanIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="ap" from="#a78bfa" to="#5b21b6" />
      <rect width="48" height="48" rx="13" fill="url(#bg-ap)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-ap)" />
      <rect x="8" y="14" width="32" height="26" rx="3" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.12" />
      <rect x="8" y="14" width="32" height="9" rx="3" fill="white" fillOpacity="0.25" />
      <rect x="17" y="9" width="3.5" height="8" rx="1.75" fill="white" />
      <rect x="27.5" y="9" width="3.5" height="8" rx="1.75" fill="white" />
      <rect x="13" y="28" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="21.5" y="28" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.9" />
      <rect x="30" y="28" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.9" />
    </svg>
  )
}

export function HandoverIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="ho" from="#818cf8" to="#4f46e5" />
      <rect width="48" height="48" rx="13" fill="url(#bg-ho)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-ho)" />
      <path d="M13 18h17M30 18l-5-5M30 18l-5 5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M35 30H18M18 30l5 5M18 30l5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function EthicsIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="eth" from="#c084fc" to="#7e22ce" />
      <rect width="48" height="48" rx="13" fill="url(#bg-eth)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-eth)" />
      <path d="M24 9L10 15v10c0 8 6 14 14 15 8-1 14-7 14-15V15L24 9z" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15" strokeLinejoin="round" />
      <path d="M17 24l5 5 9-9" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ComplaintIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="cmp" from="#818cf8" to="#6d28d9" />
      <rect width="48" height="48" rx="13" fill="url(#bg-cmp)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-cmp)" />
      <path d="M38 28a3 3 0 01-3 3H15l-6 6V13a3 3 0 013-3h23a3 3 0 013 3v15z" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15" strokeLinejoin="round" />
      <line x1="16" y1="18" x2="32" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="24" x2="26" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export function TransferIcon({ size = 48 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="tr" from="#818cf8" to="#7c3aed" />
      <rect width="48" height="48" rx="13" fill="url(#bg-tr)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-tr)" />
      <circle cx="18" cy="16" r="5" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.2" />
      <path d="M8 38v-3a8 8 0 018-8h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 26l8 4-8 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="white" fillOpacity="0.15" />
      <line x1="28" y1="30" x2="38" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

// Quick Tool Icons
export function SearchLitIcon({ size = 44 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="sl" from="#818cf8" to="#4f46e5" />
      <rect width="48" height="48" rx="13" fill="url(#bg-sl)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-sl)" />
      <rect x="9" y="10" width="20" height="25" rx="3" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.12" />
      <line x1="14" y1="18" x2="24" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="23" x2="24" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="28" x2="20" y2="28" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="33" cy="33" r="6" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.15" />
      <line x1="37.2" y1="37.2" x2="41" y2="41" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function PolicyIcon({ size = 44 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="pol" from="#a78bfa" to="#6d28d9" />
      <rect width="48" height="48" rx="13" fill="url(#bg-pol)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-pol)" />
      <rect x="11" y="9" width="26" height="30" rx="3" stroke="white" strokeWidth="2" fill="white" fillOpacity="0.12" />
      <line x1="17" y1="18" x2="31" y2="18" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="24" x2="31" y2="24" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="17" y1="30" x2="24" y2="30" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="31" cy="30" r="3.5" fill="white" fillOpacity="0.9" />
    </svg>
  )
}

export function WriteIcon({ size = 44 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlassBg id="wr" from="#818cf8" to="#7c3aed" />
      <rect width="48" height="48" rx="13" fill="url(#bg-wr)" />
      <rect width="48" height="26" rx="13" fill="url(#gl-wr)" />
      <path d="M32 10l6 6L20 34l-8 2 2-8L32 10z" stroke="white" strokeWidth="2" strokeLinejoin="round" fill="white" fillOpacity="0.15" />
      <path d="M28 14l6 6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="11" y1="40" x2="37" y2="40" stroke="white" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />
    </svg>
  )
}

// Map doc type id to icon component
export const DOC_ICON_MAP: Record<string, React.ComponentType<IconProps>> = {
  'work-summary': WorkSummaryIcon,
  'incident-report': IncidentIcon,
  'application-report': PurchaseIcon,
  'annual-plan': AnnualPlanIcon,
  'handover-report': HandoverIcon,
  'ethics-review': EthicsIcon,
  'complaint-response': ComplaintIcon,
  'transfer-record': TransferIcon,
}
