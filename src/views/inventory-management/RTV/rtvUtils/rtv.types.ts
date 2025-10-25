// import { IndentDetailsTypes } from '@/store/types/indent.types'

export type RtvHistoryData = {
    comments: string
    company: number
    create_date: string
    error_file: string
    failure: number
    id: number
    success: number
    upload_type: string
    uploaded_file: string
    user: {
        name: string
        email: string
        mobile: string
    }
}

export const DetailsData = (data: IndentDetailsTypes) => {
    const detailsArray = [
        { label: 'Id', value: data?.source_store?.id },
        { label: 'Code', value: data?.source_store?.code },
        { label: 'Name', value: data?.source_store?.name },
        { label: 'Fulfillment Center', value: data?.source_store?.is_fulfillment_center ? 'Yes' : 'No' },
        { label: 'Id', value: data?.target_store?.id },
        { label: 'Code', value: data?.target_store?.code },
        { label: 'Name', value: data?.target_store?.name },
        { label: 'Fulfillment Center', value: data?.target_store?.is_fulfillment_center ? 'Yes' : 'No' },
    ]

    return { detailsArray }
}
