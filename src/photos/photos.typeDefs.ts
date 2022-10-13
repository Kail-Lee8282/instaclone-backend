import { gql } from "apollo-server-express";

export default gql`
  type Photo {
    id: Int!
    user: User!
    file: String!
    caption: String
    likes: Int!
    comments: Int!
    hashtags: [Hashtag]
    isMine: Boolean!
    createAt: String!
    updateAt: String!
  }

  type Hashtag {
    id: Int!
    hashtag: String!
    photos(page: Int!): [Photo]
    totalPhotos: Int
    createAt: String!
    updateAt: String!
  }

  type Like {
    id: Int!
    photo: Photo!
    createAt: String!
    updateAt: String!
  }
`;
