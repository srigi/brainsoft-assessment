CREATE TABLE IF NOT EXISTS "pokemonsToTypes" (
	"pokemon_uuid" uuid NOT NULL,
	"type_uuid" uuid NOT NULL
);

CREATE TABLE IF NOT EXISTS "types" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL
);

CREATE INDEX IF NOT EXISTS "index_pokemon_id" ON "pokemonsToTypes" ("pokemon_uuid");
CREATE INDEX IF NOT EXISTS "index_type_id" ON "pokemonsToTypes" ("type_uuid");
CREATE UNIQUE INDEX IF NOT EXISTS "uqindex_name" ON "types" ("name");
DO $$ BEGIN
 ALTER TABLE "pokemonsToTypes" ADD CONSTRAINT "pokemonsToTypes_pokemon_uuid_pokemons_uuid_fk" FOREIGN KEY ("pokemon_uuid") REFERENCES "pokemons"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "pokemonsToTypes" ADD CONSTRAINT "pokemonsToTypes_type_uuid_types_uuid_fk" FOREIGN KEY ("type_uuid") REFERENCES "types"("uuid") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
