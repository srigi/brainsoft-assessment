import { FunctionComponent } from "react";
import { gql, useQuery } from "urql";

import { NexusGenObjects, NexusGenArgTypes } from "api/src/nexus";
import PokemonCard from "./PokemonCard";
import PokemonListingDetailCard from "./PokemonListingDetailCard";

interface Props {
  isLastPage: boolean;
  loadMore: (cursor: string) => void;
  variables: NexusGenArgTypes["Query"]["pokemons"];
  variant: "grid" | "list";
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
const pokemonsDetailedQuery = gql<
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
        maxCP
        maxHP
        height {
          minimum
          maximum
        }
        weight {
          minimum
          maximum
        }
      }
    }
  }
`;

const PokemonsListing: FunctionComponent<Props> = ({
  isLastPage,
  loadMore,
  variables,
  variant,
}) => {
  const [{ data, fetching, error }] = useQuery({
    query: (() => {
      switch (variant) {
        case "grid":
          return pokemonsQuery;
        case "list":
          return pokemonsDetailedQuery;
        default:
          throw "Unknown listing variant!";
      }
    })(),
    variables,
  });

  return fetching ? (
    <h2>Loading</h2>
  ) : error ? (
    <p>Oh no... {error.message}</p>
  ) : (
    <>
      {data.pokemons.edges.map((p) => (
        <>
          {variant === "grid" && <PokemonCard key={p.id} pokemon={p} />}
          {variant === "list" && (
            <PokemonListingDetailCard key={p.id} pokemon={p} />
          )}
        </>
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
