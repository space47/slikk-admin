export interface departmentDatas {
    id: number
    name: string
    description: string
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface departmentTypes {
    departmentsData: departmentDatas[]
    loading: boolean
    message: string
    accessDenied: boolean
}
