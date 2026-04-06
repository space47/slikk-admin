/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react'
import { Button, FormItem, Input, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, Form, Formik } from 'formik'
import CommonImageUpload from '@/common/CommonImageUpload'
import { beforeUpload } from '@/common/beforeUpload'
import { useNavigate, useParams } from 'react-router-dom'
import debounce from 'lodash/debounce'
import { generatePreviewCanvas, TemplateConfig } from '../../catalog/generatePreviewCanvas'
import { FrameFields } from '../../catalog/frameCommon'
import { FrameSingleTemplate } from '@/store/types/frameTemplateType'
import { frameService } from '@/store/services/frameTemplatesService'

const hexToRgbTuple = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
}

// Helper function to convert RGB tuple to hex color string
const rgbTupleToHex = (rgb: number[]): string => {
    if (!rgb || rgb.length < 3) return '#000000'
    return (
        '#' +
        rgb
            .slice(0, 3)
            .map((x) => {
                const hex = x.toString(16)
                return hex.length === 1 ? '0' + hex : hex
            })
            .join('')
    )
}

interface AutoPreviewProps {
    values: TemplateConfig
    setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>
    setIsLoading: (x: boolean) => void
}

const AutoPreviewRenderer = ({ values, setPreviewImage, setIsLoading }: AutoPreviewProps) => {
    const debouncedRenderPreview = useMemo(
        () =>
            debounce(async (vals) => {
                if (vals.image_1?.length && vals.image_2?.length) {
                    setIsLoading(true)
                    try {
                        const dataUrl = await generatePreviewCanvas(vals)
                        setPreviewImage(dataUrl)
                    } catch (e) {
                        console.log('Debounced preview error', e)
                    } finally {
                        setIsLoading(false)
                    }
                } else {
                    setPreviewImage(null)
                }
            }, 500),
        [setPreviewImage, setIsLoading],
    )

    useEffect(() => {
        debouncedRenderPreview(values)

        return () => {
            debouncedRenderPreview.cancel()
        }
    }, [values, debouncedRenderPreview])

    return null
}

