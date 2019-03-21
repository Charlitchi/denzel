const typeDefs = [`
  type Query {
    populate: Int
    movies: [Movie]
    movie: Int
    review: Movie
  }
  type Mutation {
    upvotePost (
      postId: ID!
    ): Post
  }
  type Movie {
    title: String
    link: String
    id: String
    metascore: Int
    poster: String
    rating: Float
    synopsis: String
    votes: Long
    year: Int
    date: String
    review: String
  }

  schema {
    query: Query
    mutation: Mutation
  }`
];
