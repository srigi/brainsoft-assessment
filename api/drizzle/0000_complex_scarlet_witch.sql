CREATE TABLE IF NOT EXISTS "pokemons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"classification" varchar NOT NULL,
	"weight" jsonb DEFAULT '{ "minimum":"1.0kg", "maximum": "2.0kg" }'::jsonb NOT NULL,
	"height" jsonb DEFAULT '{ "minimum":"0.15m", "maximum": "0.25m" }'::jsonb NOT NULL,
	"flee_rate" real NOT NULL,
	"max_cp" integer NOT NULL,
	"max_hp" integer NOT NULL
);
