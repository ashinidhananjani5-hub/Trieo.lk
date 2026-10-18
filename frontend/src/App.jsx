import { useEffect, useRef, useState } from 'react'
import PlaceEditModal from './components/PlaceEditModal.jsx'
import PlaceViewModal from './components/PlaceViewModal.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { slides } from './data/landingContent.js'
import { initialPlaces } from './data/places.js'
import AdminDashboard from './features/admin/AdminDashboard.jsx'
import AuthPage from './features/auth/AuthPage.jsx'
import { loginAccount, registerTouristAccount, logoutAccount } from './features/auth/authService.js'
import useFirebaseBackend from './hooks/useFirebaseBackend.js'
import { addStoredCategory, attractionReference, changeStoredCategory, removePlace, seedCatalog, storePlace, storePlan } from './services/firestoreService.js'
import { friendlyError } from './services/validation.js'
import HomePage from './features/home/HomePage.jsx'
import TouristDashboard from './features/tourist/TouristDashboard.jsx'
import './App.css'

function App() {
  const { session, authReady, places, categories, users, savedPlaces: storedPlan, planReady, loading, error: backendError } = useFirebaseBackend()
  const savedPlaces = storedPlan.filter(id => places.some(place => place.id === id))
  const userName = session?.name || ''
  const [saving, setSaving] = useState(false)
  const [planSaving, setPlanSaving] = useState(false)
  const writeInFlight = useRef(false)
  const planInFlight = useRef(false)
  const authInFlight = useRef(false)
  const [slideIndex, setSlideIndex] = useState(0)
  const [activeView, setActiveView] = useState('home')
  const [adminSection, setAdminSection] = useState('overview')
  const [authMode, setAuthMode] = useState('login')
  const [selectedRole, setSelectedRole] = useState('Tourist')
  const [loginError, setLoginError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [editingPlace, setEditingPlace] = useState(null)
  const [viewingPlace, setViewingPlace] = useState(null)
  const [isTouristPlanOpen, setIsTouristPlanOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const placeReference = useRef(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSlideIndex((current) => (current + 1) % slides.length)
    }, 5500)
    return () => window.clearInterval(timer)
  }, [])

  const openLogin = (role = 'Tourist') => {
    setSelectedRole(role)
    setAuthMode('login')
    setLoginError('')
    setAuthNotice('')
    setActiveView('auth')
  }

  useEffect(() => {
    if (!authReady || authInFlight.current) return
    if (session) {
      // Synchronize navigation with Firebase's external auth state.
      // oxlint-disable-next-line react/set-state-in-effect
      setSelectedRole(session.role)
      setActiveView(previous => previous === 'home' ? previous : session.role === 'Administrator' ? 'admin' : 'tourist')
    } else {
      setActiveView(previous => ['admin', 'tourist'].includes(previous) ? 'auth' : previous)
      setEditingPlace(null)
      setIsTouristPlanOpen(false)
    }
  }, [authReady, session])

  const signIn = async event => {
    event.preventDefault()
    if (authInFlight.current) return
    const data = new FormData(event.currentTarget)
    const email = String(data.get('email') || '').trim().toLowerCase()
    const password = String(data.get('password') || '')
    if (!email || !password) { setLoginError('Enter your email and password.'); return }
    authInFlight.current = true
    setLoginError('')
    try {
      await loginAccount(email, password, selectedRole)
      setAdminSection('overview')
      setActiveView(selectedRole === 'Administrator' ? 'admin' : 'tourist')
    } catch (error) { setLoginError(friendlyError(error)) }
    finally { authInFlight.current = false }
  }

  const createAccount = async event => {
    event.preventDefault()
    if (authInFlight.current) return
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim().toLowerCase()
    const password = String(data.get('password') || '')
    if (!name || !email) { setLoginError('Enter your name and email.'); return }
    if (password.length < 8) { setLoginError('Choose a password with at least 8 characters.'); return }
    if (password !== data.get('confirmPassword')) { setLoginError('The passwords do not match.'); return }
    authInFlight.current = true
    setLoginError('')
    try {
      await registerTouristAccount(name, email, password)
      setSelectedRole('Tourist')
      setActiveView('tourist')
      setNotice('Your account is ready. Welcome to Trieo.lk.')
    } catch (error) { setLoginError(friendlyError(error)) }
    finally { authInFlight.current = false }
  }

  const savePlace = async (event) => {
    event.preventDefault()
    if (writeInFlight.current || session?.role !== 'Administrator') return
    const formData = new FormData(event.currentTarget)
    const selectedCategories = formData.getAll('categories').map(String)
    const images = formData.getAll('images').map(String).map((url) => url.trim()).filter(Boolean)
    const openingFrom = String(formData.get('openingFrom') || '')
    const openingTo = String(formData.get('openingTo') || '')
    const placeDetails = {
      name: String(formData.get('name') || '').trim(),
      categories: selectedCategories,
      type: selectedCategories[0] || '',
      images,
      image: images[0],
      distance: String(formData.get('distance') || '').trim(),
      duration: String(formData.get('duration') || '').trim(),
      latitude: Number(formData.get('latitude')),
      longitude: Number(formData.get('longitude')),
      openingFrom,
      openingTo,
      hours: `${openingFrom} – ${openingTo}`,
      tag: String(formData.get('tag') || '').trim(),
      description: String(formData.get('description') || '').trim(),
      entranceFee: String(formData.get('entranceFee') || '').trim(),
      travelTips: String(formData.get('travelTips') || '').trim(),
      facilities: String(formData.get('facilities') || '').trim(),
    }

    if (!placeDetails.name || !placeDetails.description || !placeDetails.tag) {
      setNotice('A place name and both descriptions are required.')
      return
    }

    if (selectedCategories.length === 0 || selectedCategories.some((category) => !categories.includes(category))) {
      setNotice('Select at least one valid category for this attraction.')
      return
    }

    if (images.length < 3 || images.length > 5) {
      setNotice('Enter between three and five image URLs for this attraction.')
      return
    }

    if (openingFrom >= openingTo) {
      setNotice('Opening time must be earlier than closing time.')
      return
    }

    if (
      !Number.isFinite(placeDetails.latitude) ||
      placeDetails.latitude < -90 ||
      placeDetails.latitude > 90 ||
      !Number.isFinite(placeDetails.longitude) ||
      placeDetails.longitude < -180 ||
      placeDetails.longitude > 180
    ) {
      setNotice('Enter a valid latitude (-90 to 90) and longitude (-180 to 180).')
      return
    }

    // Keep one document reference per editor, including retries after a failed request.
    if (!placeReference.current) placeReference.current = attractionReference(editingPlace.id)
    writeInFlight.current = true
    setSaving(true)
    try {
      await storePlace(placeReference.current, placeDetails)
      setEditingPlace(null)
      placeReference.current = null
      setNotice(`${placeDetails.name} saved to Firestore.`)
    } catch (error) { setNotice(friendlyError(error)) }
    finally { writeInFlight.current = false; setSaving(false) }
  }

  const adminOperation = async (operation, message) => {
    if (writeInFlight.current || session?.role !== 'Administrator') return
    writeInFlight.current = true; setSaving(true)
    try { await operation(); setNotice(message) }
    catch (error) { setNotice(friendlyError(error)) }
    finally { writeInFlight.current = false; setSaving(false) }
  }
  const addCategory = category => adminOperation(() => addStoredCategory(category), `Category "${category}" added.`)
  const editCategory = (previous, name) => adminOperation(() => changeStoredCategory(previous, name), 'Category updated.')
  const deleteCategory = category => adminOperation(() => changeStoredCategory(category, null), 'Category deleted.')
  const deletePlace = place => {
    if (window.confirm(`Delete "${place.name}"? This cannot be undone.`)) return adminOperation(() => removePlace(place.id), `${place.name} deleted.`)
  }
  const persistPlan = async ids => {
    if (!session || !planReady || planInFlight.current) return
    planInFlight.current = true; setPlanSaving(true)
    try { await storePlan(session.uid, ids) }
    catch (error) { setNotice(friendlyError(error)) }
    finally { planInFlight.current = false; setPlanSaving(false) }
  }
  const toggleSavedPlace = id => persistPlan(savedPlaces.includes(id) ? savedPlaces.filter(value => value !== id) : [...savedPlaces, id])
  const movePlannedPlace = (id, direction) => {
    const index = savedPlaces.indexOf(id), destination = index + direction
    if (index < 0 || destination < 0 || destination >= savedPlaces.length) return
    const updated = [...savedPlaces]
    ;[updated[index], updated[destination]] = [updated[destination], updated[index]]
    return persistPlan(updated)
  }
  const signOut = async () => {
    try {
      await logoutAccount()
      setActiveView('home'); setIsTouristPlanOpen(false); setNotice(''); setEditingPlace(null); setViewingPlace(null)
    } catch (error) { setNotice(friendlyError(error)) }
  }

  const changeAuthMode = (mode) => {
    setAuthMode(mode)
    setLoginError('')
    if (mode === 'register') {
      setSelectedRole('Tourist')
      setAuthNotice('')
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#F9FAF8] text-stone-800 antialiased font-sans">
      {activeView !== 'admin' && <SiteHeader
        activeView={activeView}
        adminSection={adminSection}
        userName={userName}
        savedPlacesCount={savedPlaces.length}
        onOpenLogin={openLogin}
        onNavigateHome={() => {
          setAdminSection('overview')
          setActiveView('home')
        }}
        onNavigateTourist={() => {
          if (session?.role === 'Administrator') {
            setActiveView('admin')
            return
          }
          setIsTouristPlanOpen(true)
          setActiveView('tourist')
        }}
        onNavigateAdminSection={(section) => {
          setAdminSection(section)
          setActiveView('admin')
        }}
        onSignOut={signOut}
      />}


      {(backendError || loading || !authReady) && <div className="backend-status" role="status">{backendError || (!authReady ? 'Checking your account…' : 'Loading destinations from Firestore…')}</div>}
      {activeView === 'home' && (
        <HomePage
          places={places}
          onOpenLogin={openLogin}
          slideIndex={slideIndex}
          onSlideChange={setSlideIndex}
        />
      )}
      {activeView === 'auth' && (
        <AuthPage
          authMode={authMode}
          selectedRole={selectedRole}
          loginError={loginError}
          authNotice={authNotice}
          onChangeMode={changeAuthMode}
          onChangeRole={(role) => {
            setSelectedRole(role)
            setLoginError('')
            setAuthNotice('')
          }}
          onSignIn={signIn}
          onCreateAccount={createAccount}
        />
      )}
      {activeView === 'tourist' && session?.role === 'Tourist' && authReady && (
        <TouristDashboard
          isPlanOpen={isTouristPlanOpen}
          onOpenPlan={() => setIsTouristPlanOpen(true)}
          onClosePlan={() => setIsTouristPlanOpen(false)}
          places={places}
          savedPlaces={savedPlaces}
          userName={userName}
          notice={notice}
          onToggleSavedPlace={toggleSavedPlace}
          onViewPlace={setViewingPlace}
          onClearPlan={() => persistPlan([])}
          planSaving={planSaving}
          planReady={planReady}
          onMovePlace={movePlannedPlace}
        />
      )}
      {activeView === 'admin' && session?.role === 'Administrator' && authReady && (
        <AdminDashboard
          onSignOut={signOut}
          onNavigateHome={() => setActiveView('home')}
          places={places}
          categories={categories}
          users={users.map(user => user.id === session.uid ? { ...user, role: session.role } : user)}
          saving={saving}
          onSeedPlaces={() => adminOperation(() => seedCatalog(initialPlaces), 'Starter attractions imported. Verify their tourism data before publishing.')}
          section={adminSection}
          notice={notice}
          onChangeSection={(section) => {
            setAdminSection(section)
            setNotice('')
          }}
          onEditPlace={place => { placeReference.current = null; setNotice(''); setEditingPlace(place) }}
          onViewPlace={setViewingPlace}
          onDeletePlace={deletePlace}
          onAddPlace={() => {
            placeReference.current = null
            setNotice('')
            setEditingPlace({
              id: '',
              name: '',
              categories: [],
              images: ['', '', '', '', ''],
              distance: '',
              duration: '',
              latitude: '',
              longitude: '',
              openingFrom: '',
              openingTo: '',
              tag: '',
              description: '',
            })
          }}
          onAddCategory={addCategory}
          onEditCategory={editCategory}
          onDeleteCategory={deleteCategory}
        />
      )}

      {activeView !== 'admin' && <SiteFooter onNavigateHome={() => setActiveView('home')} />}

      <PlaceEditModal
        place={session?.role === 'Administrator' ? editingPlace : null}
        saving={saving}
        categories={categories}
        notice={notice}
        onClose={() => { if (!saving) { setEditingPlace(null); placeReference.current = null } }}
        onSave={savePlace}
      />
      <PlaceViewModal place={viewingPlace} onClose={() => setViewingPlace(null)} />
    </div>
  )
}

export default App
