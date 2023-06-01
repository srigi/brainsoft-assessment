import { FunctionComponent } from "react";
import { gql, useMutation } from "urql";

import { NexusGenArgTypes, NexusGenObjects } from "api/src/nexus";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as HeartFilledIcon } from "../assets/heart-filled.svg";

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

const PokemonDetailCard: FunctionComponent<Props> = ({ pokemon }) => {
  const [, favorite] = useMutation(pokemonFavoriteMutation);

  return (
    <div className="border border-emerald-500 flex flex-col mx-40">
      <div className="bg-white flex flex-col flex-1 justify-center p-4">
        <img
          src={`https://img.pokemondb.net/artwork/${pokemon.name
            .toLowerCase()
            .replace(/[&\\/#,+()$~%.'":*?<>{}]/g, "")
            .replace(" ", "-")}.jpg`}
          alt={`Avatar image of ${pokemon.name} pokémon`}
        />
      </div>

      <div className="flex justify-between p-4">
        <div>
          <h1 className="font-bold text-xl">{pokemon.name}</h1>
          <span>{pokemon.types.join(", ")}</span>
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

      <div className="border-b border-b-gray-300 flex flex-col p-4">
        <div className="flex gap-4 items-center">
          <div className="bg-sky-400 flex-1 h-2 rounded-full" />
          <div className="font-bold">CP: {pokemon.maxCP}</div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-emerald-400 flex-1 h-2 rounded-full" />
          <div className="font-bold">HP: {pokemon.maxHP}</div>
        </div>
      </div>

      <div className="flex">
        <div className="border-r border-r-gray-300 flex-1 flex flex-col items-center py-4">
          <h3 className="font-bold">Weight</h3>
          {pokemon.weight.minimum} - {pokemon.weight.maximum}
        </div>
        <div className="flex-1 flex flex-col items-center py-4">
          <h3 className="font-bold">Height</h3>
          {pokemon.height.minimum} - {pokemon.height.maximum}
        </div>
      </div>
    </div>
  );
};

export default PokemonDetailCard;
