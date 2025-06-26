/* eslint-disable @typescript-eslint/no-explicit-any */
import { pageSettingsType } from '@/store/types/pageSettings.types'

export const TabsArray = [
    { label: 'Component Config', value: 'Component' },
    { label: 'Background config', value: 'bg_config' },
    { label: 'Other Config', value: 'other_config' },
    { label: 'Child Comp Config', value: 'child_comp_config' },
    { label: 'Extra Config', value: 'extra_config' },
    { label: 'Data Type Config', value: 'data_type_config' },
]

export interface FontSize {
    label: string
    value: string
}

export const CarouselTypeArray = [
    { label: 'NORMAL', value: 'NORMAL' },
    { label: 'PARALLAX', value: 'PARALLAX' },
    { label: 'STACK', value: 'STACK' },
]

export const BorderStyleArray = [
    { label: 'Dotted', value: 'dotted' },
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
]

export const FontSizeArray = [
    { label: 'Bold', value: 'bold' },
    { label: 'Regular', value: 'regular' },
    { label: 'Underline', value: 'underline' },
    { label: 'Italic', value: 'italic' },
]

export const SectionTypeArray = [
    { label: 'Generic', value: 'generic' },
    { label: 'Personalized', value: 'personalized' },
]

export const SECTIONARRAY = [
    { label: 'Flex Start', value: 'flex-start' },
    { label: 'Flex End', value: 'flex-end' },
    { label: 'Center', value: 'center' },
    { label: 'Space Between', value: 'space-between' },
    { label: 'Space Around', value: 'space-around' },
    { label: 'Space Evenly', value: 'space-evenly' },
]

export const NAMEPOSITION = [
    { label: 'Top', value: 'top' },
    { label: 'Bottom', value: 'bottom' },
]

export const ALIGNVALUES = [
    {
        label: 'Right',
        value: 'right',
    },
    {
        label: 'Center',
        value: 'center',
    },
    {
        label: 'Left',
        value: 'left',
    },
]

export const InitialValuesEdit = (data: pageSettingsType | undefined) => {
    return {
        section_heading: data?.section_heading ?? '',
        display_name: data?.display_name ?? '',
        is_active: data?.is_active ?? false,
        component_type: data?.component_type ?? '',
        data_type: data?.data_type ?? '',
        component_config: data?.component_config ?? {},
        background_config: data?.background_config ?? {},
        header_config: data?.header_config ?? {},
        sub_header_config: data?.sub_header_config ?? {},
        footer_config: data?.footer_config ?? {},
        extra_info: data?.extra_info ?? {},
        is_section_clickable: data?.is_section_clickable ?? false,
        last_updated_by: data?.last_updated_by ?? '',
        created_at: data?.created_at ?? '',
        updated_at: data?.updated_at ?? '',
    }
}

export const FormFieldsArray = [
    { label: 'Section Heading', name: 'section_heading', type: 'text' },
    { label: 'Display Name', name: 'display_name', type: 'text' },
    { label: 'Is Active', name: 'is_active', type: 'checkbox' },
    { label: 'Is Section Clickable', name: 'is_section_clickable', type: 'checkbox' },
]

export const useBgRemoveFunctions = (setInitialValue: any) => {
    const handleRemoveImage = (val: string) => {
        console.log('clicked')
        if (val === 'background_image') {
            setInitialValue((prev: any) => ({
                ...prev,
                background_image: null,
                background_config: {
                    ...prev.background_config,
                    background_image: null,
                },
            }))
        } else if (val === 'mobile_background_image') {
            setInitialValue((prev: any) => ({
                ...prev,
                mobile_background_image: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_image: null,
                },
            }))
        }
    }
    const handleRemoveVideo = (val: string) => {
        if (val === 'background_video') {
            setInitialValue((prev: any) => ({
                ...prev,
                background_video: null,
                background_config: {
                    ...prev.background_config,
                    background_video: null,
                },
            }))
        } else if (val === 'mobile_background_video') {
            setInitialValue((prev: any) => ({
                ...prev,
                mobile_background_video: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_video: null,
                },
            }))
        } else if (val === 'background_lottie') {
            setInitialValue((prev: any) => ({
                ...prev,
                background_lottie: null,
                background_config: {
                    ...prev.background_config,
                    background_lottie: null,
                },
            }))
        } else if (val === 'mobile_background_lottie') {
            setInitialValue((prev: any) => ({
                ...prev,
                mobile_background_lottie: null,
                background_config: {
                    ...prev.background_config,
                    mobile_background_lottie: null,
                },
            }))
        }
    }

    return { handleRemoveImage, handleRemoveVideo }
}
