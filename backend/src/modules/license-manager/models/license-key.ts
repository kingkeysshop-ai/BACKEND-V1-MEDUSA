import { model } from "@medusajs/framework/utils"

export const LicenseKey = model.define("license_key", {
  id: model.id().primaryKey(),
  product_variant_id: model.text(),
  key_value: model.text().nullable(),
  username: model.text().nullable(),
  file_url: model.text().nullable(),
  activation_url: model.text().nullable(),
  notes: model.text().nullable(),
  type: model.enum(["key", "key_with_user", "file", "url"]).default("key"),
  status: model.enum(["available", "assigned", "revoked"]).default("available"),
  assigned_to_order_id: model.text().nullable(),
  assigned_to_customer_id: model.text().nullable(),
  assigned_at: model.dateTime().nullable(),
})
