import { FunctionComponent } from "react";
import { gql, useQuery } from "urql";

import { NexusGenObjects } from "api/src/nexus";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as HeartFilledIcon } from "../assets/heart-filled.svg";

const pokemonsQuery = gql<{
  pokemons: { edges: Array<NexusGenObjects["Pokemon"]> };
}>`
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
      totalCount
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

const PokemonsListing: FunctionComponent = () => {
  const [{ data, fetching, error }] = useQuery({
    query: pokemonsQuery,
    variables: {},
  });

  return fetching ? (
    <h2>Loading</h2>
  ) : error ? (
    <p>Oh no... {error.message}</p>
  ) : (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.pokemons.edges.map((p) => (
        <div key={p.id} className="border border-emerald-500 flex flex-col">
          <a
            href={`#`}
            className="bg-white flex flex-col flex-1 justify-center p-4"
          >
            <img
              src={`https://img.pokemondb.net/artwork/${p.name
                .toLowerCase()
                .replace(/[&\\/#,+()$~%.'":*?<>{}]/g, "")
                .replace(" ", "-")}.jpg`}
              alt={`Avatar image of ${p.name} pokémon`}
            />
          </a>
          <div className="h-[74px] relative">
            <button className="absolute top-6 right-2 text-amber-600 z-10">
              {p.favourite === true ? (
                <HeartFilledIcon className="h-7 w-7" />
              ) : (
                <HeartIcon className="h-7 w-7" />
              )}
            </button>

            <a href={`#`} className="absolute inset-x-0 inset-y-0 p-3">
              <h4 className="font-bold text-xl">{p.name}</h4>
              <span>{p.types.join(", ")}</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PokemonsListing;
