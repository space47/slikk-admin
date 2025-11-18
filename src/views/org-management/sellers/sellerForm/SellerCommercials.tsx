/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Select, Switcher } from '@/components/ui'
import { Input } from 'antd'
import { Field, FieldProps } from 'formik'
import { NOBOptions, SellerCommercialsArray } from '../sellerUtils/sellerFormCommon'
import { SegmentOptions } from '@/constants/commonArray.constant'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'

const SellerCommercials = () => {
    return (
        <div className="w-full">
            <h4>MsMe Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                {SellerCommercialsArray?.map((item, idx) => {
                    return (
                        <FormItem key={idx} label={item?.label} asterisk={item?.isRequired}>
                            <Field
                                type={item?.type}
                                name={item?.name}
                                placeholder={`Enter ${item?.label}`}
                                component={item?.type === 'checkbox' ? Switcher : Input}
                            />
                        </FormItem>
                    )
                })}
            </FormContainer>
            <FormItem asterisk label="Segment" className="col-span-1 w-full">
                <Field name="segment">
                    {({ field, form }: FieldProps) => {
                        const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value?.split(',') || []
                        const selectedOptions = fieldValueArray?.map((item: any) => {
                            const selectedOption = SegmentOptions()?.find((options: any) => {
                                return options?.label === item
                            })
                            return selectedOption
                        })
                        return (
                            <Select
                                isMulti
                                isClearable
                                className="w-full"
                                options={SegmentOptions()}
                                getOptionLabel={(option) => option?.label}
                                getOptionValue={(option) => option?.value?.toString()}
                                value={selectedOptions}
                                onChange={(newVals) => {
                                    const selectedValues = newVals?.map((val: any) => val.value) || []
                                    form.setFieldValue(`segment`, selectedValues?.join(','))
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
            <CommonSelect name="business_nature" options={NOBOptions()} label="Nature of Business" />
        </div>
    )
}

export default SellerCommercials
