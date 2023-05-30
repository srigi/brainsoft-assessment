import pokemonsData from "../data/pokemons.json";
process.env.MAX_DB_CONNECTIONS = "1";
import { db } from "../src/db";
import { pokemons, pokemonsToTypes, types } from "../src/models";

(async () => {
  let foundTypes = new Set<string>();

  // harvest all Pokemons' Types, and create insert values for Pokemons
  const pokemonsValues = pokemonsData.map((pd) => {
    foundTypes = new Set([...foundTypes, ...pd.types]);

    return {
      id: pd.id,
      name: pd.name,
      classification: pd.classification,
      fleeRate: pd.fleeRate,
      height: { minimum: pd.height.minimum, maximum: pd.height.maximum },
      weight: { minimum: pd.weight.minimum, maximum: pd.weight.maximum },
      maxCP: pd.maxCP,
      maxHP: pd.maxHP,
    };
  });

  // insert all Pokemons' Types
  const typesInsertUuids = (
    await db
      .insert(types)
      .values([...foundTypes].map((t) => ({ name: t })))
      .returning({ uuid: types.uuid })
  ).map((r) => r.uuid);

  // store Types UUIDs
  const pokemonTypesUuids = new Map<string, string>();
  [...foundTypes].forEach((t, idx) => {
    pokemonTypesUuids.set(t, typesInsertUuids[idx]);
  });

  // insert Pokemons
  const pokemonsUuids = (
    await db
      .insert(pokemons)
      .values(pokemonsValues)
      .returning({ uuid: pokemons.uuid })
  ).map((p) => p.uuid);

  // connect Pokemons and Pokemons' Types
  const pokemonToTypesValues = pokemonsData.reduce<
    Array<{ pokemonUuid: string; typeUuid: string }>
  >((memo, pd, idx) => {
    const pivotTableData = pd.types.map((pt) => {
      return {
        pokemonUuid: pokemonsUuids[idx],
        typeUuid: pokemonTypesUuids.get(pt)!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      };
    });

    return [...memo, ...pivotTableData];
  }, []);
  await db.insert(pokemonsToTypes).values(pokemonToTypesValues);

  process.exit(0);
})();
