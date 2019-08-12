import React, { Component, Fragment } from "react";
import { ApolloProvider, Mutation, Query } from "react-apollo";
import client from "./client";
import { ADD_STAR, REMOVE_STAR, SEARCH_REPOSITORIES } from "./graphql";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1)
  },
  input: {
    display: "none"
  }
}));

const StarButton = props => {
  const classes = useStyles();
  const { node, query, first, last, before, after } = props;
  const totalCount = node.stargazers.totalCount;
  const viewerHasStarred = node.viewerHasStarred;
  const starCount = totalCount === 1 ? "1 star" : `${totalCount} stars`;
  const StarStatus = ({ addOrRemoveStar }) => {
    return (
      <Button
        variant="contained"
        color="primary"
        className={classes.button}
        onClick={() => {
          addOrRemoveStar({
            variables: { input: { starrableId: node.id } },
            update: (store, { data: { addStar, removeStar } }) => {
              console.log("update");
              const { starrable } = addStar || removeStar;
              const data = store.readQuery({
                query: SEARCH_REPOSITORIES,
                variables: { query, first, last, after, before }
              });
              console.log("after readQuery");
              console.log({ data });

              const edges = data.search.edges;
              const newEdges = edges.map(edge => {
                if (edge.node.id === node.id) {
                  const totalCount = edge.node.stargazers.totalCount;
                  const diff = starrable.viewerHasStarred ? 1 : -1;
                  const newTotalCount = totalCount + diff;
                  edge.node.stargazers.totalCount = newTotalCount;
                }
                return edge;
              });
              data.search.edges = newEdges;
              store.writeQuery({ query: SEARCH_REPOSITORIES, data });
              console.log("after writeQuery");
              console.log({ data });
            }
          });
        }}
      >
        {starCount} | {viewerHasStarred ? "starred" : "-"}
      </Button>
    );
  };
  return (
    <Mutation
      mutation={viewerHasStarred ? REMOVE_STAR : ADD_STAR}
      // refetchQueries={mutationResult => {
      //   console.log({ mutationResult });
      //   return [
      //     {
      //       query: SEARCH_REPOSITORIES,
      //       variables: { query, first, last, before, after }
      //     }
      //   ];
      // }}
    >
      {addOrRemoveStar => <StarStatus addOrRemoveStar={addOrRemoveStar} />}
    </Mutation>
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

            // console.log({ query });
            // console.log({ data });

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
                        <StarButton
                          node={node}
                          {...{ query, first, last, before, after }}
                        />
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
