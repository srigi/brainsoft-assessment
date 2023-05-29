CREATE TABLE IF NOT EXISTS "pokemons" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"classification" varchar NOT NULL,
	"weight" jsonb NOT NULL,
	"height" jsonb NOT NULL,
	"flee_rate" real NOT NULL,
	"max_cp" integer NOT NULL,
	"max_hp" integer NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "uqindex_id" ON "pokemons" ("id");