import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./client";
import { Query } from "react-apollo";
import { ME, HUM, SEARCH_REPOSITORIES } from "./graphql";

// VARIABLES
const VARIABLES = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "フロントエンドエンジニア"
};

class App extends Component {
  // variablesの初期化
  constructor(props) {
    super(props);
    this.state = VARIABLES;
  }

  render() {
    const { query, first, last, before, after } = this.state;
    return (
      <ApolloProvider client={client}>
        <div>Hello, GraphQL</div>

        <Query
          query={SEARCH_REPOSITORIES}
          variables={{ query, first, last, before, after }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            console.log({ data });
            return <div />;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
