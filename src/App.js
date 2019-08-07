import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./client";
import { Query } from "react-apollo";
import { HUM } from "./graphql";

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>Hello, GraphQL</div>
        <Query query={HUM}>
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
