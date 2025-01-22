/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { offerFormArray } from '../offerEngineCommon'
import { Field, FieldProps } from 'formik'
import { MdCancel } from 'react-icons/md'
import { beforeUpload } from '@/common/beforeUpload'
import { FaSearch } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import CommonSelectByLabel from '@/common/CommonSelectByLabel'
import FullDateForm from '@/common/FullDateForm'
import SearchStrings from '@/common/SearchStrings'
import { FILTER_STATE } from '@/store/types/filters.types'
import { StoreDetails } from '@/store/types/companyStore.types'

const apply_offer_type_array = [
    { label: 'In Sets of Minimum Quantity', value: 'MIN_QTY_SETS' },
    { label: 'Greater than or Equal to Minimum Quantity', value: 'GTE_MIN_QTY' },
]
const apply_price_type_array = [
    { label: 'MOST EXPENSIVE', value: 'MOST_EXPENSIVE' },
    { label: 'LEAST EXPENSIVE', value: 'LEAST_EXPENSIVE' },
]
const offerType_array = [
    { label: 'PERCENT OFF', value: 'PERCENTOFF' },
    { label: 'FLAT OFF', value: 'FLATOFF' },
    { label: 'FLAT PRICE', value: 'FLATPRICE' },
    { label: 'BILL BUSTER', value: 'BILLBUSTER' },
    { label: 'BUY X GET Y', value: 'BXGY' },
]

const daysOfWeek_array = [
    { label: 'Monday', value: '1' },
    { label: 'Tuesday', value: '2' },
    { label: 'Wednesday', value: '3' },
    { label: 'Thursday', value: '4' },
    { label: 'Friday', value: '5' },
    { label: 'Saturday', value: '6' },
    { label: 'Sunday', value: '7' },
]

interface props {
    skuInput: string
    setSkuInput: React.Dispatch<React.SetStateAction<string>>
    showAddFilter: any[]
    filters: Record<any, any>[]
    handleAddFilter: () => void
    handleAddFilters: (values: any) => Promise<void>
    handleRemoveFilter: (index: number) => void
    values?: any
    initialValue?: any
    editMode?: boolean
    handleRemoveImage?: any
    handleAddSku: () => void
    skuSearchData: any[]
    columns: (
        | {
              header: string
              accessorKey: string
              cell: ({ row }: any) => JSX.Element
          }
        | {
              header: string
              accessorKey: string
              cell?: undefined
          }
        | {
              header: string
              cell: ({ row }: any) => JSX.Element
              accessorKey?: undefined
          }
    )[]
    storeResults: StoreDetails[]
}

