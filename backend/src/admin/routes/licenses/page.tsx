import { defineRouteConfig } from "@medusajs/admin-sdk"
import { KeySquare } from "lucide-react"
import { useState } from "react"
import { LicenseTable } from "./components/license-table"
import { UploadForm } from "./components/upload-form"

const LicensesPage = () => {
  const [activeTab, setActiveTab] = useState<"list" | "upload">("list")
  const [refresh, setRefresh] = useState(0)

  const handleUploaded = () => {
    setRefresh((r) => r + 1)
    setActiveTab("list")
  }

  return (
    <div className="flex flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ui-fg-base">
            🔑 Licencias Digitales
          </h1>
          <p className="text-ui-fg-subtle text-sm mt-1">
            Gestioná el stock de licencias para tus productos
          </p>
        </div>
      </div>

      <div className="flex gap-2 border-b border-ui-border-base">
        <button
          onClick={() => setActiveTab("list")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "list"
              ? "border-ui-fg-base text-ui-fg-base"
              : "border-transparent text-ui-fg-subtle hover:text-ui-fg-base"
          }`}
        >
          📋 Listado
        </button>
        <button
          onClick={() => setActiveTab("upload")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "upload"
              ? "border-ui-fg-base text-ui-fg-base"
              : "border-transparent text-ui-fg-subtle hover:text-ui-fg-base"
          }`}
        >
          ⬆️ Importar CSV
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "list" && <LicenseTable key={refresh} />}
        {activeTab === "upload" && <UploadForm onSuccess={handleUploaded} />}
      </div>
    </div>
  )
}

export const config = defineRouteConfig({
  label: "Licencias",
  icon: KeySquare,
})

export default LicensesPage