export type ReportQueryData = {
    id: number
    name: string
    value: string
    required_fields: Record<string, unknown>
    create_date: string
    update_date: string
    last_updated_by: string | null
}
