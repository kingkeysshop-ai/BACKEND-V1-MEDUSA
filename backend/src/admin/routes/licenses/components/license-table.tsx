import { useState, useEffect } from "react"
import { Table, Badge, Button, Container, Text } from "@medusajs/ui"
import axios from "axios"

type License = {
  id: string
  product_variant_id: string
  key_value: string | null
  username: string | null
  status: "available" | "assigned" | "revoked"
  assigned_to_order_id: string | null
  assigned_to_customer_id: string | null
  assigned_at: string | null
  created_at: string
}

export const LicenseTable = () => {
  const [licenses, setLicenses] = useState<License[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [variantFilter, setVariantFilter] = useState("")

  const fetchLicenses = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("medusa_token")
      const params = variantFilter ? { variant_id: variantFilter } : {}

      const res = await axios.get(
        `${window.location.origin}/admin/licenses`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      )

      setLicenses(res.data.licenses || [])
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al cargar licencias")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLicenses()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta licencia?")) return

    try {
      const token = localStorage.getItem("medusa_token")
      await axios.delete(
        `${window.location.origin}/admin/licenses?id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setLicenses((prev) => prev.filter((l) => l.id !== id))
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error al eliminar")
    }
  }

  const getStatusColor = (
    status: string
  ): "green" | "blue" | "red" | "grey" => {
    switch (status) {
      case "available":
        return "green"
      case "assigned":
        return "blue"
      case "revoked":
        return "red"
      default:
        return "grey"
    }
  }

  if (loading) {
    return <Text className="text-ui-fg-subtle">Cargando...</Text>
  }

  if (error) {
    return <Text className="text-red-500">{error}</Text>
  }

  return (
    <Container className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="Filtrar por variant_id"
          value={variantFilter}
          onChange={(e) => setVariantFilter(e.target.value)}
          className="border border-ui-border-base rounded-md px-3 py-2 text-sm"
        />
        <Button variant="secondary" onClick={fetchLicenses} size="small">
          Actualizar
        </Button>
      </div>

      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Estado</Table.HeaderCell>
            <Table.HeaderCell>Variant ID</Table.HeaderCell>
            <Table.HeaderCell>License Key</Table.HeaderCell>
            <Table.HeaderCell>Cliente</Table.HeaderCell>
            <Table.HeaderCell>Orden</Table.HeaderCell>
            <Table.HeaderCell>Acciones</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {licenses.length === 0 ? (
            <Table.Row>
              <Table.Cell className="text-center">
                <Text className="text-ui-fg-subtle">
                  No hay licencias cargadas
                </Text>
              </Table.Cell>
            </Table.Row>
          ) : (
            licenses.map((license) => (
              <Table.Row key={license.id}>
                <Table.Cell>
                  <Badge color={getStatusColor(license.status)}>
                    {license.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{license.product_variant_id}</Table.Cell>
                <Table.Cell>
                  <span className="font-mono text-xs">
                    {license.key_value || "N/A"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  {license.assigned_to_customer_id || "-"}
                </Table.Cell>
                <Table.Cell>
                  {license.assigned_to_order_id || "-"}
                </Table.Cell>
                <Table.Cell>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDelete(license.id)}
                  >
                    Eliminar
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </Container>
  )
}