import { useState } from 'react'

function TouristDashboard({ places, savedPlaces, userName, notice, onToggleSavedPlace }) {
  const [filterCategory, setFilterCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [isPlanDrawerOpen, setIsPlanDrawerOpen] = useState(false)

  const savedList = places.filter((place) => savedPlaces.includes(place.id))

  const allCategories = ['All', ...new Set(places.flatMap((p) => p.categories || [p.type]))]

  const filteredPlaces = places.filter((place) => {
    const matchesCategory =
      filterCategory === 'All' ||
      (place.categories && place.categories.includes(filterCategory)) ||
      place.type === filterCategory

    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (place.tag && place.tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCategory && matchesSearch
  })

  return (
    <main className="w-full flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 1. Header with Stats Bar */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-emerald-50 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-sm font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              Tourist Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-stone-900 tracking-tight">
              Plan your Padalangala day,{' '}
              <span className="text-[#1b4332]">{userName ? userName.split(' ')[0] : 'Explorer'}</span>.
            </h1>
            <p className="text-stone-600 text-sm sm:text-base mt-1.5 max-w-2xl">
              Curate your custom day itinerary. Select attractions below and review your day plan route in real time.
            </p>
          </div>

          {/* Quick Metrics / Day Plan Shortcut */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Saved Count Badge */}
            <div className="bg-stone-50 border border-stone-200/90 rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#1b4332] text-white flex items-center justify-center font-extrabold text-lg shadow-xs">
                {savedPlaces.length}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-stone-900">
                  {savedPlaces.length === 1 ? 'Place Saved' : 'Places Saved'}
                </span>
                <span className="text-sm text-stone-500">In your itinerary</span>
              </div>
            </div>

            {/* Drawer Toggle Button */}
            <button
              type="button"
              onClick={() => setIsPlanDrawerOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm hover:shadow active:scale-95 transition-all"
            >
              <svg className="w-4 h-4 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>View Day Plan ({savedPlaces.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Notice Alert if Present */}
      {notice && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-emerald-900 flex items-center gap-3 shadow-xs" role="status">
          <svg className="w-5 h-5 text-emerald-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{notice}</span>
        </div>
      )}

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attractions..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all placeholder:text-stone-400 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {allCategories.map((cat) => {
            const isSelected = filterCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-600 border border-stone-200/70'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>

      {/* 3. Responsive 4-Column Grid of Attractions */}
      <div className="mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">
            Attractions Near Padalangala ({filteredPlaces.length})
          </h2>
        </div>

        {filteredPlaces.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
            <p className="text-stone-500 font-medium">No places found matching your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPlaces.map((place) => {
              const isSaved = savedPlaces.includes(place.id)
              const displayCategories = place.categories || [place.type]

              return (
                <article
                  key={place.id}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-lg flex flex-col justify-between ${
                    isSaved ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-stone-200/80 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    {/* Image with Badges */}
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-100">
                      <img
                        src={place.images?.[0] || place.image}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full text-sm font-bold bg-white/95 text-emerald-900 shadow-xs backdrop-blur-xs">
                          {displayCategories[0]}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2.5 py-1 rounded-full text-sm font-bold bg-black/65 text-white backdrop-blur-xs">
                          {place.distance}
                        </span>
                      </div>
                      {isSaved && (
                        <div className="absolute top-3 right-3 bg-emerald-600 text-white rounded-full p-1 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-base text-stone-900 line-clamp-1">{place.name}</h3>
                      <p className="text-sm text-stone-500 mt-1 line-clamp-2 leading-relaxed">{place.description}</p>
                    </div>
                  </div>

                  {/* Card Footer & Action Button */}
                  <div className="px-5 pb-5 pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-stone-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {place.duration}
                    </span>

                    <button
                      type="button"
                      onClick={() => onToggleSavedPlace(place.id)}
                      className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                        isSaved
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-[#1b4332] border border-emerald-200'
                      }`}
                    >
                      {isSaved ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span>Remove</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                          </svg>
                          <span>Add to plan</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>

      {/* 4. Embedded Itinerary Overview Section */}
      <section className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-100">
          <div>
            <span className="text-sm font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Your Itinerary Outline
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mt-2">
              {savedList.length > 0 ? `Saved Destinations (${savedList.length})` : 'Your Day Plan is Empty'}
            </h2>
          </div>
          {savedList.length > 0 && (
            <button
              type="button"
              onClick={() => setIsPlanDrawerOpen(true)}
              className="text-sm font-bold text-[#1b4332] hover:text-[#2d6a4f] flex items-center gap-1"
            >
              <span>Open Full Plan Drawer</span>
              <span aria-hidden="true">→</span>
            </button>
          )}
        </div>

        {savedList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedList.map((place, index) => (
              <div
                key={place.id}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1b4332] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  0{index + 1}
                </div>
                <img
                  src={place.images?.[0] || place.image}
                  alt={place.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-stone-900 text-sm truncate">{place.name}</h4>
                  <p className="text-sm text-stone-500">{place.distance} · {place.duration}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleSavedPlace(place.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove from plan"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 mx-auto flex items-center justify-center font-bold text-xl mb-3">
              ✦
            </div>
            <p className="text-stone-700 font-semibold text-sm">No attractions added yet.</p>
            <p className="text-stone-500 text-sm mt-1">
              Browse the destinations above and click <strong>"Add to plan"</strong> to start assembling your one-day visit.
            </p>
          </div>
        )}
      </section>

      {/* 5. Dynamic Slide-Over "Your Day Plan" Drawer */}
      {isPlanDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsPlanDrawerOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
                <div>
                  <span className="text-sm font-bold uppercase tracking-wider text-emerald-800">
                    Tourist Itinerary
                  </span>
                  <h3 id="slide-over-title" className="text-xl font-bold text-stone-900 mt-1">
                    Your Padalangala Day Plan
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPlanDrawerOpen(false)}
                  className="p-2 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-200/60"
                  aria-label="Close drawer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {savedList.length > 0 ? (
                  <>
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between text-sm font-semibold text-emerald-900">
                      <span>Total Planned Stops:</span>
                      <span className="font-extrabold text-sm">{savedList.length} attractions</span>
                    </div>

                    <div className="space-y-3">
                      {savedList.map((place, index) => (
                        <div
                          key={place.id}
                          className="p-4 rounded-2xl border border-stone-200 bg-white shadow-xs flex items-center gap-3.5 relative"
                        >
                          <span className="w-7 h-7 rounded-lg bg-[#1b4332] text-white flex items-center justify-center text-sm font-bold shrink-0">
                            {index + 1}
                          </span>
                          <img
                            src={place.images?.[0] || place.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-stone-900 text-sm truncate">{place.name}</h4>
                            <p className="text-sm text-stone-500 mt-0.5">{place.distance} · {place.duration}</p>
                            <p className="text-sm text-emerald-700 font-medium mt-0.5">{place.hours}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onToggleSavedPlace(place.id)}
                            className="text-stone-400 hover:text-rose-600 p-1.5"
                            title="Remove"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-16 text-stone-500">
                    <p className="font-semibold text-sm">Your plan is empty.</p>
                    <p className="text-sm text-stone-400 mt-1">Add destinations from the dashboard to review your schedule here.</p>
                  </div>
                )}
              </div>

              {/* Drawer Footer Actions */}
              <div className="p-6 border-t border-stone-200 bg-stone-50/50 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlanDrawerOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-bold text-sm shadow-sm transition-colors text-center"
                >
                  Done Planning
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default TouristDashboard
