import { useState } from 'react'
import { featureItems, slides } from '../../data/landingContent.js'

function HomePage({ places, onOpenLogin, slideIndex, onSlideChange }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const activeSlide = slides[slideIndex]

  // Extract unique categories for quick filtering
  const allCategories = ['All', ...new Set(places.flatMap((p) => p.categories || [p.type]))]

  const filteredPlaces = places.filter((place) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (place.categories && place.categories.includes(selectedCategory)) ||
      place.type === selectedCategory

    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.tag && place.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  return (
    <main className="w-full flex-1">
      {/* 1. Full-Bleed Hero Banner */}
      <section
        className="relative w-full h-[600px] sm:h-[640px] lg:h-[700px] flex items-center justify-center overflow-hidden transition-all duration-700 bg-stone-900"
        aria-label="Featured destinations"
      >
        {/* Background Image with Crossfade Transition */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 transform scale-105"
          style={{ backgroundImage: `url("${activeSlide.image}")` }}
        />

        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-emerald-950/20 to-black/60 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-emerald-200 text-xs sm:text-sm font-semibold tracking-wide uppercase shadow-lg mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {activeSlide.eyebrow}
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15] mb-6 drop-shadow-md">
            {activeSlide.title}
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-stone-200 max-w-2xl leading-relaxed mb-9 drop-shadow-sm font-normal">
            {activeSlide.description}
          </p>

          {/* Hero Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto">
            <a
              href="#places"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-emerald-950/30 hover:shadow-xl hover:shadow-emerald-900/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>{activeSlide.action}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <button
              type="button"
              onClick={() => onOpenLogin('Tourist')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/30 hover:border-white/50 shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              <span>Plan as a Tourist</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* Slide Controls */}
        <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            aria-label="Previous slide"
            onClick={() => onSlideChange((slideIndex + slides.length - 1) % slides.length)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={`transition-all duration-300 rounded-full ${
                  index === slideIndex ? 'w-7 h-2 bg-emerald-400' : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => onSlideChange(index)}
              />
            ))}
          </div>

          <button
            type="button"
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-all shadow-md active:scale-95"
            aria-label="Next slide"
            onClick={() => onSlideChange((slideIndex + 1) % slides.length)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>

      {/* 2. Floating Search / Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl shadow-stone-900/5 border border-stone-200/80 p-4 sm:p-5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attractions (e.g. Safari, Hot spring, Park)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/70 focus:bg-white text-stone-800 placeholder-stone-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-400 hover:text-stone-600 text-xs font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {allCategories.map((cat) => {
              const isSelected = selectedCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                    isSelected
                      ? 'bg-[#1b4332] text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 3. Discover Attractions Grid */}
      <section id="places" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div id="discover" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Small town, big experiences
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
              Discover Padalangala Attractions
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-2xl">
              Wildlife, natural hot springs, and relaxing green landscapes all within a convenient day trip radius.
            </p>
          </div>
          <div className="text-sm font-semibold text-stone-500 whitespace-nowrap">
            Showing <span className="text-emerald-900 font-bold">{filteredPlaces.length}</span> destinations
          </div>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200/80 p-8 shadow-xs">
            <p className="text-stone-500 font-medium">No attractions found matching your search or filter.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All')
                setSearchQuery('')
              }}
              className="mt-4 px-4 py-2 bg-emerald-800 text-white rounded-full text-sm font-semibold hover:bg-emerald-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredPlaces.map((place) => {
              const displayCategories = place.categories || [place.type]
              return (
                <article
                  key={place.id}
                  className="group bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200/80 transition-all duration-300 flex flex-col transform hover:-translate-y-1"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                    <img
                      src={place.images?.[0] || place.image}
                      alt={place.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/95 text-emerald-900 shadow-sm backdrop-blur-xs">
                        {displayCategories[0]}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/65 text-white backdrop-blur-xs">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        {place.distance}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-stone-900 group-hover:text-emerald-800 transition-colors leading-snug">
                        {place.name}
                      </h3>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">{place.tag}</p>
                      <p className="text-xs text-stone-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{place.duration}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenLogin('Tourist')}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 group/btn"
                      >
                        <span>Plan a visit</span>
                        <span className="transform group-hover/btn:translate-x-1 transition-transform" aria-hidden="true">→</span>
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="w-full bg-stone-100/70 border-y border-stone-200/60 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Your day, made simple
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
              From Inspiration to Itinerary in 3 Steps
            </h2>
            <p className="text-stone-600 text-sm sm:text-base mt-2">
              Everything designed to help you spend more time enjoying Sri Lanka and less time guessing routes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                number: '01',
                title: 'Discover',
                text: 'Explore local wildlife parks, agro centers, and hot springs with accurate distance and visit estimates.',
                icon: (
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                number: '02',
                title: 'Choose & Save',
                text: 'Select your preferred attractions and add them to your day plan with a single tap.',
                icon: (
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                ),
              },
              {
                number: '03',
                title: 'Set Out With Confidence',
                text: 'Review hours, recommended time, and map coordinates before you start your Padalangala adventure.',
                icon: (
                  <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-8 border border-stone-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-3xl font-extrabold text-stone-200 font-sans">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Features Grid & Bottom CTA */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Made for local discovery
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight mt-3">
            Everything You Need for a Better Day Out
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {featureItems.map(([icon, title, text]) => (
            <div
              key={title}
              className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:shadow-md transition-all duration-200 hover:border-emerald-200"
            >
              <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center font-bold text-base mb-4 shadow-xs">
                {icon}
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-2">{title}</h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white p-8 sm:p-12 lg:p-16 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-200 bg-white/10 px-3 py-1 rounded-full backdrop-blur-xs">
              Ready to explore?
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mt-4 leading-snug">
              Your Padalangala day starts with Trieo.lk
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 mt-3 max-w-xl">
              Create an account or sign in to build your personalized one-day itinerary with real-time saved destinations.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={() => onOpenLogin('Tourist')}
                className="px-7 py-3.5 rounded-full bg-white text-[#1b4332] font-bold text-sm hover:bg-emerald-50 active:scale-95 transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
              >
                <span>Create a Day Plan</span>
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default HomePage