const AddOfferCommon = ({
    setSkuInput,
    skuInput,
    showAddFilter,
    filters,
    handleAddFilter,
    handleAddFilters,
    handleRemoveFilter,
    values,
    initialValue,
    editMode,
    handleRemoveImage,
    handleAddSku,
    skuSearchData,
    columns,
    storeResults,
}: props) => {
    return (
        <div className="">
            <FormContainer className="grid grid-cols-2 gap-4">
                {offerFormArray?.map((item, key) => {
                    return (
                        <FormItem key={key} label={item?.label}>
                            <Field
                                name={item?.name}
                                type={item?.type}
                                placeholder={`Enter ${item?.label}`}
                                component={Input}
                                className="w-3/4"
                            />
                        </FormItem>
                    )
                })}
                <FormItem label="Days">
                    <div className="flex">
                        <Field name="days">
                            {({ field, form }: FieldProps<any>) => {
                                // Convert the string value to an array of objects
                                const selectedValue = field.value
                                    ? field.value.split(',').map((val: string) => daysOfWeek_array.find((option) => option.value === val))
                                    : []

                                return (
                                    <Select
                                        isMulti
                                        placeholder="Days"
                                        className="w-3/4"
                                        value={selectedValue}
                                        options={daysOfWeek_array}
                                        getOptionLabel={(option) => option.label}
                                        getOptionValue={(option) => option.value}
                                        onChange={(newVal) => {
                                            // Convert the selected values to a comma-separated string
                                            const newValues = newVal ? newVal.map((val) => val.value).join(',') : ''
                                            form.setFieldValue(field.name, newValues)
                                        }}
                                    />
                                )
                            }}
                        </Field>
                    </div>
                </FormItem>

                <CommonSelectByLabel
                    label="Apply Offer Type"
                    name="apply_offer_type"
                    fieldname="apply_offer_type"
                    options={apply_offer_type_array}
                />

                <CommonSelectByLabel
                    label="Apply Price Type"
                    name="apply_price_type"
                    fieldname="apply_price_type"
                    options={apply_price_type_array}
                />
                <CommonSelectByLabel label="Offer Type" name="offer_type" fieldname="offer_type" options={offerType_array} />
                <FullDateForm label="Start Date" name="start_date" fieldname="start_date" />
                <FullDateForm label="End Date" name="end_date" fieldname="end_date" />

                <div>
                    <h2>Product Selection</h2>
                    <br />
                    <div className="">
                        <div className="mb-4 w-full gap-7">
                            <label className="block text-gray-700">SKU</label>
                            <div className="flex gap-2 items-center">
                                <input
                                    name="sku"
                                    type="search"
                                    placeholder="Enter SKU"
                                    className="w-1/2 border border-gray-300 rounded p-2"
                                    value={skuInput}
                                    onChange={(e) => setSkuInput(e.target.value)}
                                />
                                <div>
                                    <FaSearch className="text-2xl cursor-pointer" onClick={handleAddSku} />
                                </div>
                            </div>
                            <br />
                            <div className="xl:w-[800px]">
                                <EasyTable mainData={skuSearchData} columns={columns} overflow />
                            </div>
                        </div>
                        <br />
                        <br />
                        <SearchStrings
                            handleAddFilter={handleAddFilter}
                            showAddFilter={showAddFilter}
                            handleAddFilters={handleAddFilters}
                            handleRemoveFilter={handleRemoveFilter}
                            filters={filters}
                        />

                        {editMode ? (
                            <div>
                                <span className="text-[16px] font-bold">Image</span>
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    {initialValue.image ? (
                                        <div className="flex flex-col items-center justify-center w-[150px]">
                                            <img
                                                src={initialValue.image}
                                                alt={`Image `}
                                                className="w-[150px] h-[40px] flex object-contain "
                                            />
                                            <button className="text-red-500 text-md " onClick={() => handleRemoveImage('image')}>
                                                <MdCancel className="text-red-500 bg-none text-lg" />
                                            </button>
                                        </div>
                                    ) : (
                                        'No Image'
                                    )}
                                    <FormContainer className=" ">
                                        <FormItem label="" className="grid grid-rows-2">
                                            <Field name="imageList">
                                                {({ form }: FieldProps<any>) => (
                                                    <>
                                                        <div className="font-semibold flex justify-center">Image</div>
                                                        <Upload
                                                            beforeUpload={beforeUpload}
                                                            fileList={values.imageList} // uploadedd the file
                                                            className="flex justify-center"
                                                            onFileRemove={(files) => form.setFieldValue('imageList', files)}
                                                            onChange={(files) => form.setFieldValue('imageList', files)}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                            </div>
                        ) : (
                            <div>
                                <span className="text-[16px] font-bold">Image</span>
                                <FormContainer className="bg-gray-200 bg-opacity-40 flex justify-center flex-col w-[500px] items-center h-[160px] rounded-xl mb-2 overflow-scroll scrollbar-hide">
                                    <FormContainer className=" mt-5 ">
                                        <FormItem label="" className="grid grid-rows-2">
                                            <Field name="image">
                                                {({ field, form }: FieldProps<any>) => (
                                                    <>
                                                        <Upload
                                                            beforeUpload={beforeUpload}
                                                            fileList={values.image}
                                                            className="items-center flex justify-center"
                                                            onFileRemove={(files) => form.setFieldValue('image', files)}
                                                            onChange={(files) => {
                                                                form.setFieldValue('image', files)
                                                            }}
                                                        />
                                                    </>
                                                )}
                                            </Field>
                                        </FormItem>
                                    </FormContainer>
                                </FormContainer>
                            </div>
                        )}

                        <FormItem label="Store ">
                            <Field name="store_code">
                                {({ form, field }: FieldProps<any>) => {
                                    console.log('field value for store code', field?.value)
                                    const selectedCompany = storeResults.find((option) => option.id === field?.value)

                                    return (
                                        <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                            <Select
                                                className="w-full"
                                                options={storeResults}
                                                getOptionLabel={(option) => option.code}
                                                getOptionValue={(option) => option.id}
                                                value={selectedCompany || null}
                                                onChange={(newVal) => {
                                                    form.setFieldValue('store_code', newVal?.id)
                                                }}
                                            />
                                        </div>
                                    )
                                }}
                            </Field>
                        </FormItem>
                    </div>
                </div>
            </FormContainer>
        </div>
    )
}

export default AddOfferCommon
