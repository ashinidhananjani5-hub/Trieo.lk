const accountStorageKey = 'trieo.touristAccounts'

export const adminCredentials = {
  email: 'admin@trieo.lk',
  password: 'admin123',
}

export async function createPasswordHash(password, salt = crypto.getRandomValues(new Uint8Array(16))) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' },
    key,
    256,
  )

  return {
    salt: Array.from(salt, (byte) => byte.toString(16).padStart(2, '0')).join(''),
    hash: Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join(''),
  }
}

export function readTouristAccounts() {
  const storedAccounts = window.localStorage.getItem(accountStorageKey)
  if (!storedAccounts) return []

  const accounts = JSON.parse(storedAccounts)
  if (
    !Array.isArray(accounts) ||
    accounts.some((account) =>
      typeof account.name !== 'string' ||
      typeof account.email !== 'string' ||
      typeof account.salt !== 'string' ||
      typeof account.hash !== 'string'
    )
  ) {
    throw new Error('Saved account data is invalid. Clear the Trieo.lk site data and try again.')
  }

  return accounts
}

export function saveTouristAccounts(accounts) {
  window.localStorage.setItem(accountStorageKey, JSON.stringify(accounts))
}

export async function verifyTouristPassword(account, password) {
  const salt = Uint8Array.from(
    account.salt.match(/.{2}/g) || [],
    (byte) => Number.parseInt(byte, 16),
  )
  const { hash } = await createPasswordHash(password, salt)
  if (hash !== account.hash) {
    throw new Error('The email or password is incorrect.')
  }
}

export async function registerTouristAccount(name, email, password) {
  const accounts = readTouristAccounts()
  if (accounts.some((account) => account.email === email)) {
    throw new Error('An account with this email already exists. Sign in instead.')
  }

  const { salt, hash } = await createPasswordHash(password)
  accounts.push({ name, email, salt, hash })
  window.localStorage.setItem(accountStorageKey, JSON.stringify(accounts))
}
