/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react'
import { Button, FormItem, Input, Spinner } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, Form, Formik } from 'formik'
import CommonImageUpload from '@/common/CommonImageUpload'
import { beforeUpload } from '@/common/beforeUpload'
import { generatePreviewCanvas, TemplateConfig } from './generatePreviewCanvas'
import { useNavigate } from 'react-router-dom'
import debounce from 'lodash/debounce'
import { FrameFields } from './frameCommon'

const hexToRgbTuple = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
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

const FrameTemplatePage = () => {
    const navigate = useNavigate()
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const initialValues: TemplateConfig = {
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

    const handleSaveConfig = async (values: TemplateConfig) => {
        if (!values.template_name?.trim()) {
            notification.warning({
                message: 'Validation Error',
                description: 'Please provide a Template Name before saving.',
            })
            return
        }

        notification.info({
            message: 'Saving Template',
            description: 'Saving your template parameters...',
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
            const res = await axioisInstance.post('/frame-style-templates', payload)

            notification.success({
                message: 'Success',
                description: res?.data?.message || 'Template configuration saved successfully.',
            })
        } catch (error) {
            console.log('error saving config', error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: 'Save Failed',
                    description: error?.response?.data?.message || 'Failed to save configuration.',
                })
            }
        }
    }

    return (
        <div className="w-full h-full p-4 lg:p-8 bg-gray-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-gray-800">Global Frame Template Configuration</h2>
                <Button onClick={() => navigate('/app/catalog/products')} variant="default" className="shadow-sm">
                    Back to Products
                </Button>
            </div>

            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSaveConfig}>
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
                                Save the template
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default FrameTemplatePage
