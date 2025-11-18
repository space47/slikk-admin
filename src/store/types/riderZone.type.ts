export interface LiveZones {
    id: number
    name: string
    code: string
    geojson: {
        type: 'Polygon'
        coordinates: number[][][]
    }
    is_active: boolean
    created_at: string
    updated_at: string
    created_by: string
    updated_by: string
}

export interface LiveZoneResponseType {
    count: number
    results: LiveZones[]
}
