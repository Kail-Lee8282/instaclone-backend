import { gql } from "apollo-server-express";

export default gql`
  type Message {
    id: Int!
    payload: String!
    user: User!
    room: Room!
    read: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Room {
    id: Int!
    users: [User]
    messages: [Message]
    unReadTotal: Int!
    createdAt: String!
    updatedAt: String!
  }
`;