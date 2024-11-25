/* eslint-disable @typescript-eslint/no-explicit-any */
import { COMPONENT_CATEGORY_TYPES } from '@/common/banner'
import { Dropdown, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import React from 'react'
import {
    ALIGNVALUES,
    BackGroundArray,
    borrderStyleArray,
    genericComponentArray,
    MobileAndDesktopPositions,
    NAMEPOSITION,
    sectionBorrderStyleArray,
    webBorrderStyleArray,
} from './genericComp'
import CommonSelect from './CommonSelect'
import PageAddCommonImage from './PageAddCommonImage'
import { beforeUpload } from '@/common/beforeUpload'
import { DROPDOWNARRAY } from '@/views/category-management/catalog/CommonType'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import PageSettingsPostTable from './PageSettingsPostTable'
import { MdCancel } from 'react-icons/md'
import { DATATYPEVALUES, FOOTERCONFIGARRAY, HEADERCONFIGARRAY, SUBHEADERCONFIGARRAY } from './configurationCommon'
import TagsEdit from './TagsEdit'
import { WebType } from './pageSettings.types'
import PageEditImage from './PageEditImage'

const dataTypeArray = [
    { label: 'banner', value: 'banner' },
    { label: 'wishlist', value: 'wishlist' },
    { label: 'purchases', value: 'purchases' },
    { label: 'searches', value: 'searches' },
    { label: 'spotlight', value: 'spotlight' },
    { label: 'products', value: 'products' },
    { label: 'brands', value: 'brands' },
    { label: 'post', value: 'post' },
    { label: 'creator', value: 'creator' },
]

const SECTIONARRAY = [
    { label: 'Flex Start', value: 'flex-start' },
    { label: 'Flex End', value: 'flex-end' },
    { label: 'Center', value: 'center' },
    { label: 'Space Between', value: 'space-between' },
    { label: 'Space Around', value: 'space-around' },
    { label: 'Space Evenly', value: 'space-evenly' },
]

const borderStyleArray = [
    { label: 'Dotted', value: 'dotted' },
    { label: 'Solid', value: 'solid' },
    { label: 'Dashed', value: 'dashed' },
]

const SectionTypeArray = [
    { label: 'Generic', value: 'generic' },
    { label: 'Personalized', value: 'personalized' },
]

const FontSizeArray = [
    { label: 'Bold', value: 'bold' },
    { label: 'Regular', value: 'regular' },
    { label: 'Underline', value: 'underline' },
    { label: 'Italic', value: 'italic' },
]

interface CommonProps {
    setComponentOptions: any
    initialValue: any
    formikRef: any
    handleSubmit: any
    setBorderForm: any
    borderForm: any
    setSectioBorderShow: any
    sectionBorderShow: any
    setWebBorderForm: any
    webBorderForm: any
    setWebSectioBorderShow: any
    webSectionBorderShow: any
    setNameForm: any
    nameForm: any
    setFooterAlignForm: any
    footerAlignForm: any
    setWebNameForm: any
    webNameForm: any
    setWebFooterAlignForm: any
    webFooterAlignForm: any
    searchInput: any
    handleSearch: any
    currentSelectedPage: any
    handleSelect: any
    showTable: any
    handleActionClick: any
    productData: any
    setProductData: any
    postInput: any
    handlePOSTSearch: any
    showPostTable: any
    postTableData: any
    handlePostClick: any
    postData: any
    setPostData: any
    filters: any
    tableData: any
    editMode?: boolean
    handleRemoveImage?: any
    particularRow?: any
    handleRemoveHeaderImage?: any
    handleRemoveSubImage?: any
}

const CommonMainPageSettings = ({
    setComponentOptions,
    initialValue,
    formikRef,
    handleSubmit,
    setBorderForm,
    borderForm,
    setSectioBorderShow,
    sectionBorderShow,
    setWebBorderForm,
    webBorderForm,
    setWebSectioBorderShow,
    webSectionBorderShow,
    setNameForm,
    nameForm,
    setFooterAlignForm,
    footerAlignForm,
    setWebNameForm,
    webNameForm,
    setWebFooterAlignForm,
    webFooterAlignForm,
    searchInput,
    handleSearch,
    currentSelectedPage,
    handleSelect,
    showTable,
    handleActionClick,
    productData,
    setProductData,
    postInput,
    handlePOSTSearch,
    showPostTable,
    postTableData,
    handlePostClick,
    postData,
    setPostData,
    filters,
    tableData,
    editMode,
    handleRemoveImage,
    particularRow,
    handleRemoveHeaderImage,
    handleRemoveSubImage,
}: CommonProps) => {
    return (
        <Formik
            enableReinitialize
            initialValues={initialValue}
            innerRef={formikRef}
            // validationSchema={validationSchema}

            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form className="w-full ">
                    <FormContainer className="grid grid-cols-2 gap-3">
                        <FormItem asterisk label="Section Header" className="col-span-1 w-[60%] h-[80%]">
                            <Field type="text" name="section_heading" placeholder="Place your Section heading" component={Input} />
                        </FormItem>

                        <FormItem asterisk label="Component Types" className="col-span-1 w-[60%] h-[80%]">
                            <Field name="component_type">
                                {({ field, form }: FieldProps<any>) => {
                                    const componentOptions = COMPONENT_CATEGORY_TYPES

                                    return (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={componentOptions}
                                            value={componentOptions.find((option) => option.value === field.value)}
                                            onChange={(option) => {
                                                const value = option ? option.value : ''
                                                form.setFieldValue(field.name, value)
                                                setComponentOptions(value)
                                            }}
                                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>
                        {/* Generic Fields........................................................ */}

                        <div className=" grid grid-cols-2">
                            <div className="font-bold mt-1">Mobile Configurations :</div>
                            {genericComponentArray.slice(0, 19).map((item, key) => (
                                <FormItem key={key} label={item.label} className="w-2/3">
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}
                            <CommonSelect
                                name="component_config.font_style"
                                label="Font Style"
                                options={FontSizeArray}
                                needClassName
                                className="col-span-1 w-1/2"
                            />
                            <CommonSelect
                                name="component_config.footer_font_style"
                                label="Footer Font Style"
                                options={FontSizeArray}
                                needClassName
                                className="col-span-1 w-1/2"
                            />
                            <CommonSelect
                                name="component_config.section_alignment"
                                label="Section Alignment"
                                options={SECTIONARRAY}
                                needClassName
                                className=" col-span-1 w-1/2"
                            />
                            <CommonSelect
                                name="component_config.content_alignment"
                                label="Content Alignment"
                                options={SECTIONARRAY}
                                needClassName
                                className=" col-span-1 w-1/2"
                            />
                        </div>

                        <FormContainer className=" grid grid-cols-2">
                            <div className="font-bold mt-1">Web Configurations :</div>
                            {genericComponentArray.slice(19).map((item, key) => (
                                <FormItem key={key} label={item.label} className="w-2/3">
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}
                            <CommonSelect
                                name="component_config.web_font_style"
                                label="Font Style"
                                options={FontSizeArray}
                                needClassName
                                className="col-span-1 w-1/2"
                            />
                            <CommonSelect
                                name="component_config.web_footer_font_style"
                                label="Footer Font Style"
                                options={FontSizeArray}
                                needClassName
                                className="col-span-1 w-1/2"
                            />
                            <CommonSelect
                                name="component_config.web_section_alignment"
                                label="Web Section Alignment"
                                options={SECTIONARRAY}
                                needClassName
                                className=" col-span-1 w-1/2"
                            />
                            <CommonSelect
                                name="component_config.web_content_alignment"
                                label="Web Content Alignment"
                                options={SECTIONARRAY}
                                needClassName
                                className=" col-span-1 w-1/2"
                            />
                        </FormContainer>

                        <FormItem label="Border" className="col-span-1 w-1/4">
                            <Field
                                type="checkbox"
                                name="border"
                                placeholder="Enter border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('border', isChecked)
                                    setBorderForm(isChecked ? 'yes' : 'no')
                                }}
                            />
                            {borderForm === 'yes' && (
                                <FormContainer>
                                    <CommonSelect name="component_config.border_style" label="Border Style" options={borderStyleArray} />
                                    {borrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            )}
                        </FormItem>
                        {/* Section Border */}
                        <FormItem label="Section Border" className="col-span-1 w-1/4">
                            <Field
                                type="checkbox"
                                name="section_border"
                                placeholder="Enter section border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('section_border', isChecked)
                                    setSectioBorderShow(isChecked ? 'yes' : 'no')
                                }}
                            />
                            {sectionBorderShow === 'yes' && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.section_border_style"
                                        label="Section Border Style"
                                        options={borderStyleArray}
                                    />
                                    {sectionBorrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            )}
                            <CommonSelect
                                name="section_type"
                                label="Section Type"
                                options={SectionTypeArray}
                                needClassName
                                className=" col-span-1 w-1/2"
                            />
                        </FormItem>
                        <FormItem label="Web Border" className="col-span-1 w-1/4">
                            <Field
                                type="checkbox"
                                name="web_border"
                                placeholder="Enter border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('web_border', isChecked)
                                    setWebBorderForm(isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {webBorderForm === true && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_border_style"
                                        label="Web Border Style"
                                        options={borderStyleArray}
                                    />
                                    {webBorrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            )}
                        </FormItem>
                        {/* Web Section Border */}
                        <FormItem label="Web Section Border" className="col-span-1 w-1/4">
                            <Field
                                type="checkbox"
                                name="web_section_border"
                                placeholder="Enter web section border"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('web_section_border', isChecked)
                                    setWebSectioBorderShow(isChecked ? 'yes' : 'no')
                                }}
                            />
                            {webSectionBorderShow === 'yes' && (
                                <FormContainer>
                                    <CommonSelect
                                        name="component_config.web_section_border_style"
                                        label="Web Section Border Style"
                                        options={borderStyleArray}
                                    />
                                    {webBorrderStyleArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="w-full">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                </FormContainer>
                            )}
                        </FormItem>

                        {/*  */}

                        <FormItem label="Name" className="col-span-1 w-1/4">
                            <Field
                                type="checkbox"
                                name="name"
                                placeholder="Enter name"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('name', isChecked)
                                    setNameForm(isChecked) // Set borderForm to 'yes' or 'no'
                                }}
                            />{' '}
                            <br />
                            <br />
                            {nameForm && (
                                <>
                                    <CommonSelect label="Position" name="component_config.name_position" options={NAMEPOSITION} />
                                    <CommonSelect label="Align" name="component_config.name_align" options={ALIGNVALUES} />
                                </>
                            )}
                            <FormItem label="Footer" className="w-1/2">
                                <Field
                                    type="checkbox"
                                    name="name_footer"
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue('name_footer', isChecked)
                                        setFooterAlignForm(isChecked)
                                    }}
                                />

                                {footerAlignForm && (
                                    <>
                                        <CommonSelect
                                            label="Align Footer"
                                            name="component_config.name_footer_align"
                                            options={ALIGNVALUES}
                                        />
                                    </>
                                )}
                            </FormItem>
                        </FormItem>

                        <FormItem label="Web Name" className="col-span-1 w-1/4">
                            <Field
                                type="checkbox"
                                name="web_name"
                                component={Input}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    const isChecked = e.target.checked
                                    setFieldValue('web_name', isChecked)
                                    setWebNameForm(isChecked)
                                }}
                            />{' '}
                            <br />
                            <br />
                            {webNameForm === true && (
                                <>
                                    <CommonSelect label="Web position" name="component_config.web_name_position" options={NAMEPOSITION} />
                                    <CommonSelect label="Web Align" name="component_config.web_name_align" options={ALIGNVALUES} />
                                </>
                            )}
                            <FormItem label="Web Footer" className="w-1/2">
                                <Field
                                    type="checkbox"
                                    name="web_name_footer"
                                    component={Input}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const isChecked = e.target.checked
                                        setFieldValue('web_name_footer', isChecked)
                                        setWebFooterAlignForm(isChecked)
                                    }}
                                />

                                {webFooterAlignForm && (
                                    <>
                                        <CommonSelect
                                            label="Web Align Footer"
                                            name="component_config.web_name_footer_align"
                                            options={ALIGNVALUES}
                                        />
                                    </>
                                )}
                            </FormItem>
                        </FormItem>

                        {editMode ? (
                            <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                {initialValue.background_image ? (
                                    <div className="flex flex-col items-center justify-center w-[150px]">
                                        <img
                                            src={initialValue.background_image}
                                            alt={`Image `}
                                            className="w-[150px] h-[40px] flex object-contain "
                                        />
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
                                            {({ field, form }: FieldProps<WebType>) => (
                                                <>
                                                    <div className="font-semibold flex justify-center">Background Image</div>
                                                    <Upload
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.background_image_array} // uploadedd the file
                                                        onChange={(files) => form.setFieldValue('background_image_array', files)}
                                                        className="flex justify-center"
                                                        onFileRemove={(files) => form.setFieldValue('background_image_array', files)}
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
                                                        onChange={(files) => {
                                                            console.log('OnchangeFiles', files, field.name, values.background_image_array)
                                                            form.setFieldValue('background_image_array', files)
                                                        }}
                                                        className="items-center flex justify-center"
                                                        onFileRemove={(files) => form.setFieldValue('background_image_array', files)}
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
                                        <button
                                            className="text-red-500 text-md "
                                            onClick={() => handleRemoveImage('mobile_background_image')}
                                        >
                                            <MdCancel className="text-red-500 bg-none text-lg" />
                                        </button>
                                    </div>
                                ) : (
                                    'No Image'
                                )}
                                <FormContainer className=" mt-5 ">
                                    <FormItem label="" className="grid grid-rows-2">
                                        <Field name="mobile_background_array">
                                            {({ field, form }: FieldProps<WebType>) => (
                                                <>
                                                    <div className="font-semibold flex justify-center">Mobile Background Image</div>
                                                    <Upload
                                                        beforeUpload={beforeUpload}
                                                        fileList={values.mobile_background_array} // uploadedd the file
                                                        onChange={(files) => form.setFieldValue('mobile_background_array', files)}
                                                        className="flex justify-center"
                                                        onFileRemove={(files) => form.setFieldValue('mobile_background_array', files)}
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
                                                        onChange={(files) => {
                                                            console.log('OnchangeFiles', files, field.name, values.mobile_background_array)
                                                            form.setFieldValue('mobile_background_array', files)
                                                        }}
                                                        className="flex justify-center"
                                                        onFileRemove={(files) => form.setFieldValue('mobile_background_array', files)}
                                                    />
                                                </>
                                            )}
                                        </Field>
                                    </FormItem>
                                </FormContainer>
                            </FormContainer>
                        )}

                        {BackGroundArray.map((item, key) => (
                            <FormItem asterisk label={item.label} className="w-1/2" key={key}>
                                <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                            </FormItem>
                        ))}
                        <CommonSelect
                            name="background_config.desktop_position"
                            label="Web Position"
                            options={MobileAndDesktopPositions}
                            needClassName
                            className="w-1/2"
                        />

                        <CommonSelect
                            name="background_config.mobile_position"
                            label="Mobile Position"
                            options={MobileAndDesktopPositions}
                            needClassName
                            className="w-1/2"
                        />

                        {/* ............Header Config................................................. */}
                        <CommonSelect
                            name="header_config.style"
                            label="Header config Style"
                            options={FontSizeArray}
                            needClassName
                            className="col-span-1 w-1/2"
                        />
                        {HEADERCONFIGARRAY.map((item, key) => (
                            <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                                <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
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

                        {/* ................................................................................ */}
                        {/* .......sub_header....................... */}
                        <CommonSelect
                            name="sub_header_config.style"
                            label="Sub-Header config Style"
                            options={FontSizeArray}
                            needClassName
                            className="col-span-1 w-1/2"
                        />
                        {SUBHEADERCONFIGARRAY.map((item, key) => (
                            <FormItem asterisk label={item.label} className="col-span-1 w-[60%] h-[80%]" key={key}>
                                <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
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
                                <Field type={item.type} name={item.name} placeholder={`Enter ${item.label}`} component={Input} />
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

                        <CommonSelect
                            name="footer.position"
                            label="Footer position"
                            options={ALIGNVALUES}
                            needClassName
                            className="col-span-1 w-1/2"
                        />

                        <FormItem asterisk label="Data Type" className="col-span-1 w-[60%] h-[80%]">
                            <Field name="data_type.type">
                                {({ field, form }: FieldProps<any>) => {
                                    return (
                                        <Select
                                            field={field}
                                            form={form}
                                            options={dataTypeArray}
                                            value={dataTypeArray.find((option) => option.value === field.value)}
                                            onChange={(option) => {
                                                const value = option?.value || ''
                                                form.setFieldValue(field.name, value)
                                            }}
                                        />
                                    )
                                }}
                            </Field>
                        </FormItem>

                        <FormItem asterisk label="Filters" className="col-span-1 w-[60%] h-[80%]">
                            <Field type="text" name="data_type.filters" placeholder="Place your header Text" component={Input} />
                        </FormItem>

                        <FormContainer className="flex flex-col gap-4 ">
                            <div className="text-xl">Barcode</div>
                            <div className="flex gap-10">
                                <div className="flex justify-start ">
                                    <input
                                        type="search"
                                        name="search"
                                        id=""
                                        placeholder="search SKU for product"
                                        value={searchInput}
                                        className=" w-[250px] rounded-[10px]"
                                        onChange={handleSearch}
                                    />
                                </div>
                                <div className="bg-gray-200 rounded-[10px] font-bold text-lg ">
                                    <Dropdown
                                        className=" text-xl text-black bg-gray-200 font-bold "
                                        title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                        onSelect={handleSelect}
                                    >
                                        {DROPDOWNARRAY?.map((item, key) => {
                                            return (
                                                <DropdownItem key={key} eventKey={item.value}>
                                                    <span>{item.label}</span>
                                                </DropdownItem>
                                            )
                                        })}
                                    </Dropdown>
                                </div>
                            </div>

                            {showTable && searchInput && <CreatePostTable data={tableData} handleActionClick={handleActionClick} />}

                            <FormItem label="Barcodes" className="w-full flex gap-3">
                                <input
                                    disabled
                                    type="text"
                                    name="data_type.barcodes"
                                    value={productData}
                                    onChange={(e: any) => {
                                        setProductData(e.target.value)
                                        setFieldValue('products', e.target.value)
                                    }}
                                    placeholder="Enter product barcode"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setProductData([])
                                        setFieldValue('products', '')
                                    }}
                                >
                                    <MdCancel className="text-red-500 text-xl" />
                                </button>
                            </FormItem>
                        </FormContainer>

                        <FormContainer className="flex flex-col gap-4 ">
                            <div className="text-xl">Posts</div>
                            <div className="flex gap-10">
                                <div className="flex justify-start ">
                                    <input
                                        type="search"
                                        name="search"
                                        id=""
                                        placeholder="search SKU for product"
                                        value={postInput}
                                        className=" w-[250px] rounded-[10px]"
                                        onChange={handlePOSTSearch}
                                    />
                                </div>
                            </div>

                            {showPostTable && postInput && (
                                <PageSettingsPostTable data={postTableData} handleActionClick={handlePostClick} />
                            )}

                            <FormItem label="Posts" className="w-full flex gap-7">
                                <input
                                    disabled
                                    type="text"
                                    name="data_type.posts"
                                    value={postData}
                                    onChange={(e: any) => {
                                        setPostData(e.target.value)
                                        setFieldValue('products', e.target.value)
                                    }}
                                    placeholder="Enter product barcode"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPostData([])
                                        setFieldValue('products', '')
                                    }}
                                >
                                    <MdCancel className="text-red-500 text-xl" />
                                </button>
                            </FormItem>
                        </FormContainer>

                        {DATATYPEVALUES.map((item, key) => (
                            <FormItem label={item.label.toUpperCase()} className="col-span-1 w-[60%] h-[80%]" key={key}>
                                <Field
                                    type={item.type}
                                    name={item.name}
                                    placeholder={`place ${item.label.toUpperCase()}`}
                                    component={Input}
                                />
                            </FormItem>
                        ))}
                        <TagsEdit filterOptions={filters.filters} isValue />

                        {/* ..................................................... */}
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CommonMainPageSettings
