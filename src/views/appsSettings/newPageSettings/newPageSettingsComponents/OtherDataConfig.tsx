/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import { ALIGNVALUES, BorderStyleArray, FontSizeArray } from '../newPageSettingsUtils/newpageConstants'
import PageEditImage from '../../pageSettings/PageEditImage'
import PageAddCommonImage from '../../pageSettings/PageAddCommonImage'
import { beforeUpload } from '@/common/beforeUpload'
import PageEditVideo from '../../pageSettings/PageEditVideo'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import PageAddVideo from '../../pageSettings/PageAddVideo'
import CommonSelect from '../../pageSettings/CommonSelect'
import { Field } from 'formik'
import {
    CtaArray,
    FooterCommonConfigArray,
    FooterConfigArray,
    HeaderCommonConfigArray,
    HeaderConfigArray,
    SubHeaderCommonConfigArray,
    SubHeaderConfigArray,
    WebFooterConfigArray,
    WebHeaderConfigArray,
    WebSubHeaderConfigArray,
} from '../newPageSettingsUtils/newPageCommons'

interface OtherConfigProps {
    editMode?: any
    initialValue?: any
    values?: any
    // handleRemoveHeaderImage?: any
    // handleRemoveSubImage?: any
    // handleRemoveImage?: any
    // handleRemoveExploreImage?: any
    setInitialValue: (x: any) => void
}

