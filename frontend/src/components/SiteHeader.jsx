import { useState } from 'react'

function SiteHeader({
  activeView,
  adminSection,
  userName,
  savedPlacesCount = 0,
  onOpenLogin,
  onNavigateHome,
  onNavigateTourist,
  onNavigateAdminSection,
  onSignOut,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isTourist = activeView === 'tourist'
  const isAdmin = activeView === 'admin'
  const isAuth = activeView === 'auth'
  const isLoggedIn = Boolean(userName)

  const handleNavClick = (callback) => {
    setMobileMenuOpen(false)
    if (callback) callback()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => handleNavClick(isAdmin ? () => onNavigateAdminSection('overview') : onNavigateHome)}
              className="group flex items-center gap-3.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-xl p-1 -ml-1 transition-transform active:scale-95"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#40916c] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-emerald-900/15 group-hover:shadow-emerald-900/25 transition-all">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-[#1b4332] group-hover:text-[#2d6a4f] transition-colors leading-none">
                  Trieo<span className="text-[#40916c]">.lk</span>
                </span>
                <span className="text-[11px] font-medium text-stone-500 tracking-wide mt-1 uppercase">
                  Local Tourist Planner
                </span>
              </div>
            </button>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {isAdmin ? (
              // Admin Navigation
              <>
                {[
                  { id: 'overview', label: 'Dashboard' },
                  { id: 'places', label: 'Manage Places' },
                  { id: 'categories', label: 'Categories' },
                  { id: 'users', label: 'Users' },
                ].map((item) => {
                  const isActive = adminSection === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigateAdminSection(item.id)}
                      className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                        isActive
                          ? 'text-[#1b4332] bg-emerald-50/90 shadow-xs font-bold'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#2d6a4f] rounded-full" />
                      )}
                    </button>
                  )
                })}
              </>
            ) : (
              // Public / Tourist Navigation
              <>
                <a
                  href="#discover"
                  onClick={() => {
                    if (isTourist || isAuth) onNavigateHome()
                  }}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all duration-150"
                >
                  Discover
                </a>
                <a
                  href="#places"
                  onClick={() => {
                    if (isTourist || isAuth) onNavigateHome()
                  }}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all duration-150"
                >
                  Places
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => {
                    if (isTourist || isAuth) onNavigateHome()
                  }}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 transition-all duration-150"
                >
                  How It Works
                </a>
                <button
                  type="button"
                  onClick={() => {
                    if (isLoggedIn && !isAdmin) {
                      onNavigateTourist()
                    } else if (!isLoggedIn) {
                      onOpenLogin('Tourist')
                    }
                  }}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 ${
                    isTourist
                      ? 'text-[#1b4332] bg-emerald-50/90 shadow-xs font-bold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/70'
                  }`}
                >
                  <span>My Day Plan</span>
                  {savedPlacesCount > 0 && (
                    <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-[#2d6a4f] rounded-full">
                      {savedPlacesCount}
                    </span>
                  )}
                  {isTourist && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#2d6a4f] rounded-full" />
                  )}
                </button>
              </>
            )}
          </nav>

          {/* Right: Actions / Profile */}
          <div className="flex items-center gap-3">
            {!isLoggedIn ? (
              // Logged out
              activeView === 'auth' ? (
                <button
                  type="button"
                  onClick={onNavigateHome}
                  className="px-5 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-full transition-all duration-200"
                >
                  Back to Home
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenLogin('Tourist')}
                  className="inline-flex items-center gap-1.5 bg-emerald-800 text-white hover:bg-emerald-900 active:scale-95 transition-all duration-200 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md"
                >
                  <span>Sign in</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              )
            ) : (
              // Logged in
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-stone-100/90 border border-stone-200/60 rounded-full pl-1.5 pr-3 py-1 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1b4332] to-[#40916c] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                    {userName ? userName.charAt(0) : 'U'}
                  </div>
                  <span className="text-xs font-semibold text-stone-700 hidden sm:inline-block max-w-[120px] truncate">
                    Hello, <span className="text-[#1b4332] font-bold">{userName.split(' ')[0]}</span>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="px-3.5 py-1.5 text-xs font-semibold text-stone-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200/60 rounded-full transition-all duration-150"
                  title="Sign out from Trieo.lk"
                >
                  Sign out
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="md:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {isAdmin ? (
            <>
              {[
                { id: 'overview', label: 'Dashboard' },
                { id: 'places', label: 'Manage Places' },
                { id: 'categories', label: 'Categories' },
                { id: 'users', label: 'Users' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(() => onNavigateAdminSection(item.id))}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    adminSection === item.id
                      ? 'bg-emerald-50 text-[#1b4332]'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </>
          ) : (
            <>
              <a
                href="#discover"
                onClick={() => handleNavClick(isTourist || isAuth ? onNavigateHome : undefined)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                Discover
              </a>
              <a
                href="#places"
                onClick={() => handleNavClick(isTourist || isAuth ? onNavigateHome : undefined)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                Places
              </a>
              <a
                href="#how-it-works"
                onClick={() => handleNavClick(isTourist || isAuth ? onNavigateHome : undefined)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                How It Works
              </a>
              <button
                type="button"
                onClick={() =>
                  handleNavClick(() => {
                    if (isLoggedIn && !isAdmin) onNavigateTourist()
                    else if (!isLoggedIn) onOpenLogin('Tourist')
                  })
                }
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold text-[#1b4332] bg-emerald-50/60 flex items-center justify-between"
              >
                <span>My Day Plan</span>
                {savedPlacesCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-[#2d6a4f] rounded-full">
                    {savedPlacesCount} saved
                  </span>
                )}
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}

export default SiteHeader
