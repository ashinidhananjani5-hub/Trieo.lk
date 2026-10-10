function TouristDashboard({ places, savedPlaces, userName, notice, onToggleSavedPlace }) {
  return (
    <main className="dashboard-main">
      <div className="dashboard-heading">
        <div>
          <span className="eyebrow alt">Tourist dashboard</span>
          <h1>Plan your Padalangala day, {userName.split(' ')[0]}.</h1>
          <p>Save the places you want to visit and keep your day-trip ideas together.</p>
        </div>
        <div className="dashboard-counter">
          <strong>{savedPlaces.length}</strong>
          <span>{savedPlaces.length === 1 ? 'place saved' : 'places saved'}</span>
        </div>
      </div>
      {notice && <p className="notice" role="status">{notice}</p>}
      <h2 className="dashboard-subtitle">Places near you</h2>
      <div className="destination-grid">
        {places.map((place) => {
          const isSaved = savedPlaces.includes(place.id)
          return (
            <article key={place.id} className="destination-card">
              <img src={place.images?.[0] || place.image} alt={place.name} />
              <div className="card-body">
                <div className="card-meta"><span>{(place.categories || [place.type]).join(', ')}</span><span>{place.distance}</span></div>
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <div className="card-footer">
                  <strong>{place.duration} visit</strong>
                  <button type="button" onClick={() => onToggleSavedPlace(place.id)}>
                    {isSaved ? 'Remove from plan' : 'Add to my plan'}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
      <section className="saved-plan">
        <div>
          <span className="eyebrow">Your day plan</span>
          <h2>{savedPlaces.length ? 'Your saved places' : 'Your plan is ready to begin'}</h2>
        </div>
        {savedPlaces.length ? (
          <ol>
            {places.filter((place) => savedPlaces.includes(place.id)).map((place) => (
              <li key={place.id}><strong>{place.name}</strong><span>{place.distance} · {place.duration}</span></li>
            ))}
          </ol>
        ) : (
          <p>Add an attraction above to start building your one-day visit plan.</p>
        )}
      </section>
    </main>
  )
}

export default TouristDashboard
