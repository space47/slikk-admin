/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import { EventTypeForm } from './eventCommonArray'
import { Field, FieldProps } from 'formik'
import FullDateForm from '@/common/FullDateForm'
import { RichTextEditor } from '@/components/shared'
import { beforeUpload } from '@/common/beforeUpload'
import EventMap from './EventMaps'
import ImageCommonProduct from '@/views/category-management/catalog/ImageCommonProduct'
import AddProductImages from '@/views/category-management/catalog/AddProductImages'
import { beforeVideoUpload } from '@/common/beforUploadVideo'

interface Props {
    editMode?: boolean
    values?: any
    initialValue?: any
    handleRemoveImage?: any
    setCurrLat?: React.Dispatch<React.SetStateAction<number>>
    setCurrLong?: React.Dispatch<React.SetStateAction<number>>
    currLat?: number
    currLong?: number
    webImageView?: any
    mobileImageView?: any
    eventPhotos?: any
    eventVideos?: any
    venueImages?: any
}

const EventFormCommon = ({
    editMode,
    values,
    handleRemoveImage,
    setCurrLat,
    setCurrLong,
    currLat,
    currLong,
    webImageView,
    mobileImageView,
    eventPhotos,
    eventVideos,
    venueImages,
}: Props) => {
    return (
        <div>
            <FormContainer>
                <FormContainer className="grid grid-cols-2 gap-3">
                    {EventTypeForm?.map((item, key) => (
                        <FormItem key={key} label={item.label} className="w-full">
                            <Field
                                name={item?.name}
                                type={item?.type}
                                placeholder={`Enter ${item?.label}`}
                                component={item?.type === 'checkbox' ? Checkbox : Input}
                                className={`${item?.type === 'checkbox' ? 'w-1' : 'w-3/4'}`}
                            />
                        </FormItem>
                    ))}
                </FormContainer>

                <FormItem label="Description">
                    <Field name="description">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor
                                preserveWhitespace
                                value={field.value}
                                onChange={(val) => form.setFieldValue(field.name, val)}
                            />
                        )}
                    </Field>
                </FormItem>
                <FormItem label="Special Instructions">
                    <Field name="extra_attributes.special_instructions">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                        )}
                    </Field>
                </FormItem>
                <FormItem label="Terms and Conditions">
                    <Field name="terms_and_conditions">
                        {({ field, form }: FieldProps) => (
                            <RichTextEditor
                                preserveWhitespace
                                value={field.value}
                                onChange={(val) => form.setFieldValue(field.name, val)}
                            />
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
                        <ImageCommonProduct
                            label="Web Image"
                            allName={webImageView}
                            handleRemove={handleRemoveImage(`wb`)}
                            name="web_image_array"
                            fieldname="web_image_array"
                            fileLists={values.web_image_array}
                            textName="image web"
                            placeholder="Enter Image Url"
                        />
                    ) : (
                        <AddProductImages
                            label="Web Image"
                            name="web_image_array"
                            fileList={values.web_image_array}
                            beforeUpload={beforeUpload}
                            fieldNames="web_image_array"
                        />
                    )}
                </FormItem>
                <FormItem label="Image Mobile">
                    {editMode ? (
                        <ImageCommonProduct
                            label="Mobile Image"
                            allName={mobileImageView}
                            handleRemove={handleRemoveImage('mb')}
                            name="mobile_image_array"
                            fieldname="mobile_image_array"
                            fileLists={values.mobile_image_array}
                            textName="image mobile"
                            placeholder="Enter Image Url"
                        />
                    ) : (
                        <AddProductImages
                            label="Mobile Image"
                            name="mobile_image_array"
                            fileList={values.mobile_image_array}
                            beforeUpload={beforeUpload}
                            fieldNames="mobile_image_array"
                        />
                    )}
                </FormItem>
                {/* Event List */}

                <FormItem label="Event Images">
                    {editMode ? (
                        <ImageCommonProduct
                            label="Event Image"
                            allName={eventPhotos}
                            handleRemove={handleRemoveImage('ei')}
                            name="event_images_array"
                            fieldname="event_images_array"
                            fileLists={values.event_images_array}
                            textName="Event image "
                            placeholder="Enter Image Url"
                        />
                    ) : (
                        <AddProductImages
                            label="Event Image"
                            name="event_images_array"
                            fileList={values.event_images_array}
                            beforeUpload={beforeUpload}
                            fieldNames="event_images_array"
                        />
                    )}
                </FormItem>

                <FormItem label="Event video">
                    {editMode ? (
                        <ImageCommonProduct
                            isVideo
                            label="Event Videos"
                            allName={eventVideos}
                            handleRemove={handleRemoveImage('ev')}
                            name="event_video_array"
                            fieldname="event_video_array"
                            fileLists={values.event_video_array}
                            textName="Event Video "
                            placeholder="Enter Video Url"
                        />
                    ) : (
                        <AddProductImages
                            label="Event Video"
                            name="event_video_array"
                            fileList={values.event_video_array}
                            beforeUpload={beforeVideoUpload}
                            fieldNames="event_video_array"
                        />
                    )}
                </FormItem>

                <FormItem label="Venue Images">
                    {editMode ? (
                        <ImageCommonProduct
                            label="Venue Image"
                            allName={venueImages}
                            handleRemove={handleRemoveImage('vi')}
                            name="venue_img_url"
                            fieldname="venue_img_url"
                            fileLists={values.venue_img_url}
                            textName="Event image "
                            placeholder="Enter Image Url"
                        />
                    ) : (
                        <AddProductImages
                            label="Venue Image"
                            name="venue_img_url"
                            fileList={values.venue_img_url}
                            beforeUpload={beforeUpload}
                            fieldNames="venue_img_url"
                        />
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
