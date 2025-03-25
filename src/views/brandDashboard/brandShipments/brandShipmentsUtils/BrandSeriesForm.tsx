/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Select, Upload } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import { RichTextEditor } from '@/components/shared'
import { DatePicker } from 'antd'
import moment from 'moment'
import { beforeUpload } from '@/common/beforeUpload'
import CommonMultiSelect from '@/common/CommonMultiSelect'
import { useAppDispatch, useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import FullDateForm from '@/common/FullDateForm'
import { BrandShipentForms } from './brandShipmentsCommon'
import { companyStore } from '@/store/types/companyStore.types'
import { fetchCompanyStore } from '@/store/slices/companyStoreSlice/companyStore.slice'
import { useEffect } from 'react'

interface CouponProps {
    values: any
    ACTIONARRAY?: any
    userAction?: any
    setUserAction?: any
    setFieldValue?: any
    resetForm?: any
    isEdit?: any
}

const BrandShipmentsForm = ({ values, setFieldValue }: CouponProps) => {
    const dispatch = useAppDispatch()
    const { storeResults } = useAppSelector((state: { companyStore: companyStore }) => state.companyStore)

    useEffect(() => {
        dispatch(fetchCompanyStore())
    }, [dispatch])

    console.log('store Results', storeResults)

    const isDashboard = import.meta.env.VITE_DASHBOARD_TYPE !== 'brand'
    console.log('isDashboard', isDashboard)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    return (
        <Form className="">
            <FormContainer>
                <FormContainer className="grid grid-cols-2 gap-10">
                    <FormItem label="Select Company" className={'col-span-1 w-full'}>
                        <Field name="company">
                            {({ form }: FieldProps<any>) => {
                                const selectedCompany = companyList.find((option) => option.id === form.values.company)

                                return (
                                    <div className="flex flex-col gap-2 w-full max-w-md">
                                        <Select
                                            isClearable
                                            className="w-full px-3 py-2 border  rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                                            options={companyList}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            value={selectedCompany || null}
                                            onChange={(newVal) => {
                                                form.setFieldValue('company', newVal?.id)
                                            }}
                                        />
                                    </div>
                                )
                            }}
                        </Field>
                    </FormItem>

                    <FormContainer className="bg-blue-300 p-2 bg-opacity-40 flex justify-center flex-col items-center rounded-xl mb-4 overflow-scroll scrollbar-hide ">
                        <div className="font-bold text-blue-700">Upload Documents</div>
                        <FormContainer className=" mt-5 w-full ">
                            <FormItem label="" className="grid grid-rows-2">
                                <Field name="itemsArray">
                                    {({ form }: FieldProps) => (
                                        <>
                                            <Upload
                                                multiple
                                                className="flex justify-center"
                                                beforeUpload={beforeUpload}
                                                fileList={values.itemsArray}
                                                onChange={(files) => form.setFieldValue('itemsArray', files)}
                                                onFileRemove={(files) => form.setFieldValue('itemsArray', files)}
                                            />
                                        </>
                                    )}
                                </Field>
                            </FormItem>
                            <br />
                        </FormContainer>
                    </FormContainer>
                    {/* 
                    <FormItem label="Upload Single Items Items" className="col-span-1 w-[80%] rounded-xl ">
                        <Field type="text" name="items" placeholder="Enter Items manually" component={Input} />
                    </FormItem> */}
                    {BrandShipentForms?.map((item, key) => (
                        <FormItem key={key} label={item.label} className="col-span-1 w-full">
                            <Field type={item.type} name={item?.name} placeholder={`Place ${item.label}`} component={Input} />
                        </FormItem>
                    ))}

                    <FullDateForm fieldname="dispatch_date" label="Dispatch Date" name="dispatch_date" />

                    <FormItem label="Origin Address">
                        <Field name="origin_address">
                            {({ field, form }: FieldProps) => (
                                <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                            )}
                        </Field>
                    </FormItem>
                    <FormItem label="Delivery Address">
                        <Field name="delivery_address">
                            {({ field, form }: FieldProps) => (
                                <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                            )}
                        </Field>
                    </FormItem>

                    {isDashboard && (
                        <>
                            <CommonMultiSelect
                                isId
                                needCss
                                isOnchange
                                label="Store"
                                name="store"
                                options={storeResults}
                                className="w-3/4 mt-2"
                                onChangeValue={(newVal) =>
                                    setFieldValue(
                                        'store',
                                        newVal?.map((item: any) => item.id),
                                    )
                                }
                            />

                            <FormItem label="Select Users" className="col-span-1 w-full">
                                <Field name="received_by">
                                    {({ field, form }: FieldProps<any>) => {
                                        const selectedOptions = values?.store
                                            ?.map((item: any) => {
                                                return storeResults?.find((option: any) => option.id === item)?.users
                                            })
                                            ?.flat()

                                        return (
                                            <div className="flex flex-col gap-2 w-full">
                                                <Select
                                                    isClearable
                                                    className="w-full "
                                                    options={selectedOptions || []}
                                                    getOptionLabel={(option) => option?.name || 'Unknown'}
                                                    getOptionValue={(option) => option?.mobile || ''}
                                                    onChange={(val) => form.setFieldValue('received_by', val)}
                                                />
                                            </div>
                                        )
                                    }}
                                </Field>
                            </FormItem>
                        </>
                    )}
                </FormContainer>
            </FormContainer>
        </Form>
    )
}

export default BrandShipmentsForm
