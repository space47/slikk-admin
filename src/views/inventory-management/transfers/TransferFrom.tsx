import { Button, FormContainer, FormItem, Select } from '@/components/ui'
import React from 'react'
import { TransferFormArray } from './transferCommon'
import { Field, FieldProps } from 'formik'
import { DatePicker } from 'antd'
import moment from 'moment'
import { StoreDetails } from '@/store/types/companyStore.types'

interface props {
    storeResults: StoreDetails[]
    values: any
}

const TransferFrom = ({ storeResults, values }: props) => {
    return (
        <div>
            <FormContainer className="grid grid-cols-2 gap-4">
                {TransferFormArray.map((item, key) => {
                    return (
                        <FormItem key={key} label={item?.label}>
                            <Field name={item?.name} type={item?.type} placeholder={`Enter ${item?.label}`} />
                        </FormItem>
                    )
                })}
                <FormItem label="Date Received">
                    <Field name="date_received">
                        {({ field, form }: any) => (
                            <DatePicker
                                showTime
                                placeholder=""
                                value={field.value ? dayjs(field.value, 'YYYY-MM-DD HH:mm:ss') : null}
                                onChange={(value) => {
                                    form.setFieldValue('date_received', value ? value.format('YYYY-MM-DD HH:mm:ss') : '')
                                }}
                            />
                        )}
                    </Field>
                </FormItem>
                <FormItem label="Store Code">
                    <Field name="store_code">
                        {({ form, field }: FieldProps<any>) => {
                            const selectedCompany = storeResults.find((option) => option.code === field?.value?.code)

                            return (
                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                    <Select
                                        className="w-1/2"
                                        options={storeResults}
                                        getOptionLabel={(option) => option.code}
                                        getOptionValue={(option) => option.code}
                                        value={selectedCompany || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue('store_code', newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>

                {/*  */}
                <FormItem label="Destination Store Code">
                    <Field name="destination_store_code">
                        {({ form, field }: FieldProps<any>) => {
                            console.log('Field Value', field?.value?.code)
                            const selectedCompany = storeResults.find((option) => option.code === field?.value?.code)

                            return (
                                <div className="flex flex-col gap-1 items-center xl:items-baseline w-full max-w-md">
                                    <div className="font-semibold"></div>
                                    <Select
                                        className="w-1/2"
                                        options={storeResults}
                                        getOptionLabel={(option) => option.code}
                                        getOptionValue={(option) => option.code}
                                        value={selectedCompany || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue('destination_store_code', newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>
                <FormContainer>
                    <FormItem className="mt-5">
                        <Button type="submit" variant="solid">
                            Submit
                        </Button>
                    </FormItem>
                </FormContainer>
            </FormContainer>
        </div>
    )
}

export default TransferFrom
