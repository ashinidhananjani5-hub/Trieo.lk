import { collection, deleteDoc, doc, getDocs, onSnapshot, runTransaction, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore'
import { db, requireFirebase } from '../lib/firebase.js'
import { cleanPlan, validateCategory } from './validation.js'

const catalog = () => doc(db, 'categories', 'catalog')
export function watchPlaces(next, error) {
  return onSnapshot(collection(db, 'places'), snapshot => next(snapshot.docs.map(item => ({ ...item.data(), id: item.id })).sort((a, b) => a.name.localeCompare(b.name))), error)
}
export function watchCategories(next, error) { return onSnapshot(catalog(), snapshot => next(snapshot.data()?.names || []), error) }
export function watchUsers(next, error) {
  return onSnapshot(collection(db, 'users'), snapshot => next(snapshot.docs.map(item => ({ ...item.data(), id: item.id }))), error)
}
export function watchPlan(uid, next, error) { return onSnapshot(doc(db, 'plans', uid), snapshot => { try { next(cleanPlan(snapshot.data()?.placeIds || [])) } catch (failure) { error(failure) } }, error) }
export async function storePlan(uid, ids) { requireFirebase(); await setDoc(doc(db, 'plans', uid), { placeIds: cleanPlan(ids), updatedAt: serverTimestamp() }) }
export function attractionReference(id) { return id ? doc(db, 'places', id) : doc(collection(db, 'places')) }
export async function storePlace(reference, data) {
  requireFirebase()
  await setDoc(reference, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}
export async function removePlace(id) { requireFirebase(); await deleteDoc(doc(db, 'places', id)) }
export async function addStoredCategory(name) {
  requireFirebase()
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(catalog())
    const names = snapshot.data()?.names || []
    const value = validateCategory(name, names)
    transaction.set(catalog(), { names: [...names, value], updatedAt: serverTimestamp() })
  })
}
// Category changes update the catalog and related places in one atomic batch.
// This project has a small attraction catalog; cap avoids partial commits.
export async function changeStoredCategory(previous, next) {
  requireFirebase()
  const [allPlaces, catalogSnapshot] = await Promise.all([getDocs(collection(db, 'places')), getDocs(collection(db, 'categories'))])
  const names = catalogSnapshot.docs.find(item => item.id === 'catalog')?.data().names || []
  const value = next == null ? null : validateCategory(next, names, previous)
  if (!names.includes(previous)) throw new Error('This category no longer exists. Refresh and try again.')
  const affected = allPlaces.docs.filter(item => (item.data().categories || [item.data().type]).includes(previous))
  if (value == null && affected.length) throw new Error('Move attractions out of this category before deleting it.')
  if (affected.length > 450) throw new Error('Too many related places for one update. Contact the administrator.')
  const batch = writeBatch(db)
  batch.set(catalog(), { names: value == null ? names.filter(item => item !== previous) : names.map(item => item === previous ? value : item), updatedAt: serverTimestamp() })
  affected.forEach(item => {
    const data = item.data()
    batch.update(item.ref, { categories: (data.categories || [data.type]).map(name => name === previous ? value : name), type: data.type === previous ? value : data.type, updatedAt: serverTimestamp() })
  })
  await batch.commit()
}
export async function seedCatalog(places) {
  requireFirebase()
  const existing = await getDocs(collection(db, 'places'))
  if (!existing.empty) throw new Error('Only an empty attraction collection can be initialized.')
  const snapshot = await getDocs(collection(db, 'categories'))
  const names = snapshot.docs.find(item => item.id === 'catalog')?.data().names || []
  const batch = writeBatch(db)
  batch.set(catalog(), { names: [...new Set([...names, ...places.flatMap(place => place.categories || [place.type])])], updatedAt: serverTimestamp() })
  places.forEach(({ id, ...place }) => batch.set(doc(db, 'places', id), { ...place, categories: place.categories || [place.type], updatedAt: serverTimestamp() }))
  await batch.commit()
}
