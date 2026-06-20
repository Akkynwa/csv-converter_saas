CREATE TABLE "license_keys" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"team_id" integer,
	"plan_type" varchar(20) DEFAULT 'lifetime_pro',
	"is_redeemed" boolean DEFAULT false NOT NULL,
	"redeemed_at" timestamp,
	"activated_by" integer,
	CONSTRAINT "license_keys_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "license_keys" ADD CONSTRAINT "license_keys_activated_by_users_id_fk" FOREIGN KEY ("activated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;