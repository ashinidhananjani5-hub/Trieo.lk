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
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="auth-modal edit-modal place-editor-modal" role="dialog" aria-modal="true" aria-labelledby="edit-title">
        <button className="modal-close" type="button" aria-label="Close editor" onClick={onClose}>×</button>
        <span className="eyebrow alt">Place information</span>
        <h2 id="edit-title">{isNewPlace ? 'Add attraction' : 'Edit attraction'}</h2>
        <p className="place-editor-intro">Add at least three images, select every category that applies, and enter accurate map coordinates.</p>
        <form onSubmit={onSave}>
          <label>
            Place name
            <input name="name" defaultValue={place.name} placeholder="e.g. Ridiyagama Safari Park" required />
          </label>
          <fieldset className="category-checkbox-group">
            <legend>Categories <span>Select one or more</span></legend>
            {categories.length > 0 ? (
              <div className="category-checkbox-list">
                {categories.map((category) => (
                  <label className="category-checkbox" key={category}>
                    <input
                      name="categories"
                      type="checkbox"
                      value={category}
                      defaultChecked={placeCategories.includes(category)}
                    />
                    <span>{category}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="form-error">Create a category in Manage Categories before adding an attraction.</p>
            )}
          </fieldset>
          <div className="form-two-col">
            <label>Distance from Padalangala<input name="distance" defaultValue={place.distance} placeholder="e.g. 8.3 km" required /></label>
            <label>Visit duration<input name="duration" defaultValue={place.duration} placeholder="e.g. 1.5 hours" required /></label>
          </div>
          <fieldset className="place-images-group">
            <legend>Attraction images <span>At least 3 image URLs are required</span></legend>
            {[0, 1, 2].map((index) => (
              <label key={index}>
                Image {index + 1}{index < 3 && <span className="required-indicator">Required</span>}
                <input
                  name="images"
                  type="url"
                  defaultValue={placeImages[index] || ''}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </label>
            ))}
          </fieldset>
          <fieldset className="place-location-group">
            <legend>Map location</legend>
            <div className="form-two-col">
              <label>
                Latitude
                <input
                  name="latitude"
                  type="number"
                  min="-90"
                  max="90"
                  step="any"
                  defaultValue={place.latitude ?? ''}
                  placeholder="e.g. 6.15"
                  required
                />
              </label>
              <label>
                Longitude
                <input
                  name="longitude"
                  type="number"
                  min="-180"
                  max="180"
                  step="any"
                  defaultValue={place.longitude ?? ''}
                  placeholder="e.g. 81.02"
                  required
                />
              </label>
            </div>
          </fieldset>
          <fieldset className="opening-hours-group">
            <legend>Opening hours <span>24-hour time</span></legend>
            <div className="form-two-col">
              <label>
                From
                <input
                  name="openingFrom"
                  type="time"
                  defaultValue={place.openingFrom || parseOpeningTime(place.hours, 'from')}
                  required
                />
              </label>
              <label>
                To
                <input
                  name="openingTo"
                  type="time"
                  defaultValue={place.openingTo || parseOpeningTime(place.hours, 'to')}
                  required
                />
              </label>
            </div>
          </fieldset>
          <label>
            Short description
            <textarea name="tag" rows="2" defaultValue={place.tag} placeholder="A short phrase shown on place cards" required />
          </label>
          <label>
            Full description
            <textarea name="description" rows="4" defaultValue={place.description} required />
          </label>
          {notice && <p className="form-error" role="alert">{notice}</p>}
          <div className="modal-actions">
            <button className="secondary-btn" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-btn" type="submit">{isNewPlace ? 'Add attraction' : 'Save changes'}</button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default PlaceEditModal
