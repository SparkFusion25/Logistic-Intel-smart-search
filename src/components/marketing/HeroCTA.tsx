export default function HeroCTA() {
  return (
    <div className="p-6 sm:p-8">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6" 
          style={{ color: 'var(--text)' }}>
        Search global trade. Close more freight deals.
      </h1>
      <p className="text-lg sm:text-xl mb-6 max-w-xl leading-relaxed" 
         style={{ color: 'var(--text-muted)' }}>
        Company-first search across US import/export data with integrated CRM and outreach.
      </p>
      
      {/* Feature badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          "Company-first search",
          "Add to CRM in one click", 
          "Apollo enrichment ready"
        ].map((badge, i) => (
          <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  background: 'var(--brand-50)',
                  color: 'var(--brand-700)'
                }}>
            {badge}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        <a
          href="/signup"
          className="gradient-cta inline-flex items-center rounded-2xl px-6 py-3 font-semibold shadow-lg transition hover:brightness-110"
        >
          Start Free
        </a>
        <a
          href="/login?demo=true"
          className="inline-flex items-center rounded-2xl px-6 py-3 font-semibold transition"
          style={{ 
            color: 'var(--brand-700)',
            background: 'transparent'
          }}
        >
          See Live Demo
        </a>
      </div>
    </div>
  );
}