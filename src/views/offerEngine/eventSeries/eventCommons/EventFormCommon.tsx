/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Upload } from '@/components/ui'
import React from 'react'
import { EventTypeForm } from './eventCommonArray'
import { Field, FieldProps } from 'formik'
import FullDateForm from '@/common/FullDateForm'
import { RichTextEditor } from '@/components/shared'
import { beforeUpload } from '@/common/beforeUpload'
import { MdCancel } from 'react-icons/md'
import EventMap from './EventMaps'

interface Props {
    editMode?: boolean
    values?: any
    initialValue?: any
    handleRemoveImage?: any
    setCurrLat?: React.Dispatch<React.SetStateAction<number>>
    setCurrLong?: React.Dispatch<React.SetStateAction<number>>
    currLat?: number
    currLong?: number
}

const EventFormCommon = ({ editMode, values, initialValue, handleRemoveImage, setCurrLat, setCurrLong, currLat, currLong }: Props) => {
    return (
        <div>
            <FormContainer>
                {EventTypeForm?.map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full">
                        <Field
                            name={item?.name}
                            type={item?.type}
                            placeholder={`Enter ${item?.label}`}
                            component={item?.type === 'checkbox' ? Checkbox : Input}
                            className="w-3/4"
                        />
                    </FormItem>
                ))}
                <FormItem label="Description">
                    <Field name="description">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>
                <FormItem label="Special Promotions">
                    <Field name="extra_attributes.special_promotions">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>
                <FormContainer className="grid grid-cols-2 gap-4">
                    <FullDateForm label="Registration Start Date" name="registration_start_date" fieldname="registration_start_date" />
                    <FullDateForm label="Registration End Date" name="registration_end_date" fieldname="registration_end_date" />
                    <FullDateForm label="Start Date" name="event_start_time" fieldname="event_start_time" />
                    <FullDateForm label="End Date" name="event_end_time" fieldname="event_end_time" />
                </FormContainer>
                {/* Image */}
                <FormItem label="Image Website">
                    {editMode ? (
                        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col  rounded-xl mb-2 overflow-scroll scrollbar-hide">
                            {initialValue.image_web ? (
                                <div className="flex flex-col items-center justify-center ">
                                    <img src={initialValue.image_web} alt={`Image `} className="w-[100px] h-[40px] flex object-contain " />
                                    <button type="button" className="text-red-500 text-md " onClick={() => handleRemoveImage('image_web')}>
                                        <MdCancel className="text-red-500 bg-none text-lg" />
                                    </button>
                                </div>
                            ) : (
                                'No Image'
                            )}
                            <FormContainer className=" mt-5 ">
                                <FormItem label="" className="grid grid-rows-2">
                                    <Field name="web_image_array">
                                        {({ form }: FieldProps) => (
                                            <>
                                                <div className="font-semibold flex justify-center">Web Image</div>
                                                <Upload
                                                    beforeUpload={beforeUpload}
                                                    fileList={values.web_image_array}
                                                    className="flex justify-center"
                                                    onFileRemove={(files) => form.setFieldValue('web_image_array', files)}
                                                    onChange={(files) => form.setFieldValue('web_image_array', files)}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                    ) : (
                        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col rounded-xl mb-2 overflow-scroll scrollbar-hide">
                            <div className="font-semibold mb-1 text-md">Web Image</div>

                            <FormContainer className=" mt-5 ">
                                <FormItem label="" className="grid grid-rows-2">
                                    <Field name="web_image_array">
                                        {({ field, form }: FieldProps) => (
                                            <>
                                                <Upload
                                                    beforeUpload={beforeUpload}
                                                    fileList={values.web_image_array}
                                                    className="flex justify-center"
                                                    onFileRemove={(files) => form.setFieldValue('web_image_array', files)}
                                                    onChange={(files) => {
                                                        console.log('OnchangeFiles', files, field.name, values.web_image_array)
                                                        form.setFieldValue('web_image_array', files)
                                                    }}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                    )}
                </FormItem>
                <FormItem label="Image Mobile">
                    {editMode ? (
                        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col  rounded-xl mb-2 overflow-scroll scrollbar-hide">
                            {initialValue.image_mobile ? (
                                <div className="flex flex-col items-center justify-center min-w-[100px]">
                                    <img
                                        src={initialValue.image_mobile}
                                        alt={`Image `}
                                        className="w-[100px] h-[40px] flex object-contain "
                                    />
                                    <button
                                        type="button"
                                        className="text-red-500 text-md "
                                        onClick={() => handleRemoveImage('image_mobile')}
                                    >
                                        <MdCancel className="text-red-500 bg-none text-lg" />
                                    </button>
                                </div>
                            ) : (
                                'No Image'
                            )}
                            <FormContainer className=" mt-5 ">
                                <FormItem label="" className="grid grid-rows-2">
                                    <Field name="mobile_image_array">
                                        {({ form }: FieldProps) => (
                                            <>
                                                <div className="font-semibold flex justify-center">Mobile Image</div>
                                                <Upload
                                                    beforeUpload={beforeUpload}
                                                    fileList={values.mobile_image_array}
                                                    className="flex justify-center"
                                                    onFileRemove={(files) => form.setFieldValue('mobile_image_array', files)}
                                                    onChange={(files) => form.setFieldValue('mobile_image_array', files)}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                    ) : (
                        <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col  rounded-xl mb-2 overflow-scroll scrollbar-hide">
                            <div className="font-semibold mb-1 text-md">Mobile Background Image</div>

                            <FormContainer className=" mt-5 ">
                                <FormItem label="" className="grid grid-rows-2">
                                    <Field name="mobile_image_array">
                                        {({ field, form }: FieldProps) => (
                                            <>
                                                <Upload
                                                    beforeUpload={beforeUpload}
                                                    fileList={values.mobile_image_array}
                                                    className="flex justify-center"
                                                    onFileRemove={(files) => form.setFieldValue('mobile_image_array', files)}
                                                    onChange={(files) => {
                                                        console.log('OnchangeFiles', files, field.name, values.mobile_image_array)
                                                        form.setFieldValue('mobile_image_array', files)
                                                    }}
                                                />
                                            </>
                                        )}
                                    </Field>
                                </FormItem>
                            </FormContainer>
                        </FormContainer>
                    )}
                </FormItem>
                <div className="mt-8">
                    <div className="text-xl font-bold mb-4 text-gray-700">Event Location</div>
                    <EventMap setMarkLat={setCurrLat ?? 0} setMarkLong={setCurrLong ?? 0} markLat={currLat ?? 0} markLong={currLong ?? 0} />
                </div>
            </FormContainer>
        </div>
    )
}

export default EventFormCommon
