function parseOpeningTime(hours, period) {
  const match = hours?.match(
    /(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i,
  )
  if (!match) return ''

  const hour = period === 'from' ? Number(match[1]) : Number(match[4])
  const minute = period === 'from' ? match[2] : match[5]
  const meridiem = (period === 'from' ? match[3] : match[6]).toUpperCase()
  const hour24 = (hour % 12) + (meridiem === 'PM' ? 12 : 0)
  return `${String(hour24).padStart(2, '0')}:${minute}`
}

function PlaceEditModal({ place, categories, notice, onClose, onSave }) {
  if (!place) return null

  const isNewPlace = !place.id
  const placeImages = place.images?.length ? place.images : [place.image || '']
  const placeCategories = place.categories?.length ? place.categories : [place.type].filter(Boolean)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-8 p-6 sm:p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-title"
      >
        <button
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-all"
          type="button"
          aria-label="Close editor"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <span className="text-sm font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            Attraction Details
          </span>
          <h2 id="edit-title" className="text-2xl font-extrabold text-stone-900 mt-2">
            {isNewPlace ? 'Add New Attraction' : 'Edit Attraction Information'}
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Provide images, geographic coordinates, and visitor details for Padalangala day travelers.
          </p>
        </div>

        {notice && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-sm font-semibold text-rose-800 flex items-center gap-2" role="alert">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={onSave} className="space-y-5 text-left">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Attraction Name
            </label>
            <input
              name="name"
              defaultValue={place.name}
              placeholder="e.g. Ridiyagama Safari Park"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Categories <span className="text-stone-400 font-normal lowercase">(select one or more)</span>
            </label>
            <div className="flex flex-wrap gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200">
              {categories.map((category) => (
                <label
                  key={category}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-stone-200/80 rounded-xl text-sm font-semibold text-stone-700 hover:border-emerald-300 cursor-pointer transition-colors shadow-xs"
                >
                  <input
                    name="categories"
                    type="checkbox"
                    value={category}
                    defaultChecked={placeCategories.includes(category)}
                    className="rounded text-emerald-800 focus:ring-emerald-700"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Distance and Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Distance from Padalangala
              </label>
              <input
                name="distance"
                defaultValue={place.distance}
                placeholder="e.g. 8.3 km"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Estimated Visit Duration
              </label>
              <input
                name="duration"
                defaultValue={place.duration}
                placeholder="e.g. 1.5 hrs"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Image URLs <span className="text-stone-400 font-normal lowercase">(3 URLs required)</span>
            </label>
            <div className="space-y-2">
              {[0, 1, 2].map((index) => (
                <input
                  key={index}
                  name="images"
                  type="url"
                  defaultValue={placeImages[index] || ''}
                  placeholder={`Photo URL ${index + 1} (https://...)`}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
                />
              ))}
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Latitude (-90 to 90)
              </label>
              <input
                name="latitude"
                type="number"
                min="-90"
                max="90"
                step="any"
                defaultValue={place.latitude ?? ''}
                placeholder="e.g. 6.1524"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Longitude (-180 to 180)
              </label>
              <input
                name="longitude"
                type="number"
                min="-180"
                max="180"
                step="any"
                defaultValue={place.longitude ?? ''}
                placeholder="e.g. 81.0184"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all font-mono"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Opening Time
              </label>
              <input
                name="openingFrom"
                type="time"
                defaultValue={place.openingFrom || parseOpeningTime(place.hours, 'from')}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Closing Time
              </label>
              <input
                name="openingTo"
                type="time"
                defaultValue={place.openingTo || parseOpeningTime(place.hours, 'to')}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Highlight Tag / Catchphrase
            </label>
            <input
              name="tag"
              defaultValue={place.tag}
              placeholder="e.g. Meet Sri Lanka’s wildlife"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Detailed Description
            </label>
            <textarea
              name="description"
              rows="3"
              defaultValue={place.description}
              placeholder="Full description of the attraction..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold shadow-sm transition-colors"
            >
              {isNewPlace ? 'Add Attraction' : 'Save Changes'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default PlaceEditModal
