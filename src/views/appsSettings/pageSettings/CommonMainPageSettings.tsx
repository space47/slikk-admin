/* eslint-disable @typescript-eslint/no-explicit-any */
import { COMPONENT_CATEGORY_TYPES } from '@/common/banner'
import { Button, Dropdown, FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Form, Formik } from 'formik'
import React, { useState } from 'react'
import { DROPDOWNARRAY } from '@/views/category-management/catalog/CommonType'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import PageSettingsPostTable from './PageSettingsPostTable'
import { MdCancel } from 'react-icons/md'
import { DATATYPEVALUES } from './configurationCommon'
import TagsEdit from './TagsEdit'
import PageComponentConfig from './PageComponentConfig'
import OtherConfigs from './OtherConfigs'
import BackGroundImages from './BackGroundImages'

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
    const [otherFields, setOtherFields] = useState(false)
    const [bgFields, setBgFields] = useState(false)

    console.log('fields check', configFields, otherFields, bgFields)

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

                        <div className="flex justify-center items-center mt-10 mb-10">
                            <Button variant="new" onClick={() => setBgFields((prev) => !prev)}>
                                Background Fields
                            </Button>
                        </div>
                        {bgFields && (
                            <BackGroundImages
                                editMode={editMode}
                                initialValue={initialValue}
                                handleRemoveImage={handleRemoveImage}
                                values={values}
                            />
                        )}

                        {/* ............Header Config................................................. */}

                        <div className="flex justify-center items-center mt-10 mb-10">
                            <Button variant="new" onClick={() => setOtherFields((prev) => !prev)}>
                                Other Configs
                            </Button>
                        </div>
                        {otherFields && (
                            <OtherConfigs
                                editMode={editMode}
                                particularRow={particularRow}
                                values={values}
                                handleRemoveHeaderImage={handleRemoveHeaderImage}
                                handleRemoveImage={handleRemoveImage}
                                handleRemoveSubImage={handleRemoveSubImage}
                            />
                        )}
                        <FormContainer className="grid grid-cols-2 gap-3">
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
                                <Field
                                    type="text"
                                    name="data_type.filters"
                                    placeholder="Place your header Text"
                                    component={Input}
                                    min="0"
                                />
                            </FormItem>
                        </FormContainer>

                        <FormContainer className="grid grid-cols-2 gap-3">
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
                        </FormContainer>

                        <FormContainer className="grid grid-cols-2 gap-3">
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
                        </FormContainer>
                        <TagsEdit filterOptions={filters.filters} isValue />

                        {/* ..................................................... */}
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CommonMainPageSettings
