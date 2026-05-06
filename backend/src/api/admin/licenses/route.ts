import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LICENSE_MANAGER_MODULE } from "../../../modules/license-manager"
import LicenseManagerService from "../../../modules/license-manager/service"

// ─────────────────────────────────────────────
// GET /admin/licenses
// Lista todas las licencias con filtros opcionales
// ─────────────────────────────────────────────

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const licenseService: LicenseManagerService =
    req.scope.resolve(LICENSE_MANAGER_MODULE)

  const { variant_id, status, limit = "50", offset = "0" } = req.query as {
    variant_id?: string
    status?: string
    limit?: string
    offset?: string
  }

  const filters: Record<string, unknown> = {}
  if (variant_id) filters.product_variant_id = variant_id
  if (status) filters.status = status

  const licenses = await licenseService.listLicenseKeys(filters, {
    take: parseInt(limit),
    skip: parseInt(offset),
    order: { created_at: "DESC" },
  })

  return res.json({
    licenses,
    count: licenses.length,
    limit: parseInt(limit),
    offset: parseInt(offset),
  })
}

// ─────────────────────────────────────────────
// POST /admin/licenses
// Carga una o varias licencias manualmente
// ─────────────────────────────────────────────

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const licenseService: LicenseManagerService =
    req.scope.resolve(LICENSE_MANAGER_MODULE)

  const body = req.body as {
    variant_id: string
    keys: string[]
    type?: "key" | "key_with_user" | "file" | "url"
  }

  if (!body.variant_id || !body.keys || body.keys.length === 0) {
    return res.status(400).json({
      error: "Se requiere variant_id y al menos una key",
    })
  }

  const created: unknown[] = []
  const errors: string[] = []

  for (const keyValue of body.keys) {
    try {
      const license = await licenseService.createLicenseKeys({
        product_variant_id: body.variant_id,
        key_value: keyValue,
        type: body.type ?? "key",
        status: "available",
      })
      created.push(license)
    } catch (error: any) {
      errors.push(`Error con key "${keyValue}": ${error?.message}`)
    }
  }

  return res.status(201).json({
    created: created.length,
    errors,
    licenses: created,
  })
}

// ─────────────────────────────────────────────
// DELETE /admin/licenses
// Elimina una licencia por ID
// ─────────────────────────────────────────────

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const licenseService: LicenseManagerService =
    req.scope.resolve(LICENSE_MANAGER_MODULE)

  const { id } = req.query as { id?: string }

  if (!id) {
    return res.status(400).json({ error: "Se requiere el parámetro id" })
  }

  await licenseService.deleteLicenseKeys(id)

  return res.json({ deleted: true, id })
}