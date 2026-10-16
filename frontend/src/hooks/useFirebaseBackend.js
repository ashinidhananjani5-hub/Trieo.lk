import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db, firebaseConfigured } from '../lib/firebase.js'
import { friendlyError } from '../services/validation.js'
import { watchCategories, watchPlaces, watchPlan, watchUsers } from '../services/firestoreService.js'

export default function useFirebaseBackend() {
  const [session, setSession] = useState(null)
  const [authReady, setAuthReady] = useState(!firebaseConfigured)
  const [places, setPlaces] = useState([])
  const [categories, setCategories] = useState([])
  const [users, setUsers] = useState([])
  const [plan, setPlan] = useState([])
  const [planReady, setPlanReady] = useState(false)
  const [loading, setLoading] = useState(firebaseConfigured)
  const [error, setError] = useState(firebaseConfigured ? '' : 'Firebase configuration is missing. Add frontend/.env.local and restart Vite.')
  useEffect(() => {
    if (!firebaseConfigured) return
    const fail = error => { setError(friendlyError(error)); setLoading(false) }
    const stops = [watchPlaces(data => { setPlaces(data); setLoading(false) }, fail), watchCategories(setCategories, fail)]
    return () => stops.forEach(stop => stop())
  }, [])
  useEffect(() => {
    if (!auth) return
    let stopAdmin = () => {}, stopProfile = () => {}, generation = 0
    const stopAuth = onAuthStateChanged(auth, user => {
      generation += 1
      const current = generation
      stopAdmin(); stopProfile()
      setPlan([]); setPlanReady(false); setUsers([]); setSession(null)
      if (!user) { setAuthReady(true); return }
      setAuthReady(false)
      let name = user.displayName || 'Traveler'
      let role = 'Tourist'
      const update = () => { if (current === generation) { setSession({ uid: user.uid, email: user.email, name, role }); setAuthReady(true) } }
      stopProfile = onSnapshot(doc(db, 'users', user.uid), snapshot => { if (current !== generation) return; name = snapshot.data()?.name || user.displayName || 'Traveler'; setSession(previous => previous?.uid === user.uid ? { ...previous, name } : previous) }, error => setError(friendlyError(error)))
      stopAdmin = onSnapshot(doc(db, 'admins', user.uid), snapshot => { if (current !== generation) return; role = snapshot.data()?.enabled === true ? 'Administrator' : 'Tourist'; update() }, error => { setError(friendlyError(error)); setAuthReady(true) })
    }, error => { setError(friendlyError(error)); setAuthReady(true) })
    return () => { generation += 1; stopAuth(); stopAdmin(); stopProfile() }
  }, [])
  const uid = session?.uid
  const role = session?.role
  useEffect(() => {
    if (!uid) return
    const stops = [watchPlan(uid, data => { if (auth.currentUser?.uid === uid) { setPlan(data); setPlanReady(true) } }, error => { setPlanReady(false); setError(friendlyError(error)) })]
    if (role === 'Administrator') stops.push(watchUsers(setUsers, error => setError(friendlyError(error))))
    return () => stops.forEach(stop => stop())
  }, [uid, role])
  return { session, authReady, places, categories, users, savedPlaces: plan, planReady, loading, error }
}
