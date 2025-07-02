/* eslint-disable @typescript-eslint/no-explicit-any */
import { COMPONENT_CATEGORY_TYPES } from '@/common/banner'
import { Checkbox, Dropdown, FormContainer, FormItem, Input, Select, Tabs } from '@/components/ui'
import { ErrorMessage, Field, FieldProps, Form, Formik } from 'formik'
import { DROPDOWNTYPE } from '@/views/category-management/catalog/CommonType'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import PageSettingsPostTable from './PageSettingsPostTable'
import { MdCancel } from 'react-icons/md'
import { CommonProps, DATATYPEVALUES, FontSizeArray, SECTIONARRAY, SectionTypeArray } from './configurationCommon'
import TagsEdit from './TagsEdit'
import PageComponentConfig from './PageComponentConfig'
import OtherConfigs from './OtherConfigs'
import BackGroundImages from './BackGroundImages'
import CommonSelect from './CommonSelect'
import ExtraConfigFileds from './ExtraConfigFileds'
import DataTypes from './DataTypes'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import ChildComponentConfig from './ChildComponentConfig'

const CommonMainPageSettings = ({
    setComponentOptions,
    initialValue,
    formikRef,
    handleSubmit,
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
    handleRemoveVideo,
    validationSchema,
    handleAddFilter,
    showAddFilter,
    handleAddFilters,
    handleRemoveFilter,
    handleRemoveExploreImage,
}: CommonProps) => {
    const TabsArray = [
        { label: 'Component Config', value: 'Component' },
        { label: 'Background config', value: 'bg_config' },
        { label: 'Other Config', value: 'other_config' },
        { label: 'Child Comp Config', value: 'child_comp_config' },
        { label: 'Extra Config', value: 'extra_config' },
        { label: 'Data Type Config', value: 'data_type_config' },
    ]

    return (
        <Formik
            enableReinitialize
            initialValues={initialValue}
            innerRef={formikRef}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {({ values, setFieldValue }) => (
                <Form className="w-full h-[600px] overflow-scroll">
                    <FormContainer className="">
                        <FormContainer className="grid grid-cols-2 gap-3">
                            <FormItem asterisk label="Section Header" className="col-span-1 w-[60%] h-[80%]">
                                <Field type="text" name="section_heading" placeholder="Place your Section heading" component={Input} />
                                <ErrorMessage name="section_heading" component="div" className="text-red-700" />
                            </FormItem>

                            <FormItem asterisk label="Component Types" className="col-span-1 w-[60%] h-[80%]">
                                <Field name="component_type">
                                    {({ field, form }: FieldProps<any>) => {
                                        const componentOptions = COMPONENT_CATEGORY_TYPES
                                        console.log('values are', !!values?.extra_info?.child_data_type)
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

                        <Tabs defaultValue="tab1">
                            <TabList className="flex items-center justify-center font-bold bg-gray-100 p-2 rounded-2xl ">
                                {!!values?.extra_info?.child_data_type === true ? (
                                    <>
                                        {TabsArray.map((tab, index) => (
                                            <TabNav key={index} value={tab?.value} className="hover:text-green-500">
                                                {tab?.label}
                                            </TabNav>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {TabsArray.filter((tab) => tab.value !== 'child_comp_config').map((tab, index) => (
                                            <TabNav key={index} value={tab?.value} className="hover:text-green-500">
                                                {tab?.label}
                                            </TabNav>
                                        ))}
                                    </>
                                )}
                            </TabList>
                            <div className="p-4 mt-5">
                                <TabContent value="Component">
                                    <PageComponentConfig
                                        values={values}
                                        FontSizeArray={FontSizeArray}
                                        SECTIONARRAY={SECTIONARRAY}
                                        setFieldValue={setFieldValue}
                                    />
                                </TabContent>

                                {!!values?.extra_info?.child_data_type === true && (
                                    <TabContent value="child_comp_config">
                                        <ChildComponentConfig
                                            FontSizeArray={FontSizeArray}
                                            SECTIONARRAY={SECTIONARRAY}
                                            setFieldValue={setFieldValue}
                                            values={values}
                                        />
                                    </TabContent>
                                )}

                                <TabContent value="bg_config">
                                    <BackGroundImages
                                        editMode={editMode}
                                        initialValue={initialValue}
                                        handleRemoveImage={handleRemoveImage}
                                        values={values}
                                        handleRemoveVideo={handleRemoveVideo}
                                    />
                                </TabContent>
                                <TabContent value="other_config">
                                    <OtherConfigs
                                        editMode={editMode}
                                        particularRow={particularRow}
                                        values={values}
                                        handleRemoveHeaderImage={handleRemoveHeaderImage}
                                        handleRemoveImage={handleRemoveImage}
                                        handleRemoveSubImage={handleRemoveSubImage}
                                        handleRemoveExploreImage={handleRemoveExploreImage}
                                    />
                                </TabContent>

                                <TabContent value="extra_config">
                                    <ExtraConfigFileds />
                                </TabContent>
                                <TabContent value="data_type_config">
                                    <DataTypes
                                        handleAddFilter={handleAddFilter}
                                        handleAddFilters={handleAddFilters}
                                        showAddFilter={showAddFilter}
                                        handleRemoveFilter={handleRemoveFilter}
                                        values={values}
                                    />
                                </TabContent>
                            </div>
                        </Tabs>
                        <hr className="font-bold mb-5 mt-5 " />

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
                                            className=" xl:w-[550px] rounded-[10px]"
                                            onChange={handleSearch}
                                        />
                                    </div>
                                    <div className="bg-gray-200 rounded-[10px] font-bold text-lg ">
                                        <Dropdown
                                            className=" text-xl text-black bg-gray-200 font-bold "
                                            title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                            onSelect={handleSelect}
                                        >
                                            {DROPDOWNTYPE?.map((item, key) => {
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
                                        type="text"
                                        name="data_type.barcodes"
                                        className="w-[80%]"
                                        value={productData}
                                        placeholder="Enter product barcode"
                                        onChange={(e: any) => {
                                            setProductData(e.target.value)
                                            setFieldValue('products', e.target.value)
                                        }}
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
                                            className="xl:w-[550px] rounded-[10px]"
                                            onChange={handlePOSTSearch}
                                        />
                                    </div>
                                </div>

                                {showPostTable && postInput && (
                                    <PageSettingsPostTable data={postTableData} handleActionClick={handlePostClick} />
                                )}

                                <FormItem label="Posts" className="w-full flex gap-7">
                                    <input
                                        type="text"
                                        className="w-[80%]"
                                        name="data_type.posts"
                                        placeholder="Enter product barcode"
                                        value={postData}
                                        onChange={(e: any) => {
                                            setPostData(e.target.value)
                                            setFieldValue('products', e.target.value)
                                        }}
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
                        <CommonSelect
                            needClassName
                            name="section_type"
                            label="Section Type"
                            options={SectionTypeArray}
                            className=" col-span-1 w-1/4"
                        />

                        <FormContainer className="grid grid-cols-2 gap-3">
                            {DATATYPEVALUES.map((item, key) => (
                                <FormItem label={item.label.toUpperCase()} className="w-full" key={key}>
                                    <Field
                                        type={item.type}
                                        name={item.name}
                                        placeholder={`PLACE ${item.label.toUpperCase()}`}
                                        component={Input}
                                    />
                                </FormItem>
                            ))}
                        </FormContainer>
                        <FormContainer className="grid grid-cols-2 gap-2">
                            <FormItem label="Order Count" className="w-full">
                                <Field type="number" name="order_count" placeholder="Enter order count" component={Input} min="0" />
                            </FormItem>
                            <FormItem label="Min Order Value for Event Pass" className="w-full">
                                <Field
                                    type="number"
                                    name="extra_info.min_order_value_for_event_pass"
                                    placeholder="Enter min order value for event pass"
                                    component={Input}
                                    min="0"
                                />
                            </FormItem>
                        </FormContainer>
                        <FormItem label="Is Section Clickable" className="col-span-1 w-[60%] h-[80%]">
                            <Field type="checkbox" name="is_section_clickable" placeholder="" component={Checkbox} />
                        </FormItem>
                        <FormItem label="Is Section Active" className="col-span-1 w-[60%] h-[80%]">
                            <Field type="checkbox" name="is_section_active" placeholder="" component={Checkbox} />
                        </FormItem>

                        {values?.is_section_clickable && <TagsEdit isValue filterOptions={filters.filters} />}
                    </FormContainer>
                </Form>
            )}
        </Formik>
    )
}

export default CommonMainPageSettings
