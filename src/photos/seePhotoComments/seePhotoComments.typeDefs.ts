import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seePhotoComments(photoId: Int!): [Comment]
  }
`;
