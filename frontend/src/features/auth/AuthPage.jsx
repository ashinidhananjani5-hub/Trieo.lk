import { useEffect, useRef, useState } from 'react'
import lottie from 'lottie-web/build/player/lottie_light.js'
import animationData from '../../data/authAnimation.js'
import { adminCredentials } from './authService.js'

function TravelAnimation() {
  const container = useRef(null)
  const [paused, setPaused] = useState(false)
  const player = useRef(null)
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const animation = lottie.loadAnimation({ container: container.current, renderer: 'svg', loop: true, autoplay: !preference.matches, animationData })
    player.current = animation
    const update = () => { if (preference.matches) animation.pause(); else animation.play() }
    preference.addEventListener('change', update)
    return () => { preference.removeEventListener('change', update); animation.destroy(); player.current = null }
  }, [])
  return <div className="auth-art"><div ref={container} className="auth-lottie" aria-hidden="true" /><button type="button" className="animation-control" aria-label={paused ? 'Play illustration animation' : 'Pause illustration animation'} onClick={() => { if (paused) player.current?.play(); else player.current?.pause(); setPaused(!paused) }}>{paused ? '▶ Play animation' : 'Ⅱ Pause animation'}</button></div>
}

function AuthPage({ authMode, selectedRole, loginError, authNotice, onChangeMode, onChangeRole, onSignIn, onCreateAccount }) {
  const isLogin = authMode === 'login'
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const submit = async event => {
    setPending(true)
    try { await (isLogin ? onSignIn(event) : onCreateAccount(event)) } finally { setPending(false) }
  }
  return (
    <main className="auth-modern">
      <div className="auth-shell">
        <aside className="auth-story"><span className="eyebrow">YOUR NEXT CHAPTER STARTS NEARBY</span><h2>A little escape.<br /><em>A beautiful day.</em></h2><p>Discover local treasures and bring your favorite places together in one simple day plan.</p><TravelAnimation /><div className="auth-story-note"><span>✦</span><div><strong>Local places. Lasting memories.</strong><p>Explore Padalangala, one day at a time.</p></div></div></aside>
        <section className="auth-form-panel" aria-labelledby="auth-title">
          <span className="eyebrow">{isLogin ? 'WELCOME BACK TO TRIEO.LK' : 'A NEW ADVENTURE AWAITS'}</span>
          <h1 id="auth-title">{isLogin ? 'Hello again.' : 'Join the journey.'}</h1>
          <p className="auth-subtitle">{isLogin ? 'Sign in and make today a little more memorable.' : 'Create your tourist account and start exploring.'}</p>
          {isLogin && <div className="auth-role-switch" aria-label="Account type">{['Tourist', 'Administrator'].map(role => <button type="button" key={role} aria-pressed={selectedRole === role} className={selectedRole === role ? 'selected' : ''} onClick={() => { setShowPassword(false); onChangeRole(role) }}><span aria-hidden="true">{role === 'Tourist' ? '✦' : '⚙'}</span> {role}</button>)}</div>}
          {authNotice && <div className="auth-message success" role="status">{authNotice}</div>}
          {loginError && <div className="auth-message error" role="alert">{loginError}</div>}
          <form key={`${authMode}-${selectedRole}`} onSubmit={submit} className="modern-auth-form">
            {!isLogin && <div className="auth-field"><label htmlFor="auth-name">Full name</label><input id="auth-name" name="name" autoComplete="name" placeholder="Your full name" required /></div>}
            <div className="auth-field"><label htmlFor="auth-email">Email address</label><input id="auth-email" name="email" type="email" autoComplete="email" defaultValue={isLogin && selectedRole === 'Administrator' ? adminCredentials.email : ''} placeholder="you@example.com" required /></div>
            <div className="auth-field"><label htmlFor="auth-password">Password</label><div className="auth-password-wrap"><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={isLogin ? 'current-password' : 'new-password'} defaultValue={isLogin && selectedRole === 'Administrator' ? adminCredentials.password : ''} placeholder={isLogin ? 'Enter your password' : 'At least 8 characters'} minLength={isLogin ? undefined : 8} required /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></div></div>
            {!isLogin && <div className="auth-field"><label htmlFor="auth-confirm">Confirm password</label><input id="auth-confirm" name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" placeholder="Re-enter your password" minLength={8} required /></div>}
            <button className="auth-submit" type="submit" disabled={pending}>{pending ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'} <span aria-hidden="true">→</span></button>
          </form>
          <p className="auth-mode-link">{isLogin ? 'New around here?' : 'Already part of the journey?'} <button type="button" onClick={() => { setShowPassword(false); onChangeMode(isLogin ? 'register' : 'login') }}>{isLogin ? 'Create an account' : 'Sign in'}</button></p>
          <div className="auth-demo-note"><span aria-hidden="true">ⓘ</span><p>{isLogin && selectedRole === 'Administrator' ? 'Demo administrator credentials are pre-filled for this preview.' : 'Preview accounts are saved in this browser. Register first to sign in as a tourist.'}</p></div>
        </section>
      </div>
    </main>
  )
}
export default AuthPage
