import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db, requireFirebase } from '../../lib/firebase.js'
import { validateLoginRole } from '../../services/validation.js'

export async function accountRole(user) {
  const record = await getDoc(doc(db, 'admins', user.uid))
  return record.exists() && record.data().enabled === true ? 'Administrator' : 'Tourist'
}
export async function ensureProfile(user, name = user.displayName || 'Traveler') {
  const reference = doc(db, 'users', user.uid)
  if (!(await getDoc(reference)).exists()) {
    await setDoc(reference, { name, email: user.email, role: 'Tourist', createdAt: serverTimestamp() })
  }
}
export async function loginAccount(email, password, requestedRole) {
  requireFirebase()
  const { user } = await signInWithEmailAndPassword(auth, email, password)
  try {
    validateLoginRole(await accountRole(user), requestedRole)
    await ensureProfile(user)
    return user
  } catch (error) { await signOut(auth); throw error }
}
export async function registerTouristAccount(name, email, password) {
  requireFirebase()
  const { user } = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(user, { displayName: name })
  await ensureProfile(user, name)
  await setDoc(doc(db, 'users', user.uid), { name }, { merge: true })
  return user
}
export async function logoutAccount() { requireFirebase(); await signOut(auth) }
