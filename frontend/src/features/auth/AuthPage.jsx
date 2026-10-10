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
  return (
    <main className="auth-page">
      <section className="auth-modal auth-card" aria-labelledby="auth-title">
        <div className="auth-heading">
          <span className="auth-heading-mark" aria-hidden="true">T</span>
          <span className="eyebrow alt">
            {authMode === 'login' ? 'Welcome back' : 'Join Trieo.lk'}
          </span>
          <h1 id="auth-title">{authMode === 'login' ? 'Sign in to continue' : 'Create your account'}</h1>
          <p>
            {authMode === 'login'
              ? 'Sign in to plan your Padalangala day or manage local attractions.'
              : 'Save your favourite places and plan your next day trip.'}
          </p>
        </div>
        {authMode === 'login' && (
          <div className="role-options" role="group" aria-label="Choose your role">
            {['Tourist', 'Administrator'].map((role) => (
              <button
                key={role}
                type="button"
                className={selectedRole === role ? 'role-option selected' : 'role-option'}
                aria-pressed={selectedRole === role}
                onClick={() => onChangeRole(role)}
              >
                <span aria-hidden="true">{role === 'Tourist' ? '✈' : '⚙'}</span>
                <strong>{role}</strong>
                <small>{role === 'Tourist' ? 'Plan a day trip' : 'Manage place details'}</small>
              </button>
            ))}
          </div>
        )}
        {authNotice && <p className="auth-notice" role="status">{authNotice}</p>}
        <form onSubmit={authMode === 'login' ? onSignIn : onCreateAccount}>
          {authMode === 'register' && (
            <label>
              Your name
              <input name="name" autoComplete="name" placeholder="e.g. Nimal Perera" required />
            </label>
          )}
          <label>
            Email address
            <input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
              placeholder="Enter your password"
              minLength={authMode === 'register' ? 8 : undefined}
              required
            />
          </label>
          {authMode === 'register' && (
            <label>
              Confirm password
              <input name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required />
            </label>
          )}
          {loginError && <p className="form-error" role="alert">{loginError}</p>}
          <button className="primary-btn modal-submit" type="submit">
            {authMode === 'login' ? `Sign in as ${selectedRole}` : 'Create account'}
            <span aria-hidden="true">→</span>
          </button>
        </form>
        {authMode === 'login' ? (
          <p className="auth-switch">
            New to Trieo.lk?{' '}
            <button type="button" onClick={() => onChangeMode('register')}>Create an account</button>
          </p>
        ) : (
          <p className="auth-switch">
            Already have an account?{' '}
            <button type="button" onClick={() => onChangeMode('login')}>Sign in</button>
          </p>
        )}
        <p className="demo-hint">
          Browser-only demo authentication. Do not use a password you rely on elsewhere; production accounts
          need a secure server-side authentication service.
          {selectedRole === 'Administrator' && authMode === 'login' && (
            <> Demo administrator: {adminCredentials.email} / {adminCredentials.password}.</>
          )}
        </p>
      </section>
    </main>
  )
}

export default AuthPage
