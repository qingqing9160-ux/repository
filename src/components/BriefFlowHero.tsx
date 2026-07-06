const kpis = [
  { label: 'Active units', value: '128', trend: '+12 online' },
  { label: 'Avg. response', value: '04:18', trend: '31% faster' },
  { label: 'Open incidents', value: '17', trend: '5 critical' },
]

const incidents = [
  { id: 'PUC-2048', type: 'Transformer alert', area: 'North Ridge', status: 'Dispatching', tone: 'bg-amber-100 text-amber-700' },
  { id: 'PUC-2049', type: 'Water main leak', area: 'West Canal', status: 'On site', tone: 'bg-blue-100 text-blue-700' },
  { id: 'PUC-2050', type: 'Line inspection', area: 'Downtown', status: 'Queued', tone: 'bg-slate-100 text-slate-600' },
]

const units = [
  { name: 'Crew A-14', x: '22%', y: '28%', color: 'bg-emerald-400' },
  { name: 'Truck E-07', x: '58%', y: '38%', color: 'bg-orange-400' },
  { name: 'Field R-22', x: '42%', y: '68%', color: 'bg-cyan-400' },
]

function DispatchConsole() {
  return (
    <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-2xl shadow-slate-900/20 backdrop-blur">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-cyan-50" />
      <div className="relative grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-[1.5rem] bg-slate-950 p-5 text-white shadow-inner">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Live operations</p>
              <h2 className="mt-2 text-2xl font-bold">Service Territory Map</h2>
            </div>
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm font-semibold text-emerald-300">All systems live</span>
          </div>

          <div className="relative h-80 overflow-hidden rounded-[1.25rem] border border-white/10 bg-slate-900">
            <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(34,211,238,.22)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,.22)_1px,transparent_1px)] [background-size:42px_42px]" />
            <div className="absolute left-10 top-12 h-44 w-44 rounded-full border border-cyan-300/30" />
            <div className="absolute bottom-10 right-12 h-52 w-52 rounded-full border border-orange-300/25" />
            <div className="absolute left-1/4 top-1/2 h-1 w-72 -rotate-12 rounded-full bg-cyan-300/40 blur-sm" />
            <div className="absolute right-16 top-10 h-36 w-1 rotate-45 rounded-full bg-orange-300/40 blur-sm" />
            {units.map((unit) => (
              <div key={unit.name} className="absolute" style={{ left: unit.x, top: unit.y }}>
                <span className={`block h-4 w-4 rounded-full ${unit.color} shadow-lg shadow-current ring-4 ring-white/20`} />
                <span className="mt-2 block rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">{unit.name}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase text-slate-400">{kpi.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{kpi.value}</p>
                <p className="mt-1 text-xs font-medium text-cyan-600">{kpi.trend}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Priority queue</h3>
              <button className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white">New ticket</button>
            </div>
            <div className="space-y-3">
              {incidents.map((incident) => (
                <div key={incident.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-900">{incident.type}</p>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${incident.tone}`}>{incident.status}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{incident.id} · {incident.area}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default function BriefFlowHero() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#eef7fb] font-inter text-slate-900">
      <div className="absolute left-[-8rem] top-[-8rem] h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute bottom-[-10rem] right-[-8rem] h-96 w-96 rounded-full bg-orange-300/30 blur-3xl" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-cyan-300">PUC</div>
          <div>
            <p className="text-lg font-black">SmartOne Dispatch</p>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Public utility command</p>
          </div>
        </div>
        <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
          <a href="#platform">Platform</a>
          <a href="#workflow">Workflow</a>
          <a href="#contact">Contact</a>
        </nav>
        <button className="rounded-full bg-white px-5 py-2.5 text-sm font-bold shadow-sm ring-1 ring-slate-200">Request demo</button>
      </header>

      <main className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] max-w-7xl items-center gap-12 px-6 pb-14 pt-8 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
        <section>
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-bold text-cyan-700 shadow-sm ring-1 ring-cyan-100">Real-time dispatch for utility teams</span>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight text-slate-950 md:text-7xl">
            Coordinate every crew, outage, and field response from one command center.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            PUC SmartOne Dispatch unifies incident intake, radio communication, GPS tracking, and service restoration workflows in a single resilient operations dashboard.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-full bg-cyan-500 px-7 py-4 text-base font-black text-white shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400">Launch console</button>
            <button className="rounded-full bg-white px-7 py-4 text-base font-black text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50">View capabilities</button>
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            <p className="text-sm font-semibold text-slate-500"><span className="block text-2xl font-black text-slate-950">24/7</span> uptime monitoring</p>
            <p className="text-sm font-semibold text-slate-500"><span className="block text-2xl font-black text-slate-950">GPS</span> asset visibility</p>
            <p className="text-sm font-semibold text-slate-500"><span className="block text-2xl font-black text-slate-950">E2E</span> secure comms</p>
          </div>
        </section>

        <DispatchConsole />
      </main>
    </div>
  )
}
