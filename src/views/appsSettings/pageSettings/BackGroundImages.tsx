/* eslint-disable @typescript-eslint/no-explicit-any */
import { Checkbox, FormContainer, FormItem, Input, Upload } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React from 'react'
import { MdCancel } from 'react-icons/md'
import { WebType } from './pageSettings.types'
import { beforeUpload } from '@/common/beforeUpload'
import { BackGroundArray, MobileAndDesktopPositions } from './genericComp'
import CommonSelect from './CommonSelect'
import PageEditVideo from './PageEditVideo'
import PageAddVideo from './PageAddVideo'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
// import { DatePicker } from 'antd'
// import moment from 'moment'

interface BGprops {
    editMode: any
    initialValue: any
    handleRemoveImage: any
    values: any
    handleRemoveVideo: any
}

const BackGroundImages = ({ editMode, initialValue, handleRemoveImage, values, handleRemoveVideo }: BGprops) => {
    return (
        <FormContainer className="grid grid-cols-2 gap-3">
            {editMode ? (
                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                    {initialValue.background_image ? (
                        <div className="flex flex-col items-center justify-center w-[150px]">
                            <img src={initialValue.background_image} alt={`Image `} className="w-[150px] h-[40px] flex object-contain " />
                            <button className="text-red-500 text-md " onClick={() => handleRemoveImage('background_image')}>
                                <MdCancel className="text-red-500 bg-none text-lg" />
                            </button>
                        </div>
                    ) : (
                        'No Image'
                    )}
                    <FormContainer className=" ">
                        <FormItem label="" className="grid grid-rows-2">
                            <Field name="background_image_array">
                                {({ form }: FieldProps<WebType>) => (
                                    <>
                                        <div className="font-semibold flex justify-center">Background Image</div>
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            fileList={values.background_image_array} // uploadedd the file
                                            className="flex justify-center"
                                            onFileRemove={(files) => form.setFieldValue('background_image_array', files)}
                                            onChange={(files) => form.setFieldValue('background_image_array', files)}
                                        />
                                    </>
                                )}
                            </Field>
                        </FormItem>
                    </FormContainer>
                </FormContainer>
            ) : (
                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                    <div className="font-semibold mb-1">Background Image</div>

                    <FormContainer className=" mt-5 ">
                        <FormItem label="" className="grid grid-rows-2">
                            <Field name="background_image_array">
                                {({ field, form }: FieldProps<WebType>) => (
                                    <>
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            fileList={values.background_image_array}
                                            className="items-center flex justify-center"
                                            onFileRemove={(files) => form.setFieldValue('background_image_array', files)}
                                            onChange={(files) => {
                                                console.log('OnchangeFiles', files, field.name, values.background_image_array)
                                                form.setFieldValue('background_image_array', files)
                                            }}
                                        />
                                    </>
                                )}
                            </Field>
                        </FormItem>
                    </FormContainer>
                </FormContainer>
            )}

            {editMode ? (
                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                    {initialValue.mobile_background_image ? (
                        <div className="flex flex-col items-center justify-center min-w-[100px]">
                            <img
                                src={initialValue.mobile_background_image}
                                alt={`Image `}
                                className="w-[100px] h-[40px] flex object-contain "
                            />
                            <button className="text-red-500 text-md " onClick={() => handleRemoveImage('mobile_background_image')}>
                                <MdCancel className="text-red-500 bg-none text-lg" />
                            </button>
                        </div>
                    ) : (
                        'No Image'
                    )}
                    <FormContainer className=" mt-5 ">
                        <FormItem label="" className="grid grid-rows-2">
                            <Field name="mobile_background_array">
                                {({ form }: FieldProps<WebType>) => (
                                    <>
                                        <div className="font-semibold flex justify-center">Mobile Background Image</div>
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            fileList={values.mobile_background_array} // uploadedd the file
                                            className="flex justify-center"
                                            onFileRemove={(files) => form.setFieldValue('mobile_background_array', files)}
                                            onChange={(files) => form.setFieldValue('mobile_background_array', files)}
                                        />
                                    </>
                                )}
                            </Field>
                        </FormItem>
                    </FormContainer>
                </FormContainer>
            ) : (
                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                    <div className="font-semibold mb-1 text-md">Mobile Background Image</div>

                    <FormContainer className=" mt-5 ">
                        <FormItem label="" className="grid grid-rows-2">
                            <Field name="mobile_background_array">
                                {({ field, form }: FieldProps<WebType>) => (
                                    <>
                                        <Upload
                                            beforeUpload={beforeUpload}
                                            fileList={values.mobile_background_array} // uploadedd the file
                                            className="flex justify-center"
                                            onFileRemove={(files) => form.setFieldValue('mobile_background_array', files)}
                                            onChange={(files) => {
                                                console.log('OnchangeFiles', files, field.name, values.mobile_background_array)
                                                form.setFieldValue('mobile_background_array', files)
                                            }}
                                        />
                                    </>
                                )}
                            </Field>
                        </FormItem>
                    </FormContainer>
                </FormContainer>
            )}

            {editMode ? (
                <>
                    <PageEditVideo
                        label="background Video"
                        rowName={initialValue.background_video}
                        removeName="background_video"
                        handleRemoveVideo={() => handleRemoveVideo('background_video')}
                        name="background_video_array"
                        beforeVideoUpload={beforeVideoUpload}
                        fileList={values.background_video_array}
                        fieldName="background_video_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Background video"
                        name="background_video_array"
                        fieldName="background_video_array"
                        fileList={values.background_video_array}
                        beforeUpload={beforeVideoUpload}
                    />
                </>
            )}

            {editMode ? (
                <>
                    <PageEditVideo
                        label="Mobile background Video"
                        rowName={initialValue.mobile_background_video}
                        removeName="mobile_background_video"
                        handleRemoveVideo={() => handleRemoveVideo('mobile_background_video')}
                        name="mobile_background_video_array"
                        beforeVideoUpload={beforeVideoUpload}
                        fileList={values.mobile_background_video_array}
                        fieldName="mobile_background_video_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Mobile Background video"
                        name="mobile_background_video_array"
                        fieldName="mobile_background_video_array"
                        fileList={values.mobile_background_video_array}
                        beforeUpload={beforeVideoUpload}
                    />
                </>
            )}
            {/* Lottie */}

            {editMode ? (
                <>
                    <PageEditVideo
                        isLottie
                        label="background lottie"
                        rowName={initialValue.background_lottie}
                        removeName="background_lottie"
                        handleRemoveVideo={() => handleRemoveVideo('background_lottie')}
                        name="background_lottie_array"
                        beforeVideoUpload={beforeUpload}
                        fileList={values.background_lottie_array}
                        fieldName="background_lottie_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Background lottie"
                        name="background_lottie_array"
                        fieldName="background_lottie_array"
                        fileList={values.background_lottie_array}
                        beforeUpload={beforeUpload}
                    />
                </>
            )}

            {editMode ? (
                <>
                    <PageEditVideo
                        isLottie
                        label="Mobile background lottie"
                        rowName={initialValue.mobile_background_lottie}
                        removeName="mobile_background_lottie"
                        handleRemoveVideo={() => handleRemoveVideo('mobile_background_lottie')}
                        name="mobile_background_lottie_array"
                        beforeVideoUpload={beforeUpload}
                        fileList={values.mobile_background_lottie_array}
                        fieldName="mobile_background_lottie_array"
                    />
                </>
            ) : (
                <>
                    <PageAddVideo
                        label="Mobile Background lottie"
                        name="mobile_background_lottie_array"
                        fieldName="mobile_background_lottie_array"
                        fileList={values.mobile_background_lottie_array}
                        beforeUpload={beforeUpload}
                    />
                </>
            )}

            {BackGroundArray.map((item, key) => (
                <FormItem key={key} asterisk label={item.label} className="w-1/2">
                    <Field
                        type={item.type}
                        name={item.name}
                        placeholder={item.placeholder}
                        component={item?.type === 'checkbox' ? Checkbox : Input}
                        min="0"
                    />
                </FormItem>
            ))}
            <CommonSelect
                needClassName
                name="background_config.desktop_position"
                label="Web Position"
                options={MobileAndDesktopPositions}
                className="w-1/2"
            />

            <CommonSelect
                needClassName
                name="background_config.mobile_position"
                label="Mobile Position"
                options={MobileAndDesktopPositions}
                className="w-1/2"
            />

            {/* <FormItem label="TimeStamp" className="mt-4">
                <Field name="background_config.timeout">
                    {({ field, form }: any) => (
                        <DatePicker
                            showTime
                            placeholder=""
                            value={field.value ? moment(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                            onChange={(value) => {
                                form.setFieldValue('background_config.timeout', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                            }}
                            className=" md:w-2/3 lg:w-1/2 xl:w-1/2"
                        />
                    )}
                </Field>
            </FormItem> */}
        </FormContainer>
    )
}

export default BackGroundImages
