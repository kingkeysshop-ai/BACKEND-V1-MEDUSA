import { MedusaService, MedusaError } from "@medusajs/framework/utils"
import { LicenseKey } from "./models/license-key"

type AssignItem = {
  variantId: string
  qty: number
}

type LicenseType = "key" | "key_with_user" | "file" | "url"

export default class LicenseManagerService extends MedusaService({
  LicenseKey,
}) {
  async getAvailableKeys(variantId: string, qty: number) {
    const keys = await this.listLicenseKeys(
      {
        product_variant_id: variantId,
        status: "available",
      },
      {
        take: qty,
        order: { created_at: "ASC" },
      }
    )
    return keys
  }

  async assignKeys(
    orderId: string,
    customerId: string,
    items: AssignItem[]
  ) {
    const assigned: any[] = []
    const errors: string[] = []

    for (const item of items) {
      const available = await this.getAvailableKeys(item.variantId, item.qty)

      if (available.length < item.qty) {
        errors.push(
          `Stock insuficiente para variant ${item.variantId}: requerido ${item.qty}, disponible ${available.length}`
        )
        continue
      }

      for (const key of available) {
        const updated = await this.updateLicenseKeys({
          id: key.id,
          status: "assigned",
          assigned_to_order_id: orderId,
          assigned_to_customer_id: customerId,
          assigned_at: new Date(),
        })
        assigned.push(updated)
      }
    }

    if (errors.length > 0) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        errors.join("; ")
      )
    }

    return assigned
  }

  async getKeysByOrder(orderId: string) {
    return await this.listLicenseKeys({
      assigned_to_order_id: orderId,
    })
  }

  async getKeysByCustomer(customerId: string) {
    return await this.listLicenseKeys({
      assigned_to_customer_id: customerId,
    })
  }

  async importFromCSV(
    csvContent: string,
    variantId: string,
    defaultType: LicenseType = "key"
  ) {
    const lines = csvContent.trim().split("\n")
    if (lines.length < 2) {
      return { created: 0, errors: ["CSV vacío o solo tiene headers"] }
    }

    const headerLine: string = lines[0]
    const headers: string[] = headerLine.split(",").map((h: string) => h.trim())
    let created = 0
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      try {
        const line: string = lines[i]
        const values: string[] = line.split(",").map((v: string) => v.trim())
        const row: Record<string, string> = {}
        headers.forEach((h: string, idx: number) => {
          row[h] = values[idx] || ""
        })

        const data: any = {
          product_variant_id: variantId,
          type: defaultType,
          status: "available",
          key_value: row.key_value || null,
          username: row.username || null,
          file_url: row.file_url || null,
          activation_url: row.activation_url || null,
          notes: row.notes || null,
        }

        await this.createLicenseKeys(data)
        created++
      } catch (error: any) {
        errors.push(`Fila ${i + 1}: ${error?.message || "Error al importar"}`)
      }
    }

    return { created, errors }
  }
}
