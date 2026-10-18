export function validateLoginRole(actualRole, requestedRole) {
  if (!['Tourist', 'Administrator'].includes(requestedRole)) throw new Error('Select a valid account type.')
  if (actualRole !== requestedRole) {
    throw new Error('Unable to sign in. Please check your login details and try again.')
  }
}

export function friendlyError(error) {
  const messages = {
    'auth/invalid-credential': 'Unable to sign in. Please check your login details and try again.',
    'auth/user-not-found': 'Unable to sign in. Please check your login details and try again.',
    'auth/wrong-password': 'Unable to sign in. Please check your login details and try again.',
    'auth/email-already-in-use': 'This email already has an account. Sign in instead.',
    'auth/invalid-email': 'Enter a valid email address.',
    'auth/weak-password': 'Choose a stronger password with at least 8 characters.',
    'auth/password-does-not-meet-requirements': 'This password does not meet the Firebase password policy.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed': 'Unable to connect. Check your internet connection.',
    'auth/operation-not-allowed': 'Email/password sign-in must be enabled in Firebase Authentication.',
    'auth/user-disabled': 'This account is disabled. Contact the administrator.',
    'permission-denied': 'Access denied. Check your account permissions and published Firestore rules.',
    'unavailable': 'Firestore is temporarily unavailable. Check your connection and retry.',
  }
  return messages[error.code] || error.message || 'Something went wrong. Please try again.'
}
export function cleanPlan(ids) {
  if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string' || !id || id.length > 1500)) throw new Error('Invalid day plan.')
  if (ids.length > 100) throw new Error('A day plan can contain at most 100 places.')
  return [...new Set(ids)]
}
export function validateCategory(name, existing, previous = null) {
  const value = String(name || '').trim()
  if (!value || value.length > 60) throw new Error('Enter a category name between 1 and 60 characters.')
  if (existing.some(item => item !== previous && item.toLowerCase() === value.toLowerCase())) throw new Error('This category already exists.')
  return value
}
