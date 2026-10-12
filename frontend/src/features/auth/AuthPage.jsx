import { adminCredentials } from './authService.js'

function AuthPage({
  authMode,
  selectedRole,
  loginError,
  authNotice,
  onChangeMode,
  onChangeRole,
  onSignIn,
  onCreateAccount,
}) {
  const isLogin = authMode === 'login'

  return (
    <main className="w-full min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-[#F9FAF8]">
      {/* Subtle Ambient Blur Background Orbs */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-96 h-96 bg-emerald-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 translate-x-1/2 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />

      {/* Centered Auth Card */}
      <section
        className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl shadow-stone-900/5 p-7 sm:p-9 relative z-10 transition-all"
        aria-labelledby="auth-title"
      >
        {/* Header with Brand Icon */}
        <div className="text-center mb-6">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#40916c] text-white items-center justify-center font-extrabold text-2xl shadow-md shadow-emerald-950/15 mb-3">
            T
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              {isLogin ? 'Welcome Back' : 'Join Trieo.lk'}
            </span>
          </div>
          <h1 id="auth-title" className="text-2xl font-extrabold text-stone-900 tracking-tight mt-3">
            {isLogin ? 'Sign in to Trieo.lk' : 'Create your account'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1.5">
            {isLogin
              ? 'Access your saved day itinerary or manage local attractions.'
              : 'Save favorite spots and craft your Padalangala day visit.'}
          </p>
        </div>

        {/* Role Switcher (Tourist vs Administrator) for Login */}
        {isLogin && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Select Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl border border-stone-200/80">
              {[
                { role: 'Tourist', icon: '✦', desc: 'Plan day trip' },
                { role: 'Administrator', icon: '⚙', desc: 'Manage places' },
              ].map(({ role, icon, desc }) => {
                const isSelected = selectedRole === role
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onChangeRole(role)}
                    className={`flex flex-col items-center justify-center py-2.5 px-3 rounded-xl transition-all duration-150 ${
                      isSelected
                        ? 'bg-white text-[#1b4332] shadow-sm font-bold border border-stone-200/60'
                        : 'text-stone-600 hover:text-stone-900 font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                      <span>{icon}</span>
                      <span>{role}</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">{desc}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Notices and Alerts */}
        {authNotice && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{authNotice}</span>
          </div>
        )}

        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 flex items-center gap-2">
            <svg className="w-4 h-4 text-rose-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{loginError}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={isLogin ? onSignIn : onCreateAccount} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Your Full Name
              </label>
              <input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="e.g. Kasun Fernando"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all placeholder:text-stone-400"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              defaultValue={isLogin && selectedRole === 'Administrator' ? adminCredentials.email : ''}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all placeholder:text-stone-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              name="password"
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              defaultValue={isLogin && selectedRole === 'Administrator' ? adminCredentials.password : ''}
              placeholder="••••••••"
              minLength={!isLogin ? 8 : undefined}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all placeholder:text-stone-400"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                minLength={8}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50/60 focus:bg-white text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 transition-all placeholder:text-stone-400"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-900/10 hover:shadow-lg active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 mt-2"
          >
            <span>{isLogin ? `Sign in as ${selectedRole}` : 'Create Account'}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-6 pt-5 border-t border-stone-100 text-center">
          {isLogin ? (
            <p className="text-xs text-stone-500">
              New to Trieo.lk?{' '}
              <button
                type="button"
                onClick={() => onChangeMode('register')}
                className="text-emerald-800 font-bold hover:underline"
              >
                Create a tourist account
              </button>
            </p>
          ) : (
            <p className="text-xs text-stone-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onChangeMode('login')}
                className="text-emerald-800 font-bold hover:underline"
              >
                Sign in here
              </button>
            </p>
          )}
        </div>

        {/* Demo Credentials Box */}
        <div className="mt-5 p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-[11px] text-stone-500 leading-relaxed">
          <span className="font-bold text-stone-700">Demo access:</span> Select Administrator above to pre-fill admin demo credentials ({adminCredentials.email}), or sign in / register with any email for a Tourist session.
        </div>
      </section>
    </main>
  )
}

export default AuthPage
