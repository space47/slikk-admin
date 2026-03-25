/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Button, Dialog, FormItem, Input } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { Field, Form, Formik } from 'formik'
import { Spinner, Checkbox } from '@/components/ui'
import CommonImageUpload from '@/common/CommonImageUpload'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { generatePreviewCanvas } from './generatePreviewCanvas'

interface props {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

export interface TemplateConfig {
    image_1: File[] | []
    image_2: File[] | []
    safe_zone_left: number
    safe_zone_right: number
    safe_zone_top: number
    safe_zone_bottom: number

    sp_x_abs: number
    sp_y_abs: number
    sp_font_size_abs: number
    sp_color: string
    sp_thickness: number

    mrp_x_abs: number
    mrp_y_abs: number
    mrp_font_size_abs: number
    mrp_color: string
    mrp_thickness: number

    slash_orientation: string
    slash_thickness: number
    slash_color: string
    slash_length_scale: number
    slash_x: number
    slash_y: number

    is_price_tag_required: boolean
    selling_price: string
    mrp_price: string
}

const hexToRgbTuple = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0]
}

const AddFrameTemplateModal = ({ isOpen, setIsOpen }: props) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const initialValues: TemplateConfig = {
        image_1: [],
        image_2: [],
        safe_zone_left: 0,
        safe_zone_right: 0,
        safe_zone_top: 0,
        safe_zone_bottom: 0,

        sp_x_abs: 0,
        sp_y_abs: 0,
        sp_font_size_abs: 24,
        sp_color: '#000000',
        sp_thickness: 1,

        mrp_x_abs: 0,
        mrp_y_abs: 0,
        mrp_font_size_abs: 24,
        mrp_color: '#000000',
        mrp_thickness: 1,

        slash_orientation: 'forward',
        slash_thickness: 1,
        slash_color: '#ff0000',
        slash_length_scale: 1,
        slash_x: 0,
        slash_y: 0,
        
        is_price_tag_required: true,
        selling_price: '99',
        mrp_price: '149',
    }

    const processImagesAndGetPayload = async (values: TemplateConfig) => {
        let img1_path = ''
        let img2_path = ''

        if (values?.image_1 && values?.image_1.length) {
            img1_path = await handleimage('frame', values?.image_1)
        }
        if (values?.image_2 && values?.image_2.length) {
            img2_path = await handleimage('frame', values?.image_2)
        }

        return {
            image_1_path: img1_path,
            image_2_path: img2_path,
            safe_zone_left: Number(values.safe_zone_left),
            safe_zone_right: Number(values.safe_zone_right),
            safe_zone_top: Number(values.safe_zone_top),
            safe_zone_bottom: Number(values.safe_zone_bottom),

            sp_x_abs: Number(values.sp_x_abs),
            sp_y_abs: Number(values.sp_y_abs),
            sp_font_size_abs: Number(values.sp_font_size_abs),
            sp_color: hexToRgbTuple(values.sp_color),
            sp_thickness: Number(values.sp_thickness),

            mrp_x_abs: Number(values.mrp_x_abs),
            mrp_y_abs: Number(values.mrp_y_abs),
            mrp_font_size_abs: Number(values.mrp_font_size_abs),
            mrp_color: hexToRgbTuple(values.mrp_color),
            mrp_thickness: Number(values.mrp_thickness),

            slash_orientation: values.slash_orientation,
            slash_thickness: Number(values.slash_thickness),
            slash_color: hexToRgbTuple(values.slash_color),
            slash_length_scale: Number(values.slash_length_scale),
            slash_x: Number(values.slash_x),
            slash_y: Number(values.slash_y),
            
            is_price_tag_required: values.is_price_tag_required,
            selling_price: values.selling_price,
            mrp_price: values.mrp_price,
        }
    }

    const handleGeneratePreview = async (values: TemplateConfig) => {
        setIsLoading(true)
        try {
            // No API call, entirely local UI processing using Canvas
            const dataUrl = await generatePreviewCanvas(values)
            setPreviewImage(dataUrl)
            
            notification.success({
                message: 'Preview Generated',
                description: 'The template preview has been generated instantly.',
            })
        } catch (error: any) {
            console.log('error generating preview', error)
            notification.error({
                message: 'Preview Failed',
                description: error?.message || 'Failed to generate browser image preview.',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSaveConfig = async (values: TemplateConfig) => {
        notification.info({
            message: 'Saving Configuration',
            description: 'Uploading images and saving template configuration...',
        })
        
        try {
            const payload = await processImagesAndGetPayload(values)
            const res = await axioisInstance.post('/product/frame-template/save', payload)
            
            notification.success({
                message: 'Success',
                description: res?.data?.message || 'Template configuration saved successfully.',
            })
            setIsOpen(false)
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
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)} width={1200}>
            <div className="flex flex-col h-[90vh] max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">Frame Template Configuration</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 transition">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50">
                    <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSaveConfig}>
                        {({ values, submitForm }) => (
                            <Form className="flex flex-col lg:flex-row gap-6">
                                <div className="w-full lg:w-1/2 space-y-6 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                                    <h3 className="font-semibold text-gray-700 border-b pb-2">Uploads & Parameters</h3>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <CommonImageUpload
                                            label="Upload Back/Foreground Image 1"
                                            beforeUpload={beforeUpload}
                                            fileList={values?.image_1 as File[]}
                                            fieldNames="image_1"
                                            name="image_1"
                                        />
                                        <CommonImageUpload
                                            label="Upload Back/Foreground Image 2"
                                            beforeUpload={beforeUpload}
                                            fileList={values?.image_2 as File[]}
                                            fieldNames="image_2"
                                            name="image_2"
                                        />
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Preview Sample Data</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            <FormItem label="Price Tag Req."><Field name="is_price_tag_required" type="checkbox" className="mt-2 w-5 h-5" /></FormItem>
                                            <FormItem label="Selling Price"><Field name="selling_price" type="text" as={Input} /></FormItem>
                                            <FormItem label="MRP"><Field name="mrp_price" type="text" as={Input} /></FormItem>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Safe Zone</h4>
                                        <div className="grid grid-cols-4 gap-2">
                                            <FormItem label="Left"><Field name="safe_zone_left" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Right"><Field name="safe_zone_right" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Top"><Field name="safe_zone_top" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Bottom"><Field name="safe_zone_bottom" type="number" step="any" as={Input} /></FormItem>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Selling Price (SP)</h4>
                                        <div className="grid grid-cols-5 gap-2">
                                            <FormItem label="X Abs"><Field name="sp_x_abs" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Y Abs"><Field name="sp_y_abs" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Size"><Field name="sp_font_size_abs" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Color"><Field name="sp_color" type="color" className="w-full h-10 p-1" as={Input} /></FormItem>
                                            <FormItem label="Thick"><Field name="sp_thickness" type="number" step="any" as={Input} /></FormItem>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Maximum Retail Price (MRP)</h4>
                                        <div className="grid grid-cols-5 gap-2">
                                            <FormItem label="X Abs"><Field name="mrp_x_abs" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Y Abs"><Field name="mrp_y_abs" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Size"><Field name="mrp_font_size_abs" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Color"><Field name="mrp_color" type="color" className="w-full h-10 p-1" as={Input} /></FormItem>
                                            <FormItem label="Thick"><Field name="mrp_thickness" type="number" step="any" as={Input} /></FormItem>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-600 mb-2">Slash</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            <FormItem label="Orient."><Field name="slash_orientation" type="text" as={Input} /></FormItem>
                                            <FormItem label="Color"><Field name="slash_color" type="color" className="w-full h-10 p-1" as={Input} /></FormItem>
                                            <FormItem label="Thick"><Field name="slash_thickness" type="number" step="any" as={Input} /></FormItem>
                                            
                                            <FormItem label="Len Scale"><Field name="slash_length_scale" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="X Pos"><Field name="slash_x" type="number" step="any" as={Input} /></FormItem>
                                            <FormItem label="Y Pos"><Field name="slash_y" type="number" step="any" as={Input} /></FormItem>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
                                        <Button 
                                            type="button" 
                                            variant="default"
                                            className="w-full bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                                            onClick={() => handleGeneratePreview(values)}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <span className="flex items-center gap-2"><Spinner size={16}/> Generating...</span> : "Generate Preview Image"}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="solid"
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md transition"
                                            onClick={submitForm}
                                        >
                                            Save Configuration
                                        </Button>
                                    </div>
                                </div>

                                <div className="w-full lg:w-1/2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                                    <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Pillow Image Preview</h3>
                                    <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden relative min-h-[500px]">
                                        {isLoading ? (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <Spinner size={40} className="mb-3" />
                                                <p>Processing image preview purely on client...</p>
                                            </div>
                                        ) : previewImage ? (
                                            <img src={previewImage} alt="Generated Template" className="max-w-full max-h-full object-contain" />
                                        ) : (
                                            <div className="flex flex-col items-center text-gray-400">
                                                <span className="text-4xl mb-2">🖼️</span>
                                                <p>Click "Generate Preview Image" to render.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </Dialog>
    )
}

export default AddFrameTemplateModal
