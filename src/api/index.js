import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { gql } from 'apollo-boost';
import config from '../config';

const httpLink = createHttpLink({
  uri: config.endpoint,
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${config.accessToken}`,
    }
  }
});

export default new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export const GET_LICENSES = gql`
    {
        licenses {
            id
            name
            key
        }
    }
`;

export const GET_REPOSITORIES = gql`
    query getRepositories($query: String!, $first: Int, $last: Int, $after: String, $before: String) {
        search(query: $query, after: $after, before: $before, type: REPOSITORY, first: $first, last: $last) {
            nodes {
                ... on Repository {
                    id
                    name
                    owner {
                        login
                    }
                    stargazers {
                        totalCount
                    }
                    licenseInfo {
                        name
                    }
                    description
                    createdAt
                }
            }
            pageInfo {
                endCursor
                hasNextPage
                hasPreviousPage
                startCursor
            }
        }
    }
`;
