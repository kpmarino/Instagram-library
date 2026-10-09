CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
CREATE TABLE "archived_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"bucket" text NOT NULL,
	"object_key" text NOT NULL,
	"original_url" text,
	"role" text NOT NULL,
	"mime_type" text NOT NULL,
	"byte_size" bigint NOT NULL,
	"sha256" text NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "assets_size_nonnegative" CHECK ("archived_assets"."byte_size" >= 0),
	CONSTRAINT "assets_sha256_valid" CHECK ("archived_assets"."sha256" ~ '^[a-f0-9]{64}$')
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collections_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "item_collections" (
	"item_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL,
	CONSTRAINT "item_collections_item_id_collection_id_pk" PRIMARY KEY("item_id","collection_id")
);
--> statement-breakpoint
CREATE TABLE "item_metadata" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"item_id" uuid NOT NULL,
	"key" text NOT NULL,
	"value" jsonb NOT NULL,
	"provenance" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "metadata_provenance_valid" CHECK ("item_metadata"."provenance" IN ('user','imported','instagram','ai'))
);
--> statement-breakpoint
CREATE TABLE "item_tags" (
	"item_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "item_tags_item_id_tag_id_pk" PRIMARY KEY("item_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "saved_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"original_url" text NOT NULL,
	"canonical_url" text NOT NULL,
	"source" text NOT NULL,
	"source_id" text,
	"title" text,
	"notes" text,
	"content_type" text,
	"creator" text,
	"caption" text,
	"source_metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"archive_status" text DEFAULT 'pending' NOT NULL,
	CONSTRAINT "items_archive_status_valid" CHECK ("saved_items"."archive_status" IN ('pending','fetching','archived','partial','unavailable','failed'))
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "archived_assets" ADD CONSTRAINT "archived_assets_item_id_saved_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."saved_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_collections" ADD CONSTRAINT "item_collections_item_id_saved_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."saved_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_collections" ADD CONSTRAINT "item_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_metadata" ADD CONSTRAINT "item_metadata_item_id_saved_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."saved_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_item_id_saved_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."saved_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "item_tags" ADD CONSTRAINT "item_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assets_object_unique" ON "archived_assets" USING btree ("bucket","object_key");--> statement-breakpoint
CREATE UNIQUE INDEX "items_canonical_url_unique" ON "saved_items" USING btree ("canonical_url");