import { useEffect, useRef, useState } from 'react'
import { slides } from '../../data/landingContent.js'

const steps = [
  ['01', 'Find your escape', 'Browse nearby attractions and filter by the experiences you love.'],
  ['02', 'Make it your day', 'Sign in and bring your favorite destinations together in one simple plan.'],
  ['03', 'Go explore', 'Review your selected stops and enjoy a little more of Sri Lanka.'],
]

function HomePage({ places, onOpenLogin, slideIndex, onSlideChange }) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const root = useRef(null)
  const carousel = useRef(null)
  const interacting = useRef(false)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const moveCards = (direction, automatic = false) => {
    const track = carousel.current
    if (!track || track.scrollWidth <= track.clientWidth + 2) return
    const distance = track.firstElementChild.getBoundingClientRect().width + 24
    const atEnd = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4
    const atStart = track.scrollLeft <= 4
    track.scrollTo({ left: direction > 0 && atEnd ? 0 : direction < 0 && atStart ? track.scrollWidth : track.scrollLeft + direction * distance, behavior: automatic || !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' })
  }
  const categories = ['All', ...new Set(places.flatMap(p => p.categories || [p.type]))]
  const activeSlide = slides[slideIndex]
  const filteredPlaces = places.filter(place =>
    (selectedCategory === 'All' || (place.categories || [place.type]).includes(selectedCategory)) &&
    [place.name, place.tag, place.description].some(value => value?.toLowerCase().includes(searchQuery.trim().toLowerCase())),
  )

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    root.current.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    carousel.current?.scrollTo({ left: 0, behavior: 'instant' })
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const timer = window.setInterval(() => {
      if (carouselPaused || interacting.current || motion.matches || document.hidden) return
      const track = carousel.current
      if (!track) return
      const bounds = track.getBoundingClientRect()
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return
      moveCards(1, true)
    }, 4500)
    return () => window.clearInterval(timer)
  }, [carouselPaused])

  return (
    <main ref={root} className="travel-home">
      <section className="travel-hero" aria-label="Featured destinations">
        {slides.map((slide, index) => <div key={slide.title} className={`hero-photo ${index === slideIndex ? 'active' : ''}`} style={{ backgroundImage: `url("${slide.image}")` }} aria-hidden="true" />)}
        <div className="hero-shade" />
        <div className="home-container hero-content">
          <span className="eyebrow hero-eyebrow"><span className="location-dot" /> PADALANGALA, SRI LANKA</span>
          <h1>A little closer.<br />A little <em>more adventure.</em></h1>
          <p>Slow mornings. Wild encounters. Hidden corners.<br className="hidden sm:block" /> Discover a beautiful day out, right around you.</p>
          <div className="hero-actions">
            <a className="travel-button primary" href="#places">Explore destinations <span aria-hidden="true">↗</span></a>
            <button className="travel-button glass" onClick={() => onOpenLogin('Tourist')}>Build my day plan <span aria-hidden="true">→</span></button>
          </div>
          <div className="hero-caption" aria-live="polite"><span className="caption-line" /><span>{activeSlide.eyebrow}</span></div>
        </div>
        <div className="home-container hero-bottom">
          <span className="hero-note">LOCAL PLACES. LASTING MEMORIES.</span>
          <div className="slide-navigation">
            <button onClick={() => onSlideChange((slideIndex + slides.length - 1) % slides.length)} aria-label="Previous slide">←</button>
            {slides.map((slide, index) => <button key={slide.title} className={`slide-dot ${index === slideIndex ? 'selected' : ''}`} aria-label={`Show slide ${index + 1}`} aria-pressed={index === slideIndex} onClick={() => onSlideChange(index)} />)}
            <button onClick={() => onSlideChange((slideIndex + 1) % slides.length)} aria-label="Next slide">→</button>
          </div>
        </div>
      </section>

      <div className="home-container discovery-bar">
        <div className="discovery-label"><span className="compass-symbol" aria-hidden="true">✳</span><div><strong>Where will today take you?</strong><span>Find your next local experience</span></div></div>
        <div className="home-search"><label htmlFor="destination-search" className="sr-only">Search destinations</label><span aria-hidden="true">⌕</span><input id="destination-search" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} placeholder="Search parks, nature, hot springs…" />{searchQuery && <button aria-label="Clear search" onClick={() => setSearchQuery('')}>×</button>}</div>
        <a href="#places" className="search-action">Discover <span aria-hidden="true">→</span></a>
      </div>

      <section id="places" className="destinations-section">
        <div id="discover" className="section-heading reveal"><div><span className="eyebrow">THE BEST DAYS START NEARBY</span><h2>Small escapes.<br /><em>Beautiful discoveries.</em></h2></div><p>From wildlife to quiet green spaces, find a place that feels like your kind of adventure.</p></div>
        <div className="destination-toolbar"><div className="category-list" aria-label="Destination categories">{categories.map(category => <button key={category} className={selectedCategory === category ? 'selected' : ''} aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>{category === 'All' ? 'All experiences' : category}</button>)}</div><span className="result-count" role="status">{filteredPlaces.length} places to discover</span></div>
        {filteredPlaces.length > 1 && <div className="destination-carousel-controls"><span>Swipe or use the arrows to explore</span><div><button type="button" aria-pressed={carouselPaused} onClick={() => setCarouselPaused(!carouselPaused)}>{carouselPaused ? 'Play slideshow' : 'Pause slideshow'}</button><button type="button" aria-label="Previous destinations" onClick={() => moveCards(-1)}>←</button><button type="button" aria-label="Next destinations" onClick={() => moveCards(1)}>→</button></div></div>}
        {filteredPlaces.length ? <div ref={carousel} className="destination-grid destination-carousel" role="region" aria-label="Destination carousel" tabIndex={0} onMouseEnter={() => { interacting.current = true }} onMouseLeave={() => { interacting.current = false }} onFocusCapture={() => { interacting.current = true }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) interacting.current = false }} onTouchStart={() => { interacting.current = true }} onTouchEnd={() => { interacting.current = false }} onKeyDown={event => { if (event.target !== event.currentTarget) return; if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); moveCards(event.key === 'ArrowRight' ? 1 : -1) } }}>{filteredPlaces.map((place, index) => <article key={place.id} className="destination-card" style={{ '--card-delay': `${index * 65}ms` }}><div className="destination-photo"><img src={place.images?.[0] || place.image} alt={place.name} loading="lazy" /><span className="place-category">{(place.categories || [place.type])[0]}</span><span className="photo-arrow" aria-hidden="true">↗</span><div className="photo-distance">◎ {place.distance} from Padalangala</div></div><div className="destination-body"><h3>{place.name}</h3><p>{place.description}</p><div className="destination-card-bottom"><span>◷ {place.duration}</span><button onClick={() => onOpenLogin('Tourist')}>Plan a visit <span aria-hidden="true">→</span></button></div></div></article>)}</div> : <div className="empty-destinations"><h3>No destinations found</h3><p>Try another search or explore all experiences.</p><button className="travel-button primary" onClick={() => { setSearchQuery(''); setSelectedCategory('All') }}>Reset filters</button></div>}
      </section>

      <section id="how-it-works" className="how-section"><div className="home-container"><div className="section-heading reveal"><div><span className="eyebrow">LESS PLANNING. MORE LIVING.</span><h2>Your next day out,<br /><em>in three simple steps.</em></h2></div><a href="#places" className="text-link">Let's find your first stop ↗</a></div><div className="steps-grid">{steps.map(([number, title, text]) => <article key={number} className="step-card reveal"><span className="step-number">{number}</span><div className="step-rule" /><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section id="about" className="home-container about-section"><div className="about-photo reveal"><img src={places[1]?.image || slides[0].image} alt="Green landscapes and peaceful outdoor scenery" loading="lazy" /><span className="photo-label">A slower pace. A richer day.</span></div><div className="about-copy reveal"><span className="eyebrow">ROOTED IN LOCAL EXPLORATION</span><h2>You don't have to go far<br />to find <em>something special.</em></h2><p>Trieo.lk brings nearby places into one simple space. Discover somewhere new, choose the stops you love, and make a day that feels entirely yours.</p><div className="about-points"><div><span>◎</span><strong>Discover nearby</strong><p>Explore around Padalangala.</p></div><div><span>✦</span><strong>Your day, your way</strong><p>Choose your own collection of stops.</p></div></div><button onClick={() => onOpenLogin('Tourist')} className="text-link">Start your day plan <span aria-hidden="true">↗</span></button></div></section>

      <section className="home-container cta-wrap"><div className="travel-cta reveal"><div className="cta-orbit" aria-hidden="true" /><span className="eyebrow">A GOOD DAY IS WAITING</span><h2>Make room for<br /><em>a little adventure.</em></h2><p>Your favorite places. One beautiful day. Let's put it together.</p><button className="travel-button cream" onClick={() => onOpenLogin('Tourist')}>Create my day plan <span aria-hidden="true">↗</span></button></div></section>
    </main>
  )
}

export default HomePage
