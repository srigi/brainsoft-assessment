import pokemonsData from "../data/pokemons.json";
process.env.MAX_DB_CONNECTIONS = "1";
import { db } from "../src/db";
import { pokemons } from "../src/models";

(async () => {
  await db.insert(pokemons).values(
    pokemonsData.map((p) => {
      return {
        id: p.id,
        name: p.name,
        classification: p.classification,
        fleeRate: p.fleeRate,
        height: { minimum: p.height.minimum, maximum: p.height.maximum },
        weight: { minimum: p.weight.minimum, maximum: p.weight.maximum },
        maxCP: p.maxCP,
        maxHP: p.maxHP,
      };
    })
  );

  process.exit(0);
})();
