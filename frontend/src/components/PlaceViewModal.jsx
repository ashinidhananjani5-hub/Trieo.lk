function PlaceViewModal({ place, onClose }) {
  if (!place) return null

  const categories = place.categories || [place.type].filter(Boolean)
  const images = place.images?.length ? place.images : [place.image].filter(Boolean)

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="auth-modal place-view-modal" role="dialog" aria-modal="true" aria-labelledby="place-view-title">
        <button className="modal-close" type="button" aria-label="Close place details" onClick={onClose}>×</button>
        <span className="eyebrow alt">Attraction details</span>
        <h2 id="place-view-title">{place.name}</h2>
        <div className="place-view-categories">
          {categories.map((category) => <span className="role-badge" key={category}>{category}</span>)}
        </div>
        <div className="place-view-images">
          {images.map((image, index) => (
            <img key={`${image}-${index}`} src={image} alt={`${place.name}, image ${index + 1}`} />
          ))}
        </div>
        <dl className="place-view-details">
          <div><dt>Location</dt><dd>{place.latitude != null && place.longitude != null ? `${place.latitude}, ${place.longitude}` : 'Not set'}</dd></div>
          <div><dt>Distance</dt><dd>{place.distance}</dd></div>
          <div><dt>Visit duration</dt><dd>{place.duration}</dd></div>
          <div><dt>Opening hours</dt><dd>{place.hours}</dd></div>
        </dl>
        <p className="place-view-tag">{place.tag}</p>
        <p className="place-view-description">{place.description}</p>
      </section>
    </div>
  )
}

export default PlaceViewModal
