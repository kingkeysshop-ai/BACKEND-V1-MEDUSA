import { Module } from "@medusajs/framework/utils"
import LicenseManagerService from "./service"

export const LICENSE_MANAGER_MODULE = "license_manager"

export default Module(LICENSE_MANAGER_MODULE, {
  service: LicenseManagerService,
})