import React, { Component, Fragment } from "react";
import { ApolloProvider } from "react-apollo";
import client from "./client";
import { Query } from "react-apollo";
import { SEARCH_REPOSITORIES } from "./graphql";

const StarButton = props => {
  const node = props.node;
  const totalCount = node.stargazers.totalCount;
  const viewerHasStarred = node.viewerHasStarred;
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`;
  return (
    <button>
      {starCount} | {viewerHasStarred ? "starred!!" : "-"}
    </button>
  );
};

const PER_PAGE = 5;
// DEFAULT_STATE
const DEFAULT_STATE = {
  first: PER_PAGE,
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

  // 次へボタン押下時の処理
  goNext(search) {
    this.setState({
      first: PER_PAGE,
      after: search.pageInfo.endCursor,
      last: null,
      before: null
    });
  }
  // Backボタン押下時の処理
  goBack(search) {
    this.setState({
      first: null,
      after: null,
      last: PER_PAGE,
      before: search.pageInfo.startCursor
    });
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

            const search = data.search;
            const repoCount = search.repositoryCount;
            const repoUnit = repoCount > 1 ? "Repositories" : "Repository";

            return (
              <Fragment>
                <h2>{`Results: ${repoCount} ${repoUnit} !`}</h2>
                <ul>
                  {search.edges.map(edge => {
                    const node = edge.node;

                    return (
                      <li key={node.id}>
                        <a
                          href={node.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {node.name}
                        </a>
                        &nbsp;
                        <StarButton node={node} />
                      </li>
                    );
                  })}
                </ul>
                {search.pageInfo.hasPreviousPage === true ? (
                  <button onClick={this.goBack.bind(this, search)}>Back</button>
                ) : null}
                {search.pageInfo.hasNextPage === true ? (
                  <button onClick={this.goNext.bind(this, search)}>Next</button>
                ) : null}
              </Fragment>
            );
          }}
        </Query>
      </ApolloProvider>
    );
  }
}

export default App;
