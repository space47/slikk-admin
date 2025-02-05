export interface ConfigInterface {
    id: number | string
    name: string
    is_active: boolean
    create_date: string
    update_date: string
    last_updated_by: string
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
