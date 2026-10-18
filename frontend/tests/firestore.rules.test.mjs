import { after, before, beforeEach, test } from 'node:test'
import { readFileSync } from 'node:fs'
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc, writeBatch } from 'firebase/firestore'
let env
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-trieo', firestore: { rules: readFileSync(new URL('../../firestore.rules', import.meta.url), 'utf8') } })
})
after(async () => env?.cleanup())
beforeEach(async () => {
  await env.clearFirestore()
  await env.withSecurityRulesDisabled(async context => {
    await setDoc(doc(context.firestore(), 'admins', 'admin'), { enabled: true })
    await setDoc(doc(context.firestore(), 'categories', 'catalog'), { names: ['Nature'] })
  })
})
const place = () => ({ name: 'Test attraction', categories: ['Nature'], type: 'Nature', description: 'Test description', distance: '2 km', duration: '1 hr', image: 'https://example.com/image.jpg', hours: 'Open daily', updatedAt: serverTimestamp() })
test('public can browse but cannot add, edit, or delete attractions', async () => {
  const db = env.unauthenticatedContext().firestore()
  await assertSucceeds(getDocs(collection(db, 'places')))
  await assertFails(setDoc(doc(db, 'places', 'p'), place()))
  await assertFails(deleteDoc(doc(db, 'places', 'p')))
})
test('tourist cannot promote themselves or list other profiles', async () => {
  const db = env.authenticatedContext('alice', { email: 'alice@example.com' }).firestore()
  await assertSucceeds(setDoc(doc(db, 'users', 'alice'), { name: 'Alice', email: 'alice@example.com', role: 'Tourist', createdAt: serverTimestamp() }))
  await assertFails(updateDoc(doc(db, 'users', 'alice'), { role: 'Administrator' }))
  await assertFails(setDoc(doc(db, 'admins', 'alice'), { enabled: true }))
  await assertFails(getDocs(collection(db, 'users')))
  await assertFails(setDoc(doc(db, 'places', 'p'), place()))
})
test('day plans are private, unique, and owned by the authenticated UID', async () => {
  const alice = env.authenticatedContext('alice').firestore()
  const bob = env.authenticatedContext('bob').firestore()
  await assertSucceeds(setDoc(doc(alice, 'plans', 'alice'), { placeIds: ['p2', 'p1'], updatedAt: serverTimestamp() }))
  await assertSucceeds(getDoc(doc(alice, 'plans', 'alice')))
  await assertFails(getDoc(doc(bob, 'plans', 'alice')))
  await assertFails(setDoc(doc(bob, 'plans', 'alice'), { placeIds: [], updatedAt: serverTimestamp() }))
  await assertFails(setDoc(doc(alice, 'plans', 'alice'), { placeIds: ['p1', 'p1'], updatedAt: serverTimestamp() }))
})
test('admin can manage places, but malformed coordinates and unknown categories are rejected', async () => {
  const db = env.authenticatedContext('admin').firestore()
  await assertSucceeds(setDoc(doc(db, 'places', 'p'), place()))
  await assertSucceeds(updateDoc(doc(db, 'places', 'p'), { name: 'Updated', updatedAt: serverTimestamp() }))
  await assertFails(setDoc(doc(db, 'places', 'bad'), { ...place(), latitude: 200, longitude: 81 }))
  await assertFails(setDoc(doc(db, 'places', 'bad'), { ...place(), categories: ['Unknown'], type: 'Unknown' }))
  await assertSucceeds(deleteDoc(doc(db, 'places', 'p')))
})
test('a catalog rename and related places can be committed atomically', async () => {
  const db = env.authenticatedContext('admin').firestore()
  await assertSucceeds(setDoc(doc(db, 'places', 'p'), place()))
  const batch = writeBatch(db)
  batch.set(doc(db, 'categories', 'catalog'), { names: ['Wildlife'], updatedAt: serverTimestamp() })
  batch.update(doc(db, 'places', 'p'), { categories: ['Wildlife'], type: 'Wildlife', updatedAt: serverTimestamp() })
  await assertSucceeds(batch.commit())
})
