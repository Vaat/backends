const typeDefinitions = `
scalar Date
scalar DateTime

schema {
  query: RootQuerys
  mutation: RootMutations
  subscription: RootSubscription
}


type RootQuerys {
  me: User
  repos(first: Int!): [Repo]!
  repo(id: ID!): Repo!
  # published documents
  documents: [Document]!
}

type Repo {
  id: ID!
  commits(page: Int): [Commit!]!
  milestones: [Milestone!]!
  uncommittedChanges: [User!]!
}

type Milestone {
  name: String!
  message: String
  commit: Commit!
  author: Author!
}

type Commit {
  id: ID!
  parentIds: [ID!]!
  message: String
  author: Author!
  date: DateTime!
  document: Document!
# files: [File]!
}


interface FileInterface {
  content: String!
  meta: Meta!
}

type Document implements FileInterface {
  # AST of /article.md
  content: String!
  meta: Meta!
  commit: Commit!
}

type Meta {
  title: String
  description: String
  image: String
#  readingMinutes: Int!
#  fbTitle: String
}

#type File implements FileInterface {
#  encoding: String!
#  content: String!
#  meta: Meta!
#}

type Author {
  name: String!
  email: String!
  user: User
}

type UncommittedChangeUpdate {
  repoId: ID!
  user: User!
  action: Action!
}

type User {
  id: ID!
  name: String
  firstName: String
  lastName: String
  email: String!
  githubScope: String
  roles: [String]!
}

type SignInResponse {
  phrase: String!
}

enum Action {
  create
  delete
}


type RootMutations {
  signIn(email: String!): SignInResponse!
  signOut: Boolean!

  commit(
    repoId: ID!
    parentId: ID!
    message: String!
    document: DocumentInput!
    # files: [FileInput!]!     # FileInput
  ): Commit!

  placeMilestone(
    repoId: ID!
    commitId: ID!
    name: String!
    message: String!
  ): Milestone!

  removeMilestone(
    repoId: ID!
    name: String!
  ): Boolean!

  # Inform about my uncommited changes in the repo
  uncommittedChanges(
    repoId: ID!
    action: Action!
  ): Boolean!
}

# implements FileInterface
input DocumentInput {
  # AST of /article.md
  content: String!
}

type RootSubscription {
  # Provides updates to the list of users
  # with uncommited changes in the repo
  uncommittedChanges(
    repoId: ID!
  ): UncommittedChangeUpdate!
}
`
module.exports = [typeDefinitions]
