import { useEffect, useRef, useState } from 'react'

function PlaceViewModal({ place, onClose }) {
  const dialog = useRef(null)
  useEffect(() => {
    if (!place) return
    const previous = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector('button')?.focus()
    const handleKey = event => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const elements = [...dialog.current.querySelectorAll('button, a[href], iframe, input, [tabindex="0"]')].filter(element => !element.disabled)
      const first = elements[0], last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', handleKey); previous?.focus() }
  }, [place, onClose])
  if (!place) return null

  const categories = place.categories || [place.type].filter(Boolean)
  const images = place.images?.length ? place.images : [place.image].filter(Boolean)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialog}
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-view-title"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-stone-600 hover:text-stone-900 flex items-center justify-center shadow-md transition-all"
          type="button"
          aria-label="Close place details"
          onClick={onClose}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero Gallery Grid */}
        <div className="grid grid-cols-3 gap-1 bg-stone-100 max-h-72 overflow-hidden">
          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${place.name}, photo ${index + 1}`}
              className={`w-full h-56 object-cover ${index === 0 && images.length === 1 ? 'col-span-3 h-64' : ''}`}
            />
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {categories.map((category) => (
              <span
                key={category}
                className="px-3 py-1 rounded-full text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-100"
              >
                {category}
              </span>
            ))}
          </div>

          <h2 id="place-view-title" className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {place.name}
          </h2>
          <p className="text-sm font-semibold text-emerald-700 mt-1">{place.tag}</p>

          <p className="text-sm text-stone-600 leading-relaxed mt-4">
            {place.description}
          </p>

          {/* Quick Metrics dl */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-100 text-left">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="text-sm font-bold uppercase text-stone-400 block">Distance</span>
              <span className="text-sm font-bold text-stone-900 mt-0.5 block">{place.distance}</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="text-sm font-bold uppercase text-stone-400 block">Duration</span>
              <span className="text-sm font-bold text-stone-900 mt-0.5 block">{place.duration}</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="text-sm font-bold uppercase text-stone-400 block">Hours</span>
              <span className="text-sm font-bold text-stone-900 mt-0.5 block">{place.hours}</span>
            </div>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60">
              <span className="text-sm font-bold uppercase text-stone-400 block">Location</span>
              <span className="text-sm font-mono font-bold text-stone-900 mt-0.5 block truncate">
                {place.latitude != null && place.longitude != null ? `${place.latitude}, ${place.longitude}` : 'N/A'}
              </span>
            </div>
          </div>

          <dl className="place-extra-details">
            <div><dt>Entrance fee</dt><dd>{place.entranceFee || 'Information not available'}</dd></div>
            <div><dt>Travel tips</dt><dd>{Array.isArray(place.travelTips) ? place.travelTips.join(' · ') || 'Information not available' : place.travelTips || 'Information not available'}</dd></div>
            <div><dt>Facilities</dt><dd>{Array.isArray(place.facilities) ? place.facilities.join(' · ') || 'Information not available' : place.facilities || 'Information not available'}</dd></div>
          </dl>
          <PlaceMap key={place.id} place={place} />
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-sm font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

function PlaceMap({ place }) {
  const [failed, setFailed] = useState(false)
  const valid = Number.isFinite(place.latitude) && Math.abs(place.latitude) <= 90 && Number.isFinite(place.longitude) && Math.abs(place.longitude) <= 180
  const lat = place.latitude, lon = place.longitude
  const bbox = valid ? `${Math.max(-180, lon - .025)},${Math.max(-90, lat - .018)},${Math.min(180, lon + .025)},${Math.min(90, lat + .018)}` : ''
  return <section className="place-map"><h3>Location on map</h3>{valid ? <>{!failed && <iframe title={`OpenStreetMap location of ${place.name}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`} loading="lazy" onError={() => setFailed(true)} />}<p>{failed ? 'The map service is unavailable. You can still view the place details.' : 'If the embedded map does not load, open the map directly below.'}</p><a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`} target="_blank" rel="noreferrer">Open in OpenStreetMap ↗</a></> : <p>Location information is not available for this place yet.</p>}</section>
}

export default PlaceViewModal
