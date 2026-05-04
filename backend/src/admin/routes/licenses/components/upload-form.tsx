import { useState } from "react"
import { Button, Container, Text, Label, Input } from "@medusajs/ui"
import axios from "axios"

export const UploadForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [variantId, setVariantId] = useState("")
  const [csvContent, setCsvContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvContent(text)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!variantId.trim()) {
      setMessage({ type: "error", text: "Variant ID es requerido" })
      return
    }

    if (!csvContent.trim()) {
      setMessage({ type: "error", text: "Selecciona un archivo CSV" })
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem("medusa_token")

      const res = await axios.post(
        `${window.location.origin}/admin/licenses`,
        {
          product_variant_id: variantId.trim(),
          csv_content: csvContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      setMessage({
        type: "success",
        text: `✅ ${res.data.count || 0} licencias importadas correctamente`,
      })

      setVariantId("")
      setCsvContent("")

      if (onSuccess) {
        onSuccess()
      }
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err?.response?.data?.message || "Error al importar licencias",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="flex flex-col gap-4 p-6">
      <div>
        <Text size="large" weight="plus">
          Importar Licencias (CSV)
        </Text>
        <Text size="small" className="text-ui-fg-subtle">
          Formato CSV: una columna "key_value" o dos columnas "username,key_value"
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="variant_id">Product Variant ID</Label>
          <Input
            id="variant_id"
            type="text"
            placeholder="variant_01H..."
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="csv_file">Archivo CSV</Label>
          <input
            id="csv_file"
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            disabled={loading}
            className="border border-ui-border-base rounded-md px-3 py-2 text-sm"
          />
        </div>

        {csvContent && (
          <div className="bg-ui-bg-subtle p-3 rounded-md">
            <Text size="small" className="text-ui-fg-subtle">
              Preview (primeras líneas):
            </Text>
            <pre className="text-xs mt-2 overflow-auto max-h-32">
              {csvContent.split("\n").slice(0, 5).join("\n")}
            </pre>
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            <Text size="small">{message.text}</Text>
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          disabled={loading}
          isLoading={loading}
        >
          {loading ? "Importando..." : "Importar Licencias"}
        </Button>
      </form>
    </Container>
  )
}