function SiteHeader({ activeView, userName, onOpenLogin, onNavigateHome, onSignOut }) {
  const navItems = [
    { href: '#discover', label: 'Discover' },
    { href: '#how-it-works', label: 'How it works' },
    { href: '#about', label: 'About' },
  ]

  return (
    <header className="topbar">
      {activeView === 'admin' ? (
        <span className="brand-wrap" aria-label="Trieo.lk administrator dashboard">
          <span className="brand-mark">T</span>
          <span className="brand-copy">
            <strong>Trieo.lk</strong>
            <span>Local tourist planner</span>
          </span>
        </span>
      ) : (
        <a className="brand-wrap" href="#home" onClick={onNavigateHome}>
          <span className="brand-mark">T</span>
          <span className="brand-copy">
            <strong>Trieo.lk</strong>
            <span>Local tourist planner</span>
          </span>
        </a>
      )}

      {activeView !== 'auth' && (
        <nav className="main-nav" aria-label="Main navigation">
          {activeView === 'home' ? (
            navItems.map((item) => (
              <a className="nav-link" key={item.href} href={item.href} onClick={onNavigateHome}>
                {item.label}
              </a>
            ))
          ) : (
            <span className="nav-greeting">Hello, {userName}</span>
          )}
        </nav>
      )}

      {activeView === 'home' ? (
        <button className="primary-btn nav-cta" type="button" onClick={() => onOpenLogin()}>
          Sign in <span aria-hidden="true">↗</span>
        </button>
      ) : activeView === 'auth' ? (
        <button className="secondary-btn nav-cta" type="button" onClick={onNavigateHome}>
          Back to home
        </button>
      ) : (
        <button className="secondary-btn nav-cta" type="button" onClick={onSignOut}>
          Sign out
        </button>
      )}
    </header>
  )
}

export default SiteHeader
