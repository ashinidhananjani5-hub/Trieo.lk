import { useEffect, useEffectEvent, useRef } from 'react'

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
  useEffect(() => {
    if (!place) return
    const previous = document.activeElement
    const overflow = document.body.style.overflow
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
          {notice && <div ref={alert} className="editor-alert" role="alert">{notice}</div>}
          <fieldset className="editor-section"><legend><span>01</span> About the attraction</legend><p className="editor-section-help">Start with a name, category, and a helpful introduction.</p>
            <EditorField name="name" label="Attraction name" value={place.name} placeholder="e.g. Ridiyagama Safari Park" />
            <fieldset className="editor-categories"><legend>Categories <span aria-hidden="true">*</span></legend><p>Choose at least one category.</p><div>{categories.map(category => <label key={category}><input type="checkbox" name="categories" value={category} defaultChecked={selected.includes(category)} /><span>{category}</span></label>)}</div>{!categories.length && <p>Add a category in category management first.</p>}</fieldset>
            <EditorField name="tag" label="Short highlight" value={place.tag} placeholder="e.g. Meet Sri Lanka’s wildlife" hint="A short line to help visitors understand what makes this place special." />
            <div className="editor-field"><label htmlFor="edit-description">Description <span aria-hidden="true">*</span></label><textarea id="edit-description" name="description" defaultValue={place.description} rows={4} required placeholder="Describe the experience, highlights, and what visitors can expect…" /></div>
          </fieldset>
          <fieldset className="editor-section"><legend><span>02</span> Visit information</legend><p className="editor-section-help">Give visitors an idea of the time and distance involved.</p><div className="editor-two-columns"><EditorField name="distance" label="Distance from Padalangala" value={place.distance} placeholder="e.g. 8.3 km" hint="Include the distance unit (km)." /><EditorField name="duration" label="Estimated visit duration" value={place.duration} placeholder="e.g. 1.5 hrs" hint="Time spent at the attraction, not travel time." /><EditorField name="openingFrom" label="Opening time" type="time" value={place.openingFrom || parseOpeningTime(place.hours, 'from')} /><EditorField name="openingTo" label="Closing time" type="time" value={place.openingTo || parseOpeningTime(place.hours, 'to')} /></div></fieldset>
          <fieldset className="editor-section"><legend><span>03</span> Photos</legend><p className="editor-section-help">Paste three direct image links. Use clear photos of the attraction.</p>{[0, 1, 2].map(index => <EditorField key={index} name="images" id={`edit-image-${index}`} label={`Photo ${index + 1}`} type="url" value={images[index] || ''} placeholder="https://example.com/attraction.jpg" />)}</fieldset>
          <fieldset className="editor-section"><legend><span>04</span> Map location</legend><p className="editor-section-help">Enter verified coordinates so visitors can locate the attraction on the map.</p><div className="editor-two-columns"><EditorField name="latitude" label="Latitude" type="number" value={place.latitude ?? ''} min={-90} max={90} step="any" placeholder="e.g. 6.1524" hint="A number between -90 and 90." /><EditorField name="longitude" label="Longitude" type="number" value={place.longitude ?? ''} min={-180} max={180} step="any" placeholder="e.g. 81.0184" hint="A number between -180 and 180." /></div></fieldset>
        </div>
        <footer className="place-editor-actions"><span>Review the details before saving.</span><div><button type="button" onClick={onClose}>Cancel</button><button type="submit" className="editor-save" disabled={saving}>{saving ? 'Saving…' : place.id ? 'Save changes' : 'Add attraction'} &gt;</button></div></footer>
      </form>
    </section>
  </div>
}

function EditorField({ name, label, value, hint, id = `edit-${name}`, ...inputProps }) {
  return <div className="editor-field"><label htmlFor={id}>{label} <span aria-hidden="true">*</span></label><input id={id} name={name} defaultValue={value} required aria-describedby={hint ? `${id}-hint` : undefined} {...inputProps} />{hint && <p id={`${id}-hint`}>{hint}</p>}</div>
}

export default PlaceEditModal
