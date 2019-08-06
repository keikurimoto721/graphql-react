import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./client";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const ME = gql`
  query me {
    user(login: "keikurimoto721") {
      name
      avatarUrl
    }
  }
`;

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>Hello, GraphQL</div>
        <Query query={ME}>
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            return (
              <div>
                <img src={data.user.avatarUrl} width={100} />
              </div>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
