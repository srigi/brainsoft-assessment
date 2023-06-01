import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";
import { gql, useQuery } from "urql";

import { NexusGenObjects } from "api/src/nexus";
import PokemonDetailCard from "../components/PokemonDetailCard";

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
        <PokemonDetailCard pokemon={data.pokemon} />
      )}
    </div>
  );
};

export default PokemonDetailPage;
