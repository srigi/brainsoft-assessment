ALTER TABLE "pokemons" ADD COLUMN "favourite" boolean;
CREATE UNIQUE INDEX IF NOT EXISTS "index_favourite" ON "pokemons" ("favourite");