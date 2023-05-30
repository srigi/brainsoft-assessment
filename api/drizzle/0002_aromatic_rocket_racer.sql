ALTER TABLE "pokemons" ADD COLUMN "favourite" boolean;
CREATE INDEX IF NOT EXISTS "index_favourite" ON "pokemons" ("favourite");