/* eslint-disable @typescript-eslint/no-explicit-any */
import { COMPONENT_CATEGORY_TYPES } from '@/common/banner'
import { Button, Dropdown, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useState } from 'react'
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
import PageComponentConfig from './PageComponentConfig'

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
    const [configFields, setConfigFields] = useState(false)

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
                    <FormContainer className="">
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
                        </FormContainer>
                        {/* Generic Fields........................................................ */}

                        <div className="flex justify-center items-center mt-10 mb-10">
                            <Button variant="new" onClick={() => setConfigFields((prev) => !prev)}>
                                Component Configs
                            </Button>
                        </div>

                        {configFields && (
                            <PageComponentConfig
                                FontSizeArray={FontSizeArray}
                                SECTIONARRAY={SECTIONARRAY}
                                borderForm={borderForm}
                                setBorderForm={setBorderForm}
                                setFieldValue={setFieldValue}
                                setSectioBorderShow={setSectioBorderShow}
                                sectionBorderShow={sectionBorderShow}
                                setWebBorderForm={setWebBorderForm}
                                webBorderForm={webBorderForm}
                                setWebSectioBorderShow={setWebSectioBorderShow}
                                webSectionBorderShow={webSectionBorderShow}
                                setNameForm={setNameForm}
                                nameForm={nameForm}
                                setFooterAlignForm={setFooterAlignForm}
                                footerAlignForm={footerAlignForm}
                                setWebNameForm={setWebNameForm}
                                webNameForm={webNameForm}
                                setWebFooterAlignForm={setWebFooterAlignForm}
                                webFooterAlignForm={webFooterAlignForm}
                            />
                        )}

                        <FormContainer className="grid grid-cols-2 gap-3">
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
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.background_image_array,
                                                                )
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
                                                                console.log(
                                                                    'OnchangeFiles',
                                                                    files,
                                                                    field.name,
                                                                    values.mobile_background_array,
                                                                )
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
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} min="0" />
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
                        </FormContainer>
                        {/* ............Header Config................................................. */}
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
                                    <Field
                                        type={item.type}
                                        name={item.name}
                                        placeholder={`Enter ${item.label}`}
                                        component={Input}
                                        min="0"
                                    />
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
                                    <Field
                                        type={item.type}
                                        name={item.name}
                                        placeholder={`Enter ${item.label}`}
                                        component={Input}
                                        min="0"
                                    />
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
                                    <Field
                                        type={item.type}
                                        name={item.name}
                                        placeholder={`Enter ${item.label}`}
                                        component={Input}
                                        min="0"
                                    />
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
                        </FormContainer>
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
                            <Field type="text" name="data_type.filters" placeholder="Place your header Text" component={Input} min="0" />
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
