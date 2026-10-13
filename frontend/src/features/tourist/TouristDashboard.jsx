import { useState } from 'react'

function TouristDashboard({ places, savedPlaces, userName, notice, onToggleSavedPlace, onViewPlace, onClearPlan, onMovePlace }) {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const categories = ['All', ...new Set(places.flatMap(place => place.categories || [place.type]))]
  const savedList = savedPlaces.map(id => places.find(place => place.id === id)).filter(Boolean)
  const results = places.filter(place => (category === 'All' || (place.categories || [place.type]).includes(category)) && [place.name, place.tag, place.description].some(value => value?.toLowerCase().includes(search.trim().toLowerCase())))
  const reset = () => { setSearch(''); setCategory('All') }
  return <main className="tourist-workspace home-container">
    <section className="tourist-welcome">
      <div><span className="eyebrow">YOUR TRAVEL WORKSPACE</span><h1>Hello, {userName?.split(' ')[0] || 'Explorer'}.</h1><p>Find a place you love. Add it to your plan. Make the day yours.</p></div>
      <a href="#tourist-plan" className="tourist-plan-shortcut"><span className="plan-shortcut-icon" aria-hidden="true">▤</span><div><strong>My day plan</strong><span>{savedList.length} {savedList.length === 1 ? 'place selected' : 'places selected'}</span></div><span aria-hidden="true">&gt;</span></a>
    </section>
    <div className="tourist-guide" aria-label="Planning steps"><span><b>1</b> Browse places</span><span><b>2</b> Add your favorites</span><span><b>3</b> Arrange your day plan</span></div>
    {notice && <div role="status" className="auth-message success">{notice}</div>}
    <div className="tourist-layout"><section id="tourist-attractions" className="tourist-discovery">
      <div className="tourist-section-heading"><div><h2>Explore attractions</h2><p>Places around Padalangala for your next day out.</p></div></div>
      <div className="tourist-filter-panel">
        <label htmlFor="tourist-search" className="tourist-search-label">Find a place</label>
        <div className="home-search"><span aria-hidden="true">⌕</span><input id="tourist-search" placeholder="Search by name or keyword…" value={search} onChange={event => setSearch(event.target.value)} />{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search">×</button>}</div>
        <span className="tourist-filter-label">Choose an experience</span>
        <div className="category-list tourist-filters" aria-label="Filter attractions by category">{categories.map(value => <button key={value} type="button" className={value === category ? 'selected' : ''} aria-pressed={value === category} onClick={() => setCategory(value)}>{value === 'All' ? 'All experiences' : value}</button>)}</div>
        <div className="tourist-results-row"><span role="status" aria-live="polite">Showing {results.length} of {places.length} places{category !== 'All' ? ` · ${category}` : ''}</span>{(search || category !== 'All') && <button type="button" onClick={reset}>Reset filters</button>}</div>
      </div>
      {results.length ? <div className="tourist-card-grid">{results.map(place => { const selected = savedPlaces.includes(place.id); return <article key={place.id} className={`destination-card ${selected ? 'tourist-card-selected' : ''}`}><div className="destination-photo"><img src={place.images?.[0] || place.image} alt={place.name} loading="lazy" /><span className="place-category">{(place.categories || [place.type])[0]}</span>{selected && <span className="tourist-added">✓ In your plan</span>}<div className="photo-distance">◎ {place.distance} from Padalangala</div></div><div className="destination-body"><h3>{place.name}</h3><p>{place.description}</p><dl className="tourist-card-meta"><div><dt>Visit time</dt><dd>{place.duration || 'Not available'}</dd></div><div><dt>Opening hours</dt><dd>{place.hours || 'Not available'}</dd></div></dl><button type="button" className="tourist-detail-link" onClick={() => onViewPlace(place)}>View details & location &gt;</button><button type="button" className={`tourist-plan-button ${selected ? 'selected' : ''}`} aria-pressed={selected} onClick={() => onToggleSavedPlace(place.id)}>{selected ? '✓ In your plan · Remove' : '+ Add to plan'}</button></div></article> })}</div> : <div className="empty-destinations"><h3>No places found</h3><p>Try a different keyword or category.</p><button type="button" className="travel-button primary" onClick={reset}>Reset filters</button></div>}
    </section>
    <aside id="tourist-plan" className="tourist-plan" aria-labelledby="day-plan-title">
      <div className="tourist-plan-heading">
        <span className="eyebrow">ONE DAY. YOUR WAY.</span>
        <h2 id="day-plan-title">My day plan <span aria-hidden="true">{savedList.length}</span></h2>
        <p role="status" aria-live="polite">{savedList.length} {savedList.length === 1 ? 'place selected' : 'places selected'}</p>
        <p className="plan-introduction">Use Earlier and Later to arrange your stops.</p>
      </div>
      {savedList.length ? <>
        <ol className="tourist-plan-list">
          {savedList.map((place, index) => <li key={place.id}>
            <div className="tourist-stop">
              <span className="tourist-stop-number" aria-label={`Stop ${index + 1}`}>{index + 1}</span>
              <img src={place.images?.[0] || place.image} alt="" loading="lazy" />
              <div><h3 className="plan-place-name">{place.name}</h3><div className="plan-category-list">{(place.categories || [place.type]).filter(Boolean).map(value => <span key={value}>{value}</span>)}</div></div>
            </div>
            <dl className="plan-place-details">
              <div><dt>Distance from Padalangala</dt><dd>{place.distance || 'Not available'}</dd></div>
              <div><dt>Estimated visit</dt><dd>{place.duration || 'Not available'}</dd></div>
              <div><dt>Opening hours</dt><dd>{place.hours || 'Not available'}</dd></div>
            </dl>
            <button type="button" className="plan-view-details" onClick={() => onViewPlace(place)} aria-label={`View details and location for ${place.name}`}>View details / location &gt;</button>
            <div className="tourist-stop-actions">
              <button type="button" disabled={index === 0} onClick={() => onMovePlace(place.id, -1)} aria-label={`Move ${place.name} earlier`}>↑ Earlier</button>
              <button type="button" disabled={index === savedList.length - 1} onClick={() => onMovePlace(place.id, 1)} aria-label={`Move ${place.name} later`}>↓ Later</button>
              <button type="button" onClick={() => onToggleSavedPlace(place.id)} aria-label={`Remove ${place.name} from plan`}>Remove</button>
            </div>
          </li>)}
        </ol>
        <button type="button" className="tourist-clear" onClick={() => { if (window.confirm(`Remove all ${savedList.length} selected places from your day plan?`)) onClearPlan() }}>Clear Plan</button>
      </> : <div className="tourist-plan-empty">
        <span aria-hidden="true">✦</span><h3>Your plan is empty</h3>
        <p>Add places to start planning your one-day visit. You can change your selections anytime.</p>
        <a href="#tourist-attractions" className="plan-browse-button" onClick={reset}>Browse Places &gt;</a>
      </div>}
      <div className="tourist-plan-note">◎ Distances are from Padalangala, not between stops. Check opening hours before visiting.</div>
    </aside></div>
  </main>
}
export default TouristDashboard
