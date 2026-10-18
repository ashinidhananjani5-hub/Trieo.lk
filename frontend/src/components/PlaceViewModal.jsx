import { useEffect, useEffectEvent, useRef, useState } from 'react'

function PlaceViewModal({ place, onClose }) {
  const dialog = useRef(null)
  const closeFromKeyboard = useEffectEvent(() => onClose())
  useEffect(() => {
    if (!place) return
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector('button')?.focus()
    const handleKey = event => {
      if (event.key === 'Escape') closeFromKeyboard()
      if (event.key !== 'Tab') return
      const controls = [...dialog.current.querySelectorAll('button, a[href], iframe')]
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', handleKey)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', handleKey); previous?.focus() }
  }, [place])
  if (!place) return null
  const categories = place.categories || [place.type].filter(Boolean)
  const images = place.images?.length ? place.images : [place.image].filter(Boolean)

  const extra = [
    ['Entrance fee', place.entranceFee, 'Entrance fee details have not been added yet.'],
    ['Travel tips', place.travelTips, 'Travel tips have not been added yet.'],
    ['Facilities', place.facilities, 'Facility details have not been added yet.'],
  ]
  return <div className="place-details-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section ref={dialog} className="place-details-dialog" role="dialog" aria-modal="true" aria-labelledby="place-view-title">
      <header className="place-details-header"><div><span className="eyebrow">EXPLORE THIS ATTRACTION</span><h2 id="place-view-title">{place.name}</h2></div><button type="button" onClick={onClose} aria-label="Close place details">×</button></header>
      <div className="place-details-scroll">
        {images.length > 0 && <div className={`place-details-gallery ${images.length === 1 ? 'single-photo' : ''}`}>{images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${place.name}, photo ${index + 1}`} />)}</div>}
        <div className="place-details-content">
          <div className="place-details-categories">{categories.map(category => <span key={category}>{category}</span>)}</div>
          {place.tag && <p className="place-details-highlight">{place.tag}</p>}
          <p className="place-details-description">{place.description || 'A description has not been added yet.'}</p>
          <section className="place-visit-section" aria-labelledby="visit-info-title"><h3 id="visit-info-title">Plan your visit</h3><dl className="place-visit-grid">
            <div><dt>Distance from Padalangala</dt><dd>{place.distance || 'Not available yet'}</dd></div>
            <div><dt>Estimated visit time</dt><dd>{place.duration || 'Not available yet'}</dd></div>
            <div><dt>Opening hours</dt><dd>{place.hours || 'Not available yet'}</dd></div>
          </dl></section>
          <section className="place-practical-section" aria-labelledby="practical-title"><h3 id="practical-title">Good to know</h3><dl>{extra.map(([label, value, fallback]) => { const text = Array.isArray(value) ? value.filter(Boolean).join(' · ') : value; const available = text != null && text !== ''; return <div key={label}><dt>{label}</dt><dd className={available ? '' : 'detail-unavailable'}>{available ? text : fallback}</dd></div> })}</dl></section>
          <PlaceMap key={place.id} place={place} />
        </div>
      </div>
      <footer className="place-details-footer"><p>Check the latest opening hours and fees before visiting.</p><button type="button" onClick={onClose}>Done</button></footer>
    </section>
  </div>
}

function PlaceMap({ place }) {
  const [failed, setFailed] = useState(false)
  const valid = Number.isFinite(place.latitude) && Math.abs(place.latitude) <= 90 && Number.isFinite(place.longitude) && Math.abs(place.longitude) <= 180
  const lat = place.latitude, lon = place.longitude
  const bbox = valid ? `${Math.max(-180, lon - .025)},${Math.max(-90, lat - .018)},${Math.min(180, lon + .025)},${Math.min(90, lat + .018)}` : ''
  return <section className="place-map"><h3>Location on map</h3>{valid ? <>{!failed && <iframe title={`OpenStreetMap location of ${place.name}`} src={`https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${lat}%2C${lon}`} loading="lazy" onError={() => setFailed(true)} />}<p>{failed ? 'The map service is unavailable. You can still view the place details.' : 'If the embedded map does not load, open the map directly below.'}</p><a href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=15/${lat}/${lon}`} target="_blank" rel="noreferrer">Open in OpenStreetMap &gt;</a></> : <p>Location information is not available for this place yet.</p>}</section>
}

export default PlaceViewModal
