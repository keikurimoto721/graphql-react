import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./client";
import { Query } from "react-apollo";
import { ME, HUM, SEARCH_REPOSITORIES } from "./graphql";

// DEFAULT_STATE
const DEFAULT_STATE = {
  first: 5,
  after: null,
  last: null,
  before: null,
  query: "Repatch"
};

class App extends Component {
  // variablesの初期化
  constructor(props) {
    super(props);
    this.state = DEFAULT_STATE;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      ...DEFAULT_STATE,
      query: event.target.value
    });
  }

  handleSubmit(event) {
    // submitボタンはないのでpreventDefault
    event.preventDefault();
  }

  render() {
    const { query, first, last, before, after } = this.state;

    return (
      <ApolloProvider client={client}>
        <form onSubmit={this.handleSubmit}>
          <input value={query} onChange={this.handleChange} size="50" />
        </form>

        <div>Hello, GraphQL</div>

        <Query
          query={SEARCH_REPOSITORIES}
          variables={{ query, first, last, before, after }}
        >
          {({ loading, error, data }) => {
            if (loading) return "Loading...";
            if (error) return `Error! ${error.message}`;

            console.log({ query });
            console.log({ data });
            const repoCount = data.search.repositoryCount;
            const repoUnit = repoCount > 1 ? "Repositories" : "Repository";
            const title = `Results: ${repoCount} ${repoUnit} !`;
            return <h2>{title}</h2>;
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
