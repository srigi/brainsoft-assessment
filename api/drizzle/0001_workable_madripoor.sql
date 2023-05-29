CREATE TABLE IF NOT EXISTS "pokemonsToTypes" (
	"pokemon_id" uuid NOT NULL,
	"type_id" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "types" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);

CREATE INDEX IF NOT EXISTS "index_pokemon_id" ON "pokemonsToTypes" ("pokemon_id");
CREATE INDEX IF NOT EXISTS "index_type_id" ON "pokemonsToTypes" ("type_id");
CREATE UNIQUE INDEX IF NOT EXISTS "uqindex_name" ON "types" ("name");
DO $$ BEGIN
 ALTER TABLE "pokemonsToTypes" ADD CONSTRAINT "pokemonsToTypes_pokemon_id_pokemons_uuid_fk" FOREIGN KEY ("pokemon_id") REFERENCES "pokemons"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pokemonsToTypes" ADD CONSTRAINT "pokemonsToTypes_type_id_types_uuid_fk" FOREIGN KEY ("type_id") REFERENCES "types"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
