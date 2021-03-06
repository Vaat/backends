module.exports = `
schema {
  query: queries
  mutation: mutations
}

type queries {
  me: User

  # check if a username is available
  # also returns true if you already own it
  # ensures signed in
  checkUsername(username: String): Boolean

  # get user by slug—a id or username
  # only returns users with a public profile
  user(slug: String): User
  # search for users
  # required role: editor
  users(search: String!, role: String): [User]!

  # search for an unverified session by token
  unauthorizedSession(email: String!, token: String!): Session

  # the requesting userAgent
  echo: RequestInfo!
}

type mutations {
  # signIn with an email address
  signIn(email: String!, context: String): SignInResponse!
  signOut: Boolean!

  # authorize a token sent by mail to convert a login request to a valid user session
  authorizeSession(email: String!, token: String!): Boolean!

  # if userId is null, this operation will be scoped to the logged in user
  # required role to clear other's session: supporter
  clearSession(sessionId: ID!, userId: ID): Boolean!

  # if userId is null, the logged in user's sessions get cleared
  # required role to clear other's session: supporter
  clearSessions(userId: ID): Boolean!

  # Add a user to a given role
  addUserToRole(userId: ID!, role: String!): User!

  # Remove a user from a given role
  removeUserFromRole(userId: ID!, role: String!): User!
}
`
