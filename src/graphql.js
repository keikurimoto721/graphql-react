import gql from "graphql-tag";

export const ME = gql`
  query me {
    user(login: "keikurimoto721") {
      name
      avatarUrl
    }
  }
`;

export const HUM = gql`
  query me {
    user(login: "iteachonudemy") {
      name
      avatarUrl
    }
  }
`;
