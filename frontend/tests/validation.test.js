import assert from 'node:assert/strict'
import test from 'node:test'
import { cleanPlan, friendlyError, validateCategory } from '../src/services/validation.js'

test('day plan rejects malformed input and preserves unique selected order', () => {
  assert.deepEqual(cleanPlan(['second', 'first', 'second']), ['second', 'first'])
  assert.throws(() => cleanPlan('bad'))
  assert.throws(() => cleanPlan([null]))
  assert.throws(() => cleanPlan(['']))
  assert.throws(() => cleanPlan(Array.from({ length: 101 }, (_, i) => `p${i}`)))
})
test('category validation prevents empty, excessive, and case-insensitive duplicate names', () => {
  assert.equal(validateCategory(' Nature ', []), 'Nature')
  assert.throws(() => validateCategory('nature', ['Nature']))
  assert.throws(() => validateCategory(' ', []))
  assert.throws(() => validateCategory('x'.repeat(61), []))
  assert.equal(validateCategory('NATURE', ['Nature'], 'Nature'), 'NATURE')
})
test('authentication and permissions failures have safe actionable feedback', () => {
  assert.equal(friendlyError({ code: 'auth/wrong-password' }), friendlyError({ code: 'auth/user-not-found' }))
  assert.match(friendlyError({ code: 'permission-denied' }), /rules/)
  assert.match(friendlyError({ code: 'auth/operation-not-allowed' }), /enabled/)
})
