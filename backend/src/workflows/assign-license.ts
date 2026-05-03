import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { LICENSE_MANAGER_MODULE } from "../modules/license-manager"
import LicenseManagerService from "../modules/license-manager/service"

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────

type AssignLicenseInput = {
  order_id: string
  variant_id: string
  customer_id: string
  quantity: number
}

// ─────────────────────────────────────────────
// PASO 1: Verificar stock disponible
// ─────────────────────────────────────────────

const checkStockStep = createStep(
  "check-stock-step",
  async (input: AssignLicenseInput, context) => {
    const licenseService: LicenseManagerService =
      context.container.resolve(LICENSE_MANAGER_MODULE)

    const available = await licenseService.getAvailableKeys(
      input.variant_id,
      input.quantity
    )

    if (available.length < input.quantity) {
      throw new Error(
        `Stock insuficiente para variant ${input.variant_id}: requerido ${input.quantity}, disponible ${available.length}`
      )
    }

    return new StepResponse({ available_count: available.length })
  }
)

// ─────────────────────────────────────────────
// PASO 2: Asignar licencias
// ─────────────────────────────────────────────

const assignKeysStep = createStep(
  "assign-keys-step",
  async (input: AssignLicenseInput, context) => {
    const licenseService: LicenseManagerService =
      context.container.resolve(LICENSE_MANAGER_MODULE)

    const assigned = await licenseService.assignKeys(
      input.order_id,
      input.customer_id,
      [{ variantId: input.variant_id, qty: input.quantity }]
    )

    const keys = assigned.map((k: any) => k.key_value).filter(Boolean)

    return new StepResponse(
      { success: true, keys },
      { order_id: input.order_id }
    )
  }
)

// ─────────────────────────────────────────────
// PASO 3: Log (Fase 3 → envío de email)
// ─────────────────────────────────────────────

const logAssignmentStep = createStep(
  "log-assignment-step",
  async (
    input: { order_id: string; customer_id: string; keys: string[] },
    context
  ) => {
    const logger = context.container.resolve(
      ContainerRegistrationKeys.LOGGER
    )

    logger.info(
      `✅ Licencias asignadas | Orden: ${input.order_id} | Cliente: ${input.customer_id} | Keys: ${input.keys.join(", ")}`
    )

    return new StepResponse({ logged: true })
  }
)

// ─────────────────────────────────────────────
// WORKFLOW PRINCIPAL
// ─────────────────────────────────────────────

export const assignLicenseWorkflow = createWorkflow(
  "assign-license-workflow",
  function (input: AssignLicenseInput) {
    // Paso 1: Verificar que hay stock
    checkStockStep(input)

    // Paso 2: Asignar las licencias
    const assignResult = assignKeysStep(input)

    // Paso 3: Loguear
    logAssignmentStep({
      order_id: input.order_id,
      customer_id: input.customer_id,
      keys: assignResult.keys,
    })

    return new WorkflowResponse(assignResult)
  }
)