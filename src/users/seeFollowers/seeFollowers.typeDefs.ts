import { gql } from "apollo-server-express";

export default gql`
type seeFollowersQuery{
    ok:Boolean!
    error:String
    followers:[User]
    totalPages:Int
}
type Query{
    seeFollowers(userName:String!, page:Int!):seeFollowersQuery!
}
`
