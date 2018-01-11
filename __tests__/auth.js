const fetch = require('node-fetch')
const { apolloFetch, pgDatabase } = require('./helpers')

const LOGIN_USER_MUTATION = `
  mutation signIn($email: String!, $context: String) {
    signIn(email: $email, context: $context) {
      phrase
    }
  }
`

const LOGOUT_USER_MUTATION = `
  mutation signOut {
    signOut
  }
`

const signIn = async ({ user, context }) => {
  const { email } = user
  if (!email) return null
  await pgDatabase().public.sessions.truncate()
  try {
    await pgDatabase().public.users.insert(user)
  } catch (e) {
    console.warn(e)
    // ignore
  }
  await apolloFetch({
    query: LOGIN_USER_MUTATION,
    variables: {
      email,
      context
    }
  })
  const { sess: { token } } = await pgDatabase().public.sessions.findOne({
    'sess @>': { email: email }
  })
  const verifyUrl = `${process.env.PUBLIC_URL}/auth/email/signin?token=${token}&email=${email}`
  try {
    await fetch(verifyUrl)
  } catch (e) {
    console.warn(e)
  }
  const { id: userId } = await pgDatabase().public.users.findOne({ email })
  return { userId }
}

const signOut = async () => {
  await apolloFetch({
    query: LOGOUT_USER_MUTATION
  })
  await pgDatabase().public.sessions.truncate()
  return true
}

const Unverified = {
  id: 'a0000000-0000-0000-0001-000000000001',
  firstName: 'willhelm tell',
  lastName: 'unverified',
  email: 'willhelmtell@project-r.construction',
  roles: ['member'],
  verified: false
}

const Member = {
  id: 'a0000000-0000-0000-0001-000000000002',
  firstName: 'willhelm tell',
  lastName: 'member',
  email: 'willhelmtell_member@project-r.construction',
  roles: ['member'],
  verified: true
}

const Supporter = {
  id: 'a0000000-0000-0000-0001-000000000003',
  firstName: 'willhelm tell',
  lastName: 'supporter',
  email: 'willhelmtell_supporter@project-r.construction',
  roles: ['supporter'],
  verified: true
}

const Anonymous = {
  firstName: null,
  lastName: null,
  email: null
}

module.exports = {
  signIn,
  signOut,
  Users: {
    Supporter,
    Unverified,
    Anonymous,
    Member
  }
}