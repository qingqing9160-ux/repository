const tags = [
  {
    label: '高大上！',
    className: 'bg-rose-100 text-gray-800',
    position: 'top-[18%] left-[18%]',
  },
  {
    label: '字要大！',
    className: 'bg-amber-50 text-gray-800',
    position: 'top-[14%] right-[14%]',
  },
  {
    label: '五彩斑斓的黑！',
    className: 'bg-indigo-100 text-gray-800',
    position: 'top-[55%] left-[12%]',
  },
  {
    label: '要吸睛！',
    className: 'bg-emerald-100 text-gray-800',
    position: 'top-[60%] right-[14%]',
  },
]

function MascotFace() {
  return (
    <div
      className="relative rounded-full"
      style={{
        width: 360,
        height: 360,
        background: 'radial-gradient(circle at 60% 40%, #F7C5B8 0%, #F09080 45%, #E87060 100%)',
        boxShadow: '0 20px 60px rgba(232, 115, 90, 0.25)',
      }}
    >
      {/* Top-left white highlight */}
      <div
        className="absolute rounded-full bg-white opacity-90"
        style={{ width: 52, height: 52, top: '22%', left: '28%' }}
      />

      {/* Bottom-right white highlight */}
      <div
        className="absolute rounded-full bg-white opacity-90"
        style={{ width: 38, height: 38, top: '55%', left: '62%' }}
      />

      {/* Left eye */}
      <div
        className="absolute bg-gray-800 rounded-full"
        style={{
          width: 22,
          height: 30,
          top: '38%',
          left: '36%',
          borderRadius: '50%',
        }}
      />

      {/* Right eye */}
      <div
        className="absolute bg-gray-800 rounded-full"
        style={{
          width: 22,
          height: 30,
          top: '38%',
          left: '56%',
          borderRadius: '50%',
        }}
      />

      {/* Smile */}
      <div
        className="absolute"
        style={{
          width: 56,
          height: 28,
          top: '60%',
          left: '50%',
          transform: 'translateX(-50%)',
          borderBottom: '4px solid #333',
          borderLeft: '4px solid #333',
          borderRight: '4px solid #333',
          borderTop: 'none',
          borderRadius: '0 0 40px 40px',
        }}
      />
    </div>
  )
}

export default function BriefFlowHero() {
  return (
    <div className="min-h-screen bg-white font-inter flex flex-col">
      {/* Header */}
      <header className="px-10 pt-8">
        <span
          className="text-2xl font-extrabold italic"
          style={{ color: '#E8735A' }}
        >
          BriefFlow
        </span>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 pb-16">
        {/* Mascot + floating tags */}
        <div className="relative flex items-center justify-center" style={{ width: 700, height: 500 }}>
          {/* Floating tags */}
          {tags.map((tag) => (
            <div
              key={tag.label}
              className={`absolute px-4 py-2.5 rounded-xl text-sm font-medium shadow-sm whitespace-nowrap ${tag.className} ${tag.position}`}
            >
              {tag.label}
            </div>
          ))}

          {/* Mascot face */}
          <MascotFace />
        </div>

        {/* Headline */}
        <h1 className="mt-6 text-3xl font-bold text-center text-gray-800 leading-snug">
          从模糊到清晰，
          <span style={{ color: '#E8735A' }}>轻松搞定设计需求</span>
        </h1>

        {/* CTA Button */}
        <button
          className="mt-8 px-10 py-3 rounded-full text-white font-semibold text-base transition-opacity hover:opacity-90 active:opacity-80"
          style={{ background: 'linear-gradient(135deg, #F0846A 0%, #E86050 100%)' }}
        >
          Start →
        </button>
      </main>
    </div>
  )
}
