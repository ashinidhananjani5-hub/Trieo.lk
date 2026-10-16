import { useEffect, useEffectEvent, useRef, useState } from 'react'

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

function PlaceEditModal({ place, categories, notice, onClose, onSave, saving }) {
  const dialog = useRef(null)
  const closeFromKeyboard = useEffectEvent(() => onClose())
  const alert = useRef(null)
  const sections = [
    ['about', 'About the attraction', 'Name & introduction'],
    ['visit', 'Visit information', 'Times & distance'],
    ['visitor', 'Good to know', 'Fees, tips & facilities'],
    ['photos', 'Photos', 'Up to five images'],
    ['location', 'Map location', 'Latitude & longitude'],
  ]
  const jumpToSection = id => {
    const section = dialog.current?.querySelector(`#editor-section-${id}`)
    section?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    section?.focus({ preventScroll: true })
  }
  useEffect(() => {
    if (!place) return
    const previous = document.activeElement
    const overflow = document.body.style.overflow
    // Lock background scrolling for the lifetime of the full-screen editor.
    // oxlint-disable-next-line react/immutability
    document.body.style.overflow = 'hidden'
    dialog.current?.querySelector('input')?.focus()
    const keydown = event => {
      if (event.key === 'Escape') closeFromKeyboard()
      if (event.key !== 'Tab') return
      const controls = [...dialog.current.querySelectorAll('button, input, textarea')].filter(item => !item.disabled)
      const first = controls[0], last = controls[controls.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', keydown)
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keydown); previous?.focus() }
  }, [place])
  useEffect(() => { if (place && notice) alert.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' }) }, [notice, place])
  if (!place) return null
  const images = place.images?.length ? place.images : [place.image || '']
  const selected = place.categories?.length ? place.categories : [place.type].filter(Boolean)
  return <div className="place-editor-overlay" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
    <section ref={dialog} className="place-editor" role="dialog" aria-modal="true" aria-labelledby="edit-title" aria-describedby="edit-help">
      <header className="place-editor-header"><div><span className="eyebrow">DESTINATION MANAGEMENT</span><h2 id="edit-title">{place.id ? 'Edit attraction' : 'Add a new attraction'}</h2><p id="edit-help">Help visitors discover this place. Fields marked <span aria-hidden="true">*</span> are required.</p></div><button type="button" className="editor-close" aria-label="Close attraction editor" disabled={saving} onClick={onClose}>×</button></header>
      <form onSubmit={onSave} className="place-editor-form">
        <div className="place-editor-body">
          <div className="editor-layout">
            <nav className="editor-section-navigation" aria-label="Attraction form sections">
              <span className="editor-nav-label">IN THIS FORM</span>
              {sections.map(([id, title, subtitle], index) => <button key={id} type="button" onClick={() => jumpToSection(id)} aria-controls={`editor-section-${id}`}><span className="editor-nav-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{title}</strong><small>{subtitle}</small></span><span className="editor-nav-arrow" aria-hidden="true">&gt;</span></button>)}
              <div className="editor-navigation-note"><strong>A helpful first impression</strong><p>Clear photos and accurate visitor details make it easier to plan a great day out.</p></div>
            </nav>
            <div className="editor-fields-column">
          {notice && <div ref={alert} className="editor-alert" role="alert">{notice}</div>}
          <fieldset className="editor-section" id="editor-section-about" tabIndex={-1}><legend><span>01</span> About the attraction</legend><p className="editor-section-help">Start with a name, category, and a helpful introduction.</p>
            <EditorField name="name" label="Attraction name" value={place.name} placeholder="e.g. Ridiyagama Safari Park" />
            <fieldset className="editor-categories"><legend>Categories <span aria-hidden="true">*</span></legend><p>Choose at least one category.</p><div>{categories.map(category => <label key={category}><input type="checkbox" name="categories" value={category} defaultChecked={selected.includes(category)} /><span>{category}</span></label>)}</div>{!categories.length && <p>Add a category in category management first.</p>}</fieldset>
            <EditorField name="tag" label="Short highlight" value={place.tag} placeholder="e.g. Meet Sri Lanka’s wildlife" hint="A short line to help visitors understand what makes this place special." />
            <div className="editor-field"><label htmlFor="edit-description">Description <span aria-hidden="true">*</span></label><textarea id="edit-description" name="description" defaultValue={place.description} rows={4} required placeholder="Describe the experience, highlights, and what visitors can expect…" /></div>
          </fieldset>
          <fieldset className="editor-section" id="editor-section-visit" tabIndex={-1}><legend><span>02</span> Visit information</legend><p className="editor-section-help">Give visitors an idea of the time and distance involved.</p><div className="editor-two-columns"><EditorField name="distance" label="Distance from Padalangala" value={place.distance} placeholder="e.g. 8.3 km" hint="Include the distance unit (km)." /><EditorField name="duration" label="Estimated visit duration" value={place.duration} placeholder="e.g. 1.5 hrs" hint="Time spent at the attraction, not travel time." /><EditorField name="openingFrom" label="Opening time" type="time" value={place.openingFrom || parseOpeningTime(place.hours, 'from')} /><EditorField name="openingTo" label="Closing time" type="time" value={place.openingTo || parseOpeningTime(place.hours, 'to')} /></div></fieldset>
          <fieldset className="editor-section" id="editor-section-visitor" tabIndex={-1}>
            <legend><span>03</span> Good to know</legend>
            <p className="editor-section-help">Add verified visitor information when available. Leave unknown details blank.</p>
            <EditorField name="entranceFee" label="Entrance fee" required={false} value={place.entranceFee ?? ''} maxLength={500} placeholder="e.g. Adults: LKR 500, Children: LKR 250" hint="Include the currency and ticket types. Enter Free only if entry is confirmed free." />
            <div className="editor-field"><label htmlFor="edit-travelTips">Travel tips <span className="editor-optional">(optional)</span></label><textarea id="edit-travelTips" name="travelTips" rows={3} maxLength={5000} defaultValue={Array.isArray(place.travelTips) ? place.travelTips.join('\n') : place.travelTips || ''} aria-describedby="edit-travelTips-hint" placeholder="e.g. Visit early in the morning. Bring drinking water and sun protection." /><p id="edit-travelTips-hint">Share practical advice, safety guidance, or things to bring.</p></div>
            <div className="editor-field"><label htmlFor="edit-facilities">Facilities <span className="editor-optional">(optional)</span></label><textarea id="edit-facilities" name="facilities" rows={3} maxLength={3000} defaultValue={Array.isArray(place.facilities) ? place.facilities.join('\n') : place.facilities || ''} aria-describedby="edit-facilities-hint" placeholder="e.g. Parking, toilets, changing rooms, drinking water" /><p id="edit-facilities-hint">List only facilities confirmed at this attraction.</p></div>
          </fieldset>
          <fieldset className="editor-section" id="editor-section-photos" tabIndex={-1}><legend><span>04</span> Photos</legend><p className="editor-section-help">Add up to five direct image links. Photos 1–3 are required; photos 4–5 are optional.</p><div className="editor-photos-grid">{[0, 1, 2, 3, 4].map(index => <PhotoField key={index} index={index} value={images[index] || ''} />)}</div></fieldset>
          <fieldset className="editor-section" id="editor-section-location" tabIndex={-1}><legend><span>05</span> Map location</legend><p className="editor-section-help">Enter verified coordinates so visitors can locate the attraction on the map.</p><div className="editor-two-columns"><EditorField name="latitude" label="Latitude" type="number" value={place.latitude ?? ''} min={-90} max={90} step="any" placeholder="e.g. 6.1524" hint="A number between -90 and 90." /><EditorField name="longitude" label="Longitude" type="number" value={place.longitude ?? ''} min={-180} max={180} step="any" placeholder="e.g. 81.0184" hint="A number between -180 and 180." /></div></fieldset>
            </div>
          </div>
        </div>
        <footer className="place-editor-actions"><span>Your changes are saved when you select the green button.</span><div><button type="button" onClick={onClose}>Cancel</button><button type="submit" className="editor-save" disabled={saving}>{saving ? 'Saving…' : place.id ? 'Save changes' : 'Add attraction'} &gt;</button></div></footer>
      </form>
    </section>
  </div>
}

function EditorField({ name, label, value, hint, id = `edit-${name}`, required = true, ...inputProps }) {
  return <div className="editor-field"><label htmlFor={id}>{label} {required ? <span aria-hidden="true">*</span> : <span className="editor-optional">(optional)</span>}</label><input id={id} name={name} defaultValue={value} required={required} aria-describedby={hint ? `${id}-hint` : undefined} {...inputProps} />{hint && <p id={`${id}-hint`}>{hint}</p>}</div>
}

function PhotoField({ index, value }) {
  const [preview, setPreview] = useState(value)
  const [failed, setFailed] = useState(false)
  const valid = /^https?:\/\//i.test(preview)
  return <div className="editor-photo-card">
    <div className="editor-photo-preview">{valid && !failed ? <img src={preview} alt={`Attraction photo ${index + 1} preview`} loading="lazy" onError={() => setFailed(true)} /> : <span>{failed ? 'Image could not load. Check the direct image link.' : `Photo ${index + 1} preview`}</span>}</div>
    <EditorField name="images" id={`edit-image-${index}`} label={index === 0 ? 'Cover photo' : `Photo ${index + 1}`} required={index < 3} type="url" value={value} placeholder="https://example.com/photo.jpg" onBlur={event => { setFailed(false); setPreview(event.target.value.trim()) }} hint={index === 0 ? 'Shown on attraction cards. Paste a direct image URL.' : 'Preview updates when you leave this field.'} />
  </div>
}

export default PlaceEditModal
