/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input } from '@/components/ui'
import React from 'react'
import CommonSelect from './CommonSelect'
import { FOOTERCONFIGARRAY, HEADERCONFIGARRAY, SUBHEADERCONFIGARRAY } from './configurationCommon'
import { Field } from 'formik'
import PageEditImage from './PageEditImage'
import PageAddCommonImage from './PageAddCommonImage'
import { ALIGNVALUES } from './genericComp'
import { beforeUpload } from '@/common/beforeUpload'
const FontSizeArray = [
    { label: 'Bold', value: 'bold' },
    { label: 'Regular', value: 'regular' },
    { label: 'Underline', value: 'underline' },
    { label: 'Italic', value: 'italic' },
]

interface OtherConfigProps {
    editMode?: any
    particularRow?: any
    values?: any
    handleRemoveHeaderImage?: any
    handleRemoveSubImage?: any
    handleRemoveImage?: any
}

const OtherConfigs = ({
    editMode,
    particularRow,
    values,
    handleRemoveHeaderImage,
    handleRemoveImage,
    handleRemoveSubImage,
}: OtherConfigProps) => {
    return (
        <FormContainer className="grid grid-cols-2 gap-3">
            <CommonSelect
                name="header_config.style"
                label="Header config Style"
                options={FontSizeArray}
                needClassName
                className="col-span-1 w-1/2"
            />
            {HEADERCONFIGARRAY.map((item, key) => (
                <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                    <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                </FormItem>
            ))}

            {editMode ? (
                <>
                    <PageEditImage
                        label="Header Image"
                        rowName={particularRow.header_config.image}
                        removeName="header_image_image"
                        handleRemoveImage={handleRemoveHeaderImage}
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

            <CommonSelect
                name="header_config.position"
                label="Header  position"
                options={ALIGNVALUES}
                needClassName
                className="col-span-1 w-1/2"
            />

            <CommonSelect
                name="sub_header_config.style"
                label="Sub-Header config Style"
                options={FontSizeArray}
                needClassName
                className="col-span-1 w-1/2"
            />
            {SUBHEADERCONFIGARRAY.map((item, key) => (
                <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                    <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                </FormItem>
            ))}
            <CommonSelect
                name="sub_header_config.position"
                label="Sub-Header  position"
                options={ALIGNVALUES}
                needClassName
                className="col-span-1 w-1/2"
            />

            {editMode ? (
                <>
                    <PageEditImage
                        label="Sub_Header Image"
                        rowName={particularRow.sub_header_config.image}
                        removeName="sub_header_image"
                        handleRemoveImage={handleRemoveSubImage}
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

            {/* FOOOTER.......................................................... */}
            <CommonSelect
                name="footer_config.style"
                label="Footer config Style"
                options={FontSizeArray}
                needClassName
                className="col-span-1 w-1/2"
            />
            {FOOTERCONFIGARRAY.map((item, key) => (
                <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                    <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} min="0" />
                </FormItem>
            ))}

            {editMode ? (
                <>
                    <PageEditImage
                        label="Footer Image"
                        rowName={particularRow.footer_config.image}
                        removeName="footer_image"
                        handleRemoveImage={handleRemoveImage}
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

            <CommonSelect name="footer.position" label="Footer position" options={ALIGNVALUES} needClassName className="col-span-1 w-1/2" />
        </FormContainer>
    )
}

export default OtherConfigs
