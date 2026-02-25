/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select } from '@/components/ui'
import { useAppSelector } from '@/store'
import { vendorService } from '@/store/services/vendorService'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'
import { VendorList } from '@/store/types/vendor.type'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'

interface Props {
    label: string
    name: string
    customCss?: string
    isSingle?: boolean
}

const WarehouseSelect = ({ label, name, customCss, isSingle = false }: Props) => {
    const [warehouseList, setWarehouseList] = useState<VendorList['gst_details']>([])
    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)
    const { data, isError, isSuccess } = vendorService.useGetSingleVendorListQuery(
        { id: selectedCompany?.id },
        { skip: !selectedCompany?.id },
    )

    useEffect(() => {
        if (isSuccess) {
            setWarehouseList(data?.data?.gst_details)
        }
        if (isError) {
            setWarehouseList([])
        }
    }, [isSuccess, isError, data])

    return (
        <div>
            <FormContainer>
                <FormItem label={label}>
                    <Field name={name}>
                        {({ form, field }: FieldProps) => {
                            const getFieldValueId = (value: any) => {
                                return typeof value === 'object' && value !== null ? value.id : value
                            }
                            const selectedValue = isSingle
                                ? warehouseList?.find((option) => option.id == getFieldValueId(field.value))
                                : warehouseList?.filter((option) => field.value?.some((store: any) => getFieldValueId(store) == option.id))

                            return (
                                <div className="flex flex-col gap-1 w-full max-w-md">
                                    <Select
                                        isMulti={!isSingle}
                                        className={customCss ?? 'w-full'}
                                        options={warehouseList}
                                        getOptionLabel={(option) => option.warehouse_name}
                                        getOptionValue={(option) => option.id.toString()}
                                        value={selectedValue || []}
                                        onChange={(newVal) => {
                                            form.setFieldValue(name, newVal)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default WarehouseSelect