const FrameEdit = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [frame, setFrame] = useState<FrameSingleTemplate>()

    const frameSingleCall = frameService.useFrameSingleDataQuery({ id: id }, { skip: !id })

    useEffect(() => {
        if (frameSingleCall.isSuccess && frameSingleCall.data) {
            setFrame(frameSingleCall.data)
        }
    }, [frameSingleCall.isSuccess, frameSingleCall.data])

    // Transform API response to TemplateConfig format
    const transformApiDataToTemplateConfig = (apiData: any): TemplateConfig => {
        return {
            template_name: apiData.name || '',
            description: apiData.description || '',
            image_1: [], // Images need to be handled separately - you might need to fetch these from URLs
            image_2: [], // Images need to be handled separately
            safe_zone_left: parseFloat(apiData.safe_zone_left) || 0,
            safe_zone_right: parseFloat(apiData.safe_zone_right) || 0,
            safe_zone_top: parseFloat(apiData.safe_zone_top) || 0,
            safe_zone_bottom: parseFloat(apiData.safe_zone_bottom) || 0,
            sp_x: parseFloat(apiData.sp_x) || 0,
            sp_y: parseFloat(apiData.sp_y) || 0,
            sp_font_size: parseFloat(apiData.sp_font_size) || 24,
            sp_color: rgbTupleToHex(apiData.sp_color),
            sp_thickness: parseFloat(apiData.sp_thickness) || 1,
            mrp_x: parseFloat(apiData.mrp_x) || 0,
            mrp_y: parseFloat(apiData.mrp_y) || 0,
            mrp_font_size: parseFloat(apiData.mrp_font_size) || 24,
            mrp_color: rgbTupleToHex(apiData.mrp_color),
            mrp_thickness: parseFloat(apiData.mrp_thickness) || 1,
            slash_orientation: apiData.slash_orientation || 'diagonal',
            slash_thickness: parseFloat(apiData.slash_thickness) || 1,
            slash_color: rgbTupleToHex(apiData.slash_color),
            slash_length_scale: parseFloat(apiData.slash_length_scale) || 1,
            slash_x: parseFloat(apiData.slash_x) || 0,
            slash_y: parseFloat(apiData.slash_y) || 0,
            is_price_tag_required: true, // You might want to add this field to your API response
            selling_price: '99', // These might need to come from the API as well
            mrp_price: '149',
        }
    }

    // Create initial values based on whether we're editing or creating
    const getInitialValues = (): TemplateConfig => {
        if (id && frame) {
            return transformApiDataToTemplateConfig(frame)
        }

        // Default values for new template
        return {
            template_name: '',
            description: '',
            image_1: [],
            image_2: [],
            safe_zone_left: 0,
            safe_zone_right: 0,
            safe_zone_top: 0,
            safe_zone_bottom: 0,
            sp_x: 0,
            sp_y: 0,
            sp_font_size: 24,
            sp_color: '#000000',
            sp_thickness: 1,
            mrp_x: 0,
            mrp_y: 0,
            mrp_font_size: 24,
            mrp_color: '#000000',
            mrp_thickness: 1,
            slash_orientation: 'diagonal',
            slash_thickness: 1,
            slash_color: '#ff0000',
            slash_length_scale: 1,
            slash_x: 0,
            slash_y: 0,
            is_price_tag_required: true,
            selling_price: '99',
            mrp_price: '149',
        }
    }

    const handleSaveConfig = async (values: TemplateConfig) => {
        if (!values.template_name?.trim()) {
            notification.warning({
                message: 'Validation Error',
                description: 'Please provide a Template Name before saving.',
            })
            return
        }

        notification.info({
            message: id ? 'Updating Template' : 'Saving Template',
            description: id ? 'Updating your template parameters...' : 'Saving your template parameters...',
        })

        const payload = {
            name: values.template_name,
            description: values.description || '',
            safe_zone_left: Number(values.safe_zone_left),
            safe_zone_right: Number(values.safe_zone_right),
            safe_zone_top: Number(values.safe_zone_top),
            safe_zone_bottom: Number(values.safe_zone_bottom),
            sp_x: Number(values.sp_x),
            sp_y: Number(values.sp_y),
            sp_font_size: Number(values.sp_font_size),
            sp_color: hexToRgbTuple(values.sp_color),
            sp_thickness: Number(values.sp_thickness),
            mrp_x: Number(values.mrp_x),
            mrp_y: Number(values.mrp_y),
            mrp_font_size: Number(values.mrp_font_size),
            mrp_color: hexToRgbTuple(values.mrp_color),
            mrp_thickness: Number(values.mrp_thickness),
            slash_orientation: values.slash_orientation,
            slash_thickness: Number(values.slash_thickness),
            slash_color: hexToRgbTuple(values.slash_color),
            slash_length_scale: Number(values.slash_length_scale),
            slash_x: Number(values.slash_x),
            slash_y: Number(values.slash_y),
        }

        try {
            let res
            if (id) {
                // Update existing template
                res = await axioisInstance.put(`/frame-style-templates/${id}`, payload)
                notification.success({
                    message: 'Success',
                    description: res?.data?.message || 'Template configuration updated successfully.',
                })
            } else {
                // Create new template
                res = await axioisInstance.post('/frame-style-templates', payload)
                notification.success({
                    message: 'Success',
                    description: res?.data?.message || 'Template configuration saved successfully.',
                })
            }

            // Navigate back to products after successful save/update
            setTimeout(() => {
                navigate('/app/catalog/products')
            }, 1500)
        } catch (error) {
            console.log('error saving config', error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: id ? 'Update Failed' : 'Save Failed',
                    description: error?.response?.data?.message || `Failed to ${id ? 'update' : 'save'} configuration.`,
                })
            }
        }
    }

    // Show loading state while fetching data for edit
    if (id && frameSingleCall.isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center gap-4">
                    <Spinner size={48} />
                    <p className="text-gray-600">Loading template data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-full p-4 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">
                    {id ? 'Edit Frame Template Configuration' : 'Global Frame Template Configuration'}
                </h2>
                <Button onClick={() => navigate('/app/catalog/products')} variant="default" className="shadow-sm">
                    Back to Products
                </Button>
            </div>

            <Formik enableReinitialize initialValues={getInitialValues()} onSubmit={handleSaveConfig}>
                {({ values, submitForm }) => (
                    <Form className="flex flex-col xl:flex-row gap-8">
                        <AutoPreviewRenderer values={values} setPreviewImage={setPreviewImage} setIsLoading={setIsLoading} />
                        {/* LEFT COLUMN: Config */}
                        <div className="w-full xl:w-5/12 space-y-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                            {/* Template Name + Description */}
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                                <FormItem
                                    label={
                                        <span>
                                            Template Name <span className="text-red-500">*</span>
                                        </span>
                                    }
                                    className="mb-0"
                                >
                                    <Field name="template_name" type="text" placeholder="e.g. Big Billion Days" as={Input} />
                                </FormItem>
                                <FormItem label="Description" className="mb-0">
                                    <Field name="description" type="text" placeholder="Optional description" as={Input} />
                                </FormItem>
                            </div>

                            {/* Images */}
                            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                <h3 className="font-semibold text-blue-900 border-b border-blue-200 pb-2 mb-4">Required Images</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    <CommonImageUpload
                                        label="Frame"
                                        beforeUpload={beforeUpload}
                                        fileList={values?.image_1 as File[]}
                                        fieldNames="image_1"
                                        name="image_1"
                                    />
                                    <CommonImageUpload
                                        label="Product"
                                        beforeUpload={beforeUpload}
                                        fileList={values?.image_2 as File[]}
                                        fieldNames="image_2"
                                        name="image_2"
                                    />
                                </div>
                            </div>

                            {/* Safe Zone */}
                            {FrameFields.map((section) => (
                                <div key={section.title} className={section.wrapperClass || ''}>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-3 tracking-wide uppercase">{section.title}</h3>

                                    <div className={`grid ${section.grid} gap-3`}>
                                        {section.fields.map((field: any) => (
                                            <FormItem key={field.name} label={field.label}>
                                                {field.type === 'select' ? (
                                                    <Field
                                                        name={field.name}
                                                        as="select"
                                                        className="w-full border border-gray-300 rounded px-2 py-2"
                                                    >
                                                        {field.options?.map((opt: any) => (
                                                            <option key={opt.value} value={opt.value}>
                                                                {opt.label}
                                                            </option>
                                                        ))}
                                                    </Field>
                                                ) : field.type === 'checkbox' ? (
                                                    <Field name={field.name} type="checkbox" className="mt-2 w-5 h-5 cursor-pointer" />
                                                ) : (
                                                    <Field
                                                        name={field.name}
                                                        type={field.type}
                                                        min={field.min}
                                                        max={field.max}
                                                        step="any"
                                                        as={Input}
                                                        className={field.type === 'color' ? 'w-full h-10 p-1 cursor-pointer' : ''}
                                                    />
                                                )}
                                            </FormItem>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="w-full xl:w-7/12 flex flex-col gap-4">
                            <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex-1 flex flex-col items-center">
                                <div className="w-full flex justify-between items-center mb-4">
                                    <h3 className="font-semibold text-gray-700">Realtime UI Render</h3>
                                </div>
                                <div className="w-full flex-1 flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden relative min-h-[500px]">
                                    {isLoading ? (
                                        <div className="flex flex-col items-center text-gray-400">
                                            <Spinner size={40} className="mb-3" />
                                            <p>Processing browser canvas...</p>
                                        </div>
                                    ) : previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Generated Template"
                                            className="max-w-[90%] max-h-[700px] shadow-lg rounded object-contain border border-gray-200"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400 p-10 text-center max-w-sm">
                                            <h4 className="text-lg font-medium text-gray-600 mb-2">Awaiting Render</h4>
                                            <p className="text-sm">
                                                Ensure you have uploaded both the Frame and the Product image to compile a preview layout.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="solid"
                                className="w-full py-4 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl rounded-xl transition-all"
                                onClick={submitForm}
                            >
                                {id ? 'Update Template' : 'Save Template'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default FrameEdit
