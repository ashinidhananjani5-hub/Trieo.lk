import { featureItems, slides } from '../../data/landingContent.js'

function HomePage({ places, onOpenLogin, slideIndex, onSlideChange }) {
  const activeSlide = slides[slideIndex]

  return (
    <main id="home">
      <section
        className="slideshow"
        aria-label="Featured destinations"
        style={{ backgroundImage: `url("${activeSlide.image}")` }}
      >
        <div className="slide-shade" />
        <div className="slide-content" key={slideIndex}>
          <span className="eyebrow">{activeSlide.eyebrow}</span>
          <h1>{activeSlide.title}</h1>
          <p>{activeSlide.description}</p>
          <div className="hero-actions">
            <a className="primary-btn large" href="#discover">
              {activeSlide.action} <span aria-hidden="true">→</span>
            </a>
            <button className="secondary-btn large hero-login-btn" type="button" onClick={() => onOpenLogin('Tourist')}>
              Plan as a tourist
            </button>
          </div>
        </div>
        <div className="slide-controls">
          <button
            type="button"
            className="slide-arrow"
            aria-label="Previous slide"
            onClick={() => onSlideChange((slideIndex + slides.length - 1) % slides.length)}
          >
            ‹
          </button>
          <div className="slide-dots" aria-label="Choose a featured slide">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                className={index === slideIndex ? 'slide-dot active' : 'slide-dot'}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === slideIndex ? 'true' : undefined}
                onClick={() => onSlideChange(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className="slide-arrow"
            aria-label="Next slide"
            onClick={() => onSlideChange((slideIndex + 1) % slides.length)}
          >
            ›
          </button>
        </div>
      </section>

      <section id="discover" className="content-section">
        <div className="welcome-row">
          <div>
            <span className="eyebrow alt">Small town, big experiences</span>
            <h2>Explore more. Plan better. Enjoy the day.</h2>
          </div>
          <p>
            Trieo.lk brings local Padalangala attractions and practical trip planning together in
            one welcoming place.
          </p>
        </div>

        <div className="section-heading">
          <span className="eyebrow alt">Places to explore</span>
          <h2>Discover your next stop</h2>
          <p>Find wildlife, nature, and relaxing experiences around Padalangala.</p>
        </div>

        <div className="destination-grid">
          {places.map((place) => (
            <article key={place.id} className="destination-card">
              <img src={place.images?.[0] || place.image} alt={place.name} />
              <div className="card-body">
                <div className="card-meta">
                  <span>{(place.categories || [place.type]).join(', ')}</span>
                  <span>{place.distance}</span>
                </div>
                <h3>{place.name}</h3>
                <p>{place.tag}</p>
                <div className="card-footer">
                  <strong>{place.duration}</strong>
                  <button type="button" onClick={() => onOpenLogin('Tourist')}>
                    Plan a visit <span aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="how-section">
        <div className="section-heading center">
          <span className="eyebrow alt">Your day, made simple</span>
          <h2>From inspiration to itinerary</h2>
        </div>
        <div className="steps-grid">
          {[
            ['01', 'Discover', 'Explore local places and find what interests you.'],
            ['02', 'Choose', 'Pick attractions and add them to your day plan.'],
            ['03', 'Go', 'Review key details and set out with confidence.'],
          ].map(([number, title, text]) => (
            <article className="step-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="feature-section">
        <div className="section-heading center">
          <span className="eyebrow alt">Made for local discovery</span>
          <h2>Everything you need for a better day out</h2>
        </div>
        <div className="feature-grid">
          {featureItems.map(([icon, title, text]) => (
            <article className="feature-card" key={title}>
              <span className="feature-icon" aria-hidden="true">{icon}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="home-cta">
          <div>
            <span className="eyebrow">Ready to explore?</span>
            <h2>Your Padalangala day starts with Trieo.</h2>
          </div>
          <button className="primary-btn large" type="button" onClick={() => onOpenLogin('Tourist')}>
            Create a day plan <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  )
}

export default HomePage
