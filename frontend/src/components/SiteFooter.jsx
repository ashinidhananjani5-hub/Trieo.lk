const CURRENT_YEAR = new Date().getFullYear()

function SiteFooter() {
  return (
    <footer className="w-full mt-auto border-t border-stone-200/80 bg-white/60 backdrop-blur-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1b4332] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              T
            </div>
            <div>
              <p className="font-bold text-stone-900 text-sm tracking-tight">Trieo.lk</p>
              <p className="text-xs text-stone-500">Local Tourist Day-Visit Planner · Padalangala, Sri Lanka</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-stone-600">
            <a href="#discover" className="hover:text-emerald-800 transition-colors">
              Discover
            </a>
            <a href="#places" className="hover:text-emerald-800 transition-colors">
              Attractions
            </a>
            <a href="#how-it-works" className="hover:text-emerald-800 transition-colors">
              How It Works
            </a>
            <a href="#about" className="hover:text-emerald-800 transition-colors">
              About
            </a>
          </div>

          <p className="text-xs text-stone-400">
            © {CURRENT_YEAR} Trieo.lk. Exploring local experiences, one day at a time.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
