CREATE TABLE "processed_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"batch_id" text NOT NULL,
	"file_name" text NOT NULL,
	"row_data" jsonb NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "processed_data" ADD CONSTRAINT "processed_data_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;