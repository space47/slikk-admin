export interface ConfigInterface {
    id: number | string
    name: string
    is_active: boolean
    create_date: string
    update_date: string
    last_updated_by: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
}

export const EDITFIELDSARRAY = [
    {
        label: 'Name',
        name: 'name',
        type: 'text',
        placeholder: 'Enter Name',
    },
    // {
    //     label: 'Last Updated By',
    //     name: 'last_updated_by',
    //     type: 'text',
    //     placeholder: 'Enter Last Updated By',
    // },
    // {
    //     label: 'Is Active',
    //     name: 'is_active',
    //     type: 'checkbox',
    //     placeholder: 'Enter Name',
    // },
]

export type FieldType = 'string' | 'array' | 'object'
export type FieldValue = string | number | boolean | Array<any> | Record<string, any>

export interface RenderFieldsProps {
    obj: FieldValue
    parentKey: string
    setFieldValue: (field: string, value: any) => void
    editableKeys: Record<string, string>
    setEditableKeys: (keys: Record<string, string>) => void
    filters: {
        filters: Array<{ value: string; label: string }>
    }
}

export interface DraggableFieldProps {
    items: any[]
    type: 'object' | 'array'
    parentKey: string
    onDragEnd: (result: DropResult) => void
    onAddField: (type?: FieldType) => void
    isAddModalOpen: boolean
    setIsAddModalOpen: (isOpen: boolean) => void
}
