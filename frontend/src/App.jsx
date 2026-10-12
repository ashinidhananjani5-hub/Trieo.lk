import { useEffect, useState } from 'react'
import PlaceEditModal from './components/PlaceEditModal.jsx'
import PlaceViewModal from './components/PlaceViewModal.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import { slides } from './data/landingContent.js'
import { initialPlaces } from './data/places.js'
import AdminDashboard from './features/admin/AdminDashboard.jsx'
import AuthPage from './features/auth/AuthPage.jsx'
import {
  adminCredentials,
  createPasswordHash,
  readTouristAccounts,
  saveTouristAccounts,
  verifyTouristPassword,
} from './features/auth/authService.js'
import HomePage from './features/home/HomePage.jsx'
import TouristDashboard from './features/tourist/TouristDashboard.jsx'
import './App.css'

function App() {
  const [places, setPlaces] = useState(initialPlaces)
  const [categories, setCategories] = useState(() => [
    ...new Set(initialPlaces.flatMap((place) => place.categories || [place.type])),
  ])
  const [slideIndex, setSlideIndex] = useState(0)
  const [activeView, setActiveView] = useState('home')
  const [adminSection, setAdminSection] = useState('overview')
  const [authMode, setAuthMode] = useState('login')
  const [selectedRole, setSelectedRole] = useState('Tourist')
  const [userName, setUserName] = useState('')
  const [loginError, setLoginError] = useState('')
  const [authNotice, setAuthNotice] = useState('')
  const [editingPlace, setEditingPlace] = useState(null)
  const [viewingPlace, setViewingPlace] = useState(null)
  const [savedPlaces, setSavedPlaces] = useState([])
  const [notice, setNotice] = useState('')

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

  const signIn = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')

    if (!email || !password) {
      setLoginError('Enter your email address and password to continue.')
      return
    }

    const authenticate = async () => {
      if (selectedRole === 'Administrator') {
        if (email !== adminCredentials.email || password !== adminCredentials.password) {
          setLoginError('The administrator email or password is incorrect.')
          return
        }

        setUserName('Administrator')
        setAdminSection('overview')
        setActiveView('admin')
        return
      }

      const account = readTouristAccounts().find((item) => item.email === email)
      if (!account) {
        setLoginError('No tourist account was found for this email. Create an account first.')
        return
      }

      await verifyTouristPassword(account, password)
      setUserName(account.name)
      setSavedPlaces([])
      setActiveView('tourist')
    }

    setLoginError('')
    authenticate().catch((error) => {
      setLoginError(`Unable to sign in: ${error.message}`)
    })
  }

  const createAccount = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim().toLowerCase()
    const password = String(formData.get('password') || '')
    const confirmPassword = String(formData.get('confirmPassword') || '')

    if (!name || !email) {
      setLoginError('Enter your name and a valid email address to create an account.')
      return
    }
    if (password.length < 8) {
      setLoginError('Choose a password with at least 8 characters.')
      return
    }
    if (password !== confirmPassword) {
      setLoginError('The passwords do not match.')
      return
    }

    const register = async () => {
      const accounts = readTouristAccounts()
      if (accounts.some((account) => account.email === email)) {
        setLoginError('An account with this email already exists. Sign in instead.')
        return
      }

      const { salt, hash } = await createPasswordHash(password)
      accounts.push({ name, email, salt, hash })
      saveTouristAccounts(accounts)
      setAuthMode('login')
      setSelectedRole('Tourist')
      setAuthNotice('Your account is ready. Sign in with your email and password.')
      setLoginError('')
    }

    setLoginError('')
    register().catch((error) => {
      setLoginError(`Unable to create your account: ${error.message}`)
    })
  }

  const savePlace = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const selectedCategories = formData.getAll('categories').map(String)
    const images = formData.getAll('images').map(String).map((url) => url.trim())
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
    }

    if (!placeDetails.name || !placeDetails.description || !placeDetails.tag) {
      setNotice('A place name and both descriptions are required.')
      return
    }

    if (selectedCategories.length === 0 || selectedCategories.some((category) => !categories.includes(category))) {
      setNotice('Select at least one valid category for this attraction.')
      return
    }

    if (images.length < 3 || images.some((image) => !image)) {
      setNotice('Enter at least three image URLs for this attraction.')
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

    if (!editingPlace.id) {
      const baseId = placeDetails.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const id = `${baseId || 'place'}-${Date.now()}`
      setPlaces((current) => [...current, { ...placeDetails, id }])
    } else {
      setPlaces((current) => current.map((place) => (
        place.id === editingPlace.id ? { ...place, ...placeDetails } : place
      )))
    }
    setEditingPlace(null)
    setNotice(`${placeDetails.name} ${editingPlace.id ? 'details updated' : 'added'}.`)
  }

  const addCategory = (category) => {
    if (categories.some((item) => item.toLowerCase() === category.toLowerCase())) {
      setNotice(`The category "${category}" already exists.`)
      return
    }

    setCategories((current) => [...current, category])
    setNotice(`Category "${category}" added.`)
  }

  const editCategory = (currentCategory, category) => {
    if (!category || category === currentCategory) return
    if (categories.some((item) => item.toLowerCase() === category.toLowerCase())) {
      setNotice(`The category "${category}" already exists.`)
      return
    }

    setCategories((current) => current.map((item) => item === currentCategory ? category : item))
    setPlaces((current) => current.map((place) => (
      place.categories?.includes(currentCategory) || place.type === currentCategory
        ? {
            ...place,
            categories: (place.categories || [place.type]).map((item) => item === currentCategory ? category : item),
            type: place.type === currentCategory ? category : place.type,
          }
        : place
    )))
    setNotice(`Category "${currentCategory}" renamed to "${category}".`)
  }

  const deleteCategory = (category) => {
    if (places.some((place) => place.categories?.includes(category) || place.type === category)) {
      setNotice(`Move attractions out of "${category}" before deleting it.`)
      return
    }

    setCategories((current) => current.filter((item) => item !== category))
    setNotice(`Category "${category}" deleted.`)
  }

  const deletePlace = (place) => {
    if (!window.confirm(`Delete "${place.name}"? This cannot be undone.`)) return

    setPlaces((current) => current.filter((item) => item.id !== place.id))
    setSavedPlaces((current) => current.filter((id) => id !== place.id))
    setNotice(`${place.name} deleted.`)
  }

  const toggleSavedPlace = (id) => {
    setSavedPlaces((current) =>
      current.includes(id) ? current.filter((placeId) => placeId !== id) : [...current, id],
    )
  }

  const signOut = () => {
    setActiveView('home')
    setUserName('')
    setSavedPlaces([])
    setNotice('')
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
      <SiteHeader
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
          setActiveView('tourist')
        }}
        onNavigateAdminSection={(section) => {
          setAdminSection(section)
          setActiveView('admin')
        }}
        onSignOut={signOut}
      />


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
      {activeView === 'tourist' && (
        <TouristDashboard
          places={places}
          savedPlaces={savedPlaces}
          userName={userName}
          notice={notice}
          onToggleSavedPlace={toggleSavedPlace}
        />
      )}
      {activeView === 'admin' && (
        <AdminDashboard
          places={places}
          categories={categories}
          users={[
            { name: 'Administrator', email: adminCredentials.email, role: 'Administrator' },
            ...readTouristAccounts().map(({ name, email }) => ({ name, email, role: 'Tourist' })),
          ]}
          section={adminSection}
          notice={notice}
          onChangeSection={(section) => {
            setAdminSection(section)
            setNotice('')
          }}
          onEditPlace={setEditingPlace}
          onViewPlace={setViewingPlace}
          onDeletePlace={deletePlace}
          onAddPlace={() => {
            setNotice('')
            setEditingPlace({
              id: '',
              name: '',
              categories: [],
              images: ['', '', ''],
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

      <SiteFooter />

      <PlaceEditModal
        place={editingPlace}
        categories={categories}
        notice={notice}
        onClose={() => setEditingPlace(null)}
        onSave={savePlace}
      />
      <PlaceViewModal place={viewingPlace} onClose={() => setViewingPlace(null)} />
    </div>
  )
}

export default App
