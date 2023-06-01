import { FunctionComponent } from "react";
import { gql, useQuery } from "urql";

import { NexusGenObjects, NexusGenArgTypes } from "api/src/nexus";
import PokemonCard from "./PokemonCard";

interface Props {
  isLastPage: boolean;
  loadMore: (cursor: string) => void;
  variables: NexusGenArgTypes["Query"]["pokemons"];
}

const pokemonsQuery = gql<
  {
    pokemons: {
      edges: Array<NexusGenObjects["Pokemon"]>;
      pageInfo: NexusGenObjects["PokemonListPageInfo"];
    };
  },
  NexusGenArgTypes["Query"]["pokemons"]
>`
  query Pokemons(
    $findByName: String
    $isFavourited: Boolean
    $cursor: String
    $pageSize: Int
  ) {
    pokemons(
      findByName: $findByName
      isFavourited: $isFavourited
      cursor: $cursor
      pageSize: $pageSize
    ) {
      pageInfo {
        nextCursor
      }
      edges {
        id
        name
        favourite
        types
      }
    }
  }
`;

const PokemonsListing: FunctionComponent<Props> = ({
  isLastPage,
  loadMore,
  variables,
}) => {
  const [{ data, fetching, error }] = useQuery({
    query: pokemonsQuery,
    variables,
  });

  return fetching ? (
    <h2>Loading</h2>
  ) : error ? (
    <p>Oh no... {error.message}</p>
  ) : (
    <>
      {data.pokemons.edges.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}

      {isLastPage && data.pokemons.pageInfo.nextCursor != null && (
        <button
          className="bg-emerald-500 text-white mx-auto px-8 py-2"
          onClick={(ev) => {
            ev.preventDefault();
            loadMore(data.pokemons.pageInfo.nextCursor);
          }}
        >
          Load more
        </button>
      )}
    </>
  );
};

export default PokemonsListing;
