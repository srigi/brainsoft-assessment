import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "urql";

import { NexusGenObjects } from "api/src/nexus";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as HeartFilledIcon } from "../assets/heart-filled.svg";

const pokemonQuery = gql<{ pokemon: NexusGenObjects["Pokemon"] }>`
  query Pokemon($findById: String) {
    pokemon(findById: $findById) {
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
`;

const PokemonDetailPage: FunctionComponent = () => {
  const { id } = useParams();
  const [{ data, fetching, error }] = useQuery({
    query: pokemonQuery,
    variables: { findById: id },
  });

  return (
    <div className="container flex flex-col gap-4 py-8">
      {fetching ? (
        <h2>Loading</h2>
      ) : error ? (
        <p>Oh no... {error.message}</p>
      ) : (
        <div className="border border-emerald-500 flex flex-col mx-40">
          <div className="bg-white flex flex-col flex-1 justify-center p-4">
            <img
              src={`https://img.pokemondb.net/artwork/${data.pokemon.name
                .toLowerCase()
                .replace(/[&\\/#,+()$~%.'":*?<>{}]/g, "")
                .replace(" ", "-")}.jpg`}
              alt={`Avatar image of ${data.pokemon.name} pokémon`}
            />
          </div>

          <div className="flex justify-between p-4">
            <div>
              <h1 className="font-bold text-xl">{data.pokemon.name}</h1>
              <span>{data.pokemon.types.join(", ")}</span>
            </div>
            <button className="text-amber-600">
              {data.pokemon.favourite === true ? (
                <HeartFilledIcon className="h-7 w-7" />
              ) : (
                <HeartIcon className="h-7 w-7" />
              )}
            </button>
          </div>

          <div className="border-b border-b-gray-300 flex flex-col p-4">
            <div className="flex gap-4 items-center">
              <div className="bg-sky-400 flex-1 h-2 rounded-full" />
              <div className="font-bold">CP: {data.pokemon.maxCP}</div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="bg-emerald-400 flex-1 h-2 rounded-full" />
              <div className="font-bold">HP: {data.pokemon.maxHP}</div>
            </div>
          </div>

          <div className="flex">
            <div className="border-r border-r-gray-300 flex-1 flex flex-col items-center py-4">
              <h3 className="font-bold">Weight</h3>
              {data.pokemon.weight.minimum} - {data.pokemon.weight.maximum}
            </div>
            <div className="flex-1 flex flex-col items-center py-4">
              <h3 className="font-bold">Height</h3>
              {data.pokemon.height.minimum} - {data.pokemon.height.maximum}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PokemonDetailPage;
