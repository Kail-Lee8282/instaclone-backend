import { gql } from "apollo-server-express";

export default gql`
  type Subscription {
    roomUpdates(id: Int!): UpdateMessage
  }

  type UpdateMessage {
    id: Int!
    payload: String!
    userId: Int
    roomId: Int
    read: Boolean!
    createAt: String!
    updateAt: String!
    user: User
  }
`;
