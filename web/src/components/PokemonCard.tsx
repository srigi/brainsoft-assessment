import { FunctionComponent } from "react";
import { Link } from "react-router-dom";
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
    }
  }
`;

const PokemonCard: FunctionComponent<Props> = ({ pokemon }) => {
  const [, favorite] = useMutation(pokemonFavoriteMutation);

  return (
    <div className="border border-emerald-500 flex flex-col">
      <Link
        to={`pokemon/${pokemon.id}`}
        className="bg-white flex flex-col flex-1 justify-center p-4"
      >
        <img
          src={`https://img.pokemondb.net/artwork/${pokemon.name
            .toLowerCase()
            .replace(/[&\\/#,+()$~%.'":*?<>{}]/g, "")
            .replace(" ", "-")}.jpg`}
          alt={`Avatar image of ${pokemon.name} pokémon`}
        />
      </Link>
      <div className="h-[74px] relative">
        <button
          className="absolute top-6 right-2 text-amber-600 z-10"
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
        <Link
          to={`pokemon/${pokemon.id}`}
          className="absolute inset-x-0 inset-y-0 p-3"
        >
          <h4 className="font-bold text-xl">{pokemon.name}</h4>
          <span>{pokemon.types.join(", ")}</span>
        </Link>
      </div>
    </div>
  );
};

export default PokemonCard;
