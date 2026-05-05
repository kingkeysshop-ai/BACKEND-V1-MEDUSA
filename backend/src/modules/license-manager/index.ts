// src/modules/license-manager/index.ts
import { ModuleDeclaration, ModuleService } from "@medusajs/types"

// Configuración vacía para evitar que Medusa lance un error de módulo faltante
export const MODULE_KEY = "licenseManager"

export default {
  // Si necesitas definir la clase del servicio, puedes hacerlo aquí,
  // pero a veces solo la existencia del archivo basta.
} as ModuleDeclaration