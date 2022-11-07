import { gql } from "apollo-server-express";

export default gql`
  type Message {
    id: Int!
    payload: String!
    user: User
    userId: Int
    room: Room!
    roomId: Int
    read: Boolean!
    createAt: String!
    updateAt: String!
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
