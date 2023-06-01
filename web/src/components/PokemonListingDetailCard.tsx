import { FunctionComponent } from "react";
import { gql, useMutation } from "urql";

import { NexusGenArgTypes, NexusGenObjects } from "api/src/nexus";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as HeartFilledIcon } from "../assets/heart-filled.svg";
import clsx from "clsx";
import { MAX_CP, MAX_HP } from "../constants";
import { Link } from "react-router-dom";

interface Props {
  pokemon: NexusGenObjects["Pokemon"];
}

const pokemonFavoriteMutation = gql<
  {
    pokemons: {
      edges: Array<NexusGenObjects["Pokemon"]>;
      pageInfo: NexusGenObjects["PokemonListPageInfo"];
    };
  },
  NexusGenArgTypes["Query"]["pokemons"]
>`
  mutation Favourite($id: String!, $value: Boolean!) {
    setFavourite(id: $id, value: $value) {
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

const PokemonListingDetailCard: FunctionComponent<Props> = ({ pokemon }) => {
  const [, favorite] = useMutation(pokemonFavoriteMutation);

  return (
    <div className="border border-emerald-500 flex">
      <Link
        className="bg-white border-r border-r-gray-300 flex flex-col justify-center p-4"
        to={`pokemon/${pokemon.id}`}
      >
        <img
          className="w-32"
          src={`https://img.pokemondb.net/artwork/${pokemon.name
            .toLowerCase()
            .replace(/[&\\/#,+()$~%.'":*?<>{}]/g, "")
            .replace(" ", "-")}.jpg`}
          alt={`Avatar image of ${pokemon.name} pokémon`}
        />
      </Link>
      <div className="flex-1">
        <div className="border-b border-b-gray-300 flex p-4">
          <div className="border-r border-r-gray-300 flex-1">
            <h1 className="font-bold text-xl">
              <Link to={`pokemon/${pokemon.id}`}>{pokemon.name}</Link>
            </h1>
            <span>{pokemon.types.join(", ")}</span>
          </div>

          <div className="border-r border-r-gray-300 flex-1 flex flex-col items-center">
            <h3 className="font-bold">Weight</h3>
            {pokemon.weight.minimum} - {pokemon.weight.maximum}
          </div>

          <div className="flex-1 flex flex-col items-center">
            <h3 className="font-bold">Height</h3>
            {pokemon.height.minimum} - {pokemon.height.maximum}
          </div>

          <button
            className="text-amber-600"
            onClick={(ev) => {
              ev.preventDefault();
              favorite({ id: pokemon.id, value: !pokemon.favourite });
            }}
          >
            {pokemon.favourite === true ? (
              <HeartFilledIcon className="h-7 w-7" />
            ) : (
              <HeartIcon className="h-7 w-7" />
            )}
          </button>
        </div>

        <div className="flex flex-col p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div
                className="bg-sky-400 h-2 rounded-full"
                style={{
                  width: `${Math.round((pokemon.maxCP / MAX_CP) * 100)}%`,
                }}
              />
            </div>
            <div className="font-bold">CP: {pokemon.maxCP}</div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div
                className="bg-emerald-400 h-2 rounded-full"
                style={{
                  width: `${Math.round((pokemon.maxHP / MAX_HP) * 100)}%`,
                }}
              />
            </div>
            <div className="font-bold">HP: {pokemon.maxHP}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonListingDetailCard;
