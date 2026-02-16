ALTER TABLE "teams" ADD COLUMN "paystack_customer_id" text;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "paystack_subscription_code" text;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_paystack_customer_id_unique" UNIQUE("paystack_customer_id");--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_paystack_subscription_code_unique" UNIQUE("paystack_subscription_code");