import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20260504193517 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "license_key" ("id" text not null, "product_variant_id" text not null, "key_value" text null, "username" text null, "file_url" text null, "activation_url" text null, "notes" text null, "type" text check ("type" in ('key', 'key_with_user', 'file', 'url')) not null default 'key', "status" text check ("status" in ('available', 'assigned', 'revoked')) not null default 'available', "assigned_to_order_id" text null, "assigned_to_customer_id" text null, "assigned_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "license_key_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_license_key_deleted_at" ON "license_key" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "license_key" cascade;`);
  }

}