const OtherDataConfigs = ({
    editMode,
    initialValue,
    values,
    setInitialValue,
    // handleRemoveHeaderImage,
    // handleRemoveImage,
    // handleRemoveSubImage,
}: OtherConfigProps) => {
    console.log('initial Value in other form', initialValue)

    const handleRemove = (value: string) => {
        if (value === 'header_image') {
            setInitialValue({
                ...initialValue,
                header_config: {
                    ...initialValue.header_config,
                    image: '',
                },
            })
        }
        if (value === 'sub_image') {
            setInitialValue({
                ...initialValue,
                sub_header_config: {
                    ...initialValue.sub_header_config,
                    image: '',
                },
            })
        }
        if (value === 'footer_image') {
            setInitialValue({
                ...initialValue,
                footer_config: {
                    ...initialValue.footer_config,
                    image: '',
                },
            })
        }
    }

    return (
        <FormContainer className="bg-gray-50">
            <h3 className="mb-3">Header Config</h3>
            <div className="grid grid-cols-2 gap-3">
                <CommonSelect
                    needClassName
                    name="header_config.style"
                    label="Header config Style"
                    options={FontSizeArray}
                    className="col-span-1 w-1/2"
                />
                {HeaderConfigArray?.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}
                {WebHeaderConfigArray?.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}
                {HeaderCommonConfigArray?.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}

                {editMode ? (
                    <>
                        <PageEditImage
                            label="Header Image"
                            rowName={initialValue.header_config.image}
                            removeName="header_image_image"
                            handleRemoveImage={() => handleRemove('header_image')}
                            name="header_config_image_Array"
                            beforeUpload={beforeUpload}
                            fileList={values.header_config_image_Array}
                            fieldName="header_config_image_Array"
                        />
                    </>
                ) : (
                    <>
                        <PageAddCommonImage
                            label="Header Image"
                            name="header_config_image_Array"
                            fieldName="header_config_image_Array"
                            fileList={values.header_config_image_Array}
                            beforeUpload={beforeUpload}
                        />
                    </>
                )}

                {editMode ? (
                    <>
                        <PageEditVideo
                            label="header Video"
                            rowName={initialValue.header_config.video}
                            removeName="header_video"
                            // handleRemoveImage={()=>handleRemove('sub_image')}
                            name="header_config_video_Array"
                            beforeVideoUpload={beforeVideoUpload}
                            fileList={values.header_config_video_Array}
                            fieldName="header_config_video_Array"
                        />
                    </>
                ) : (
                    <>
                        <PageAddVideo
                            label="Header video"
                            name="header_config_video_Array"
                            fieldName="header_config_video_Array"
                            fileList={values.header_config_video_Array}
                            beforeUpload={beforeVideoUpload}
                        />
                    </>
                )}

                <CommonSelect
                    needClassName
                    name="header_config.position"
                    label="Header  position"
                    options={ALIGNVALUES}
                    className="col-span-1 w-1/2"
                />
            </div>

            {/* CTA */}
            <h3 className="mb-3 mt-3">CTA Config</h3>
            <div className="grid grid-cols-2 gap-3">
                <CommonSelect
                    needClassName
                    name="extra_info.cta_config.style"
                    label="CTA config Style"
                    options={FontSizeArray}
                    className="col-span-1 w-1/2"
                />
                {CtaArray.map((item, key) => (
                    <FormItem key={key} label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}

                <CommonSelect
                    needClassName
                    name="extra_info.cta_config.position"
                    label="CTA position"
                    options={ALIGNVALUES}
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    needClassName
                    name="extra_info.cta_config.alignment"
                    label="CTA Alignment"
                    options={ALIGNVALUES}
                    className="col-span-1 w-1/2"
                />
                <CommonSelect
                    needClassName
                    name="extra_info.cta_config.borderStyle"
                    label="CTA Border Style"
                    options={BorderStyleArray}
                    className="col-span-1 w-1/2"
                />
            </div>

            {/* sub header */}

            <h3 className="mb-3 mt-3">Sub Header Config</h3>

            <div className="grid grid-cols-2 gap-3">
                <CommonSelect
                    needClassName
                    name="sub_header_config.style"
                    label="Sub-Header config Style"
                    options={FontSizeArray}
                    className="col-span-1 w-1/2"
                />

                {SubHeaderConfigArray.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}
                {WebSubHeaderConfigArray.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}
                {SubHeaderCommonConfigArray.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}
                <CommonSelect
                    needClassName
                    name="sub_header_config.position"
                    label="Sub-Header  position"
                    options={ALIGNVALUES}
                    className="col-span-1 w-1/2"
                />

                {editMode ? (
                    <>
                        <PageEditImage
                            label="Sub_Header Image"
                            rowName={initialValue.sub_header_config.image}
                            removeName="sub_header_image"
                            handleRemoveImage={() => handleRemove('sub_image')}
                            name="sub_header_config_image_Array"
                            beforeUpload={beforeUpload}
                            fileList={values.sub_header_config_image_Array}
                            fieldName="sub_header_config_image_Array"
                        />
                    </>
                ) : (
                    <>
                        <PageAddCommonImage
                            label="Sub Header Image"
                            name="sub_header_config_image_Array"
                            fieldName="sub_header_config_image_Array"
                            fileList={values.sub_header_config_image_Array}
                            beforeUpload={beforeUpload}
                        />
                    </>
                )}

                {editMode ? (
                    <>
                        <PageEditVideo
                            label="Sub_Header Video"
                            rowName={initialValue.sub_header_config.video}
                            removeName="sub_header_video"
                            // handleRemoveImage={handleRemoveSubImage}
                            name="sub_header_config_video_Array"
                            beforeVideoUpload={beforeVideoUpload}
                            fileList={values.sub_header_config_video_Array}
                            fieldName="sub_header_config_video_Array"
                        />
                    </>
                ) : (
                    <>
                        <PageAddVideo
                            label="Sub Header video"
                            name="sub_header_config_video_Array"
                            fieldName="sub_header_config_video_Array"
                            fileList={values.sub_header_config_video_Array}
                            beforeUpload={beforeVideoUpload}
                        />
                    </>
                )}
            </div>

            {/* FOOOTER.......................................................... */}
            <h3 className="mb-3 mt-3">Footer Config</h3>
            <div className="grid grid-cols-2 gap-3">
                <CommonSelect
                    needClassName
                    name="footer_config.style"
                    label="Footer config Style"
                    options={FontSizeArray}
                    className="col-span-1 w-1/2"
                />
                {FooterConfigArray.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}
                {WebFooterConfigArray.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}
                {FooterCommonConfigArray.map((item, key) => (
                    <FormItem key={key} asterisk label={item.label} className="w-full">
                        <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                    </FormItem>
                ))}

                {editMode ? (
                    <>
                        <PageEditImage
                            label="Footer Image"
                            rowName={initialValue.footer_config.image}
                            removeName="footer_image"
                            handleRemoveImage={() => handleRemove('footer_image')}
                            name="footer_config_image_Array"
                            beforeUpload={beforeUpload}
                            fileList={values.footer_config_image_Array}
                            fieldName="footer_config_image_Array"
                        />
                    </>
                ) : (
                    <>
                        <PageAddCommonImage
                            label="Footer Image"
                            name="footer_config_image_Array"
                            fieldName="footer_config_image_Array"
                            fileList={values.footer_config_image_Array}
                            beforeUpload={beforeUpload}
                        />
                    </>
                )}

                {editMode ? (
                    <>
                        <PageEditVideo
                            label="Footer Video"
                            rowName={initialValue.footer_config.video}
                            removeName="footer_video"
                            // handleRemoveImage={handleRemoveSubImage}
                            name="footer_config_video_Array"
                            beforeVideoUpload={beforeVideoUpload}
                            fileList={values.footer_config_video_Array}
                            fieldName="footer_config_video_Array"
                        />
                    </>
                ) : (
                    <>
                        <PageAddVideo
                            label="Footer video"
                            name="footer_config_video_Array"
                            fieldName="footer_config_video_Array"
                            fileList={values.footer_config_video_Array}
                            beforeUpload={beforeVideoUpload}
                        />
                    </>
                )}

                <CommonSelect
                    needClassName
                    name="footer.position"
                    label="Footer position"
                    options={ALIGNVALUES}
                    className="col-span-1 w-1/2"
                />
            </div>
        </FormContainer>
    )
}

export default OtherDataConfigs
