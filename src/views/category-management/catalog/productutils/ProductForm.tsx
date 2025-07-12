/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import { SegmentOptions } from '@/constants/commonArray.constant'
import { Field, FieldProps } from 'formik'
import React, { Dispatch, SetStateAction } from 'react'
import { DescriptionFields, PRODUCT_EDIT_COMMON, PRODUCT_EDIT_COMMON_DOWN } from '../ProductCommon'
import { RichTextEditor } from '@/components/shared'
import ImageCommonProduct from '../ImageCommonProduct'
import AddProductImages from '../AddProductImages'
import { beforeUpload } from '@/common/beforeUpload'
import { beforeVideoUpload } from '@/common/beforUploadVideo'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

interface props {
    isEdit?: boolean
    companyList: SINGLE_COMPANY_DATA[]
    setDomainWatcher: Dispatch<SetStateAction<string | string[] | undefined>>
    setCompanyData: Dispatch<SetStateAction<number | undefined>>
    values: any
    segmentKeys: string[] | undefined
    handleRemove?: (
        e: React.MouseEvent<HTMLButtonElement>,
        index: number,
        type: 'images' | 'color_code' | 'video' | 'size_chart_image_array',
    ) => void
    allImage?: string[] | undefined
    setAllImage?: (x: string[]) => void
    allColor?: string[] | undefined
    setAllColor?: (x: string[]) => void
    allVideo?: string[] | undefined
    setAllVideo?: (x: string[]) => void
    allSizeChart?: string[] | undefined
    setAllSizeChart?: (x: string[]) => void
    allName?: string[]
    initialValues?: any
    setFieldValue?: any
}

const ProductFormCommon = ({
    companyList,
    isEdit,
    setCompanyData,
    setDomainWatcher,
    values,
    segmentKeys,
    handleRemove,
    allColor,
    allImage,
    allSizeChart,
    allVideo,
    setAllColor,
    setAllImage,
    setAllSizeChart,
    initialValues,
}: props) => {
    return (
        <div>
            <FormContainer className="grid grid-cols-2 gap-2">
                <FormItem label="Company">
                    <Field name="company">
                        {({ form }: FieldProps<any>) => {
                            const selectedCompany = companyList.find((option) => option.id === form.values.company)
                            return (
                                <div className="flex flex-col gap-1 items-center xl:items-baseline ">
                                    <Select
                                        className="w-full"
                                        options={companyList}
                                        getOptionLabel={(option) => option.name}
                                        getOptionValue={(option) => option.id}
                                        value={selectedCompany || null}
                                        onChange={(newVal) => {
                                            form.setFieldValue('company', newVal?.id)
                                            form.setFieldValue('domains', newVal?.segment)
                                            setDomainWatcher(newVal?.segment)
                                            setCompanyData(newVal?.id)
                                        }}
                                    />
                                </div>
                            )
                        }}
                    </Field>
                </FormItem>
                <FormItem label="Domains" className="col-span-1">
                    <Field name="domains">
                        {({ field, form }: FieldProps) => {
                            const fieldValueArray = Array.isArray(field?.value) ? field?.value : field?.value?.split(',')
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
                                        setDomainWatcher(selectedValues)
                                        form.setFieldValue(`domains`, selectedValues)
                                    }}
                                />
                            )
                        }}
                    </Field>
                </FormItem>
            </FormContainer>
            <FormContainer className="mt-2">
                <div className="grid xl:grid-cols-2 grid-cols-1 gap-4">
                    {PRODUCT_EDIT_COMMON?.map((item, key) => (
                        <FormItem key={key} label={item.label} className={item.classname}>
                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                        </FormItem>
                    ))}
                    {PRODUCT_EDIT_COMMON_DOWN?.map((item, key) => (
                        <FormItem key={key} label={item.label} className={item.classname}>
                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={item.component} />
                        </FormItem>
                    ))}
                    {/* {initialValues?.description &&
                        Object.entries(initialValues?.description)?.map(([key]) => {
                            return (
                                <FormItem key={key} label={key} className="col-span-1 w-full">
                                    <Field name={`description.${key}`}>
                                        {({ field, form }: FieldProps) => (
                                            <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                        )}
                                    </Field>
                                </FormItem>
                            )
                        })} */}

                    {DescriptionFields?.map((item, key) => (
                        <FormItem key={key} label={item?.label} className="col-span-1 w-full">
                            <Field name={item?.name}>
                                {({ field, form }: FieldProps) => (
                                    <RichTextEditor value={field.value} onChange={(val) => form.setFieldValue(field.name, val)} />
                                )}
                            </Field>
                        </FormItem>
                    ))}

                    {isEdit ? (
                        <>
                            <ImageCommonProduct
                                label="image"
                                allName={allImage || []}
                                handleRemove={handleRemove}
                                name="images"
                                fieldname="images"
                                fileLists={values.images}
                                textName="image"
                                placeholder="Enter Image Url"
                                setAllName={setAllImage}
                            />
                            <ImageCommonProduct
                                label="Color Code Thumbnail"
                                allName={allColor || []}
                                handleRemove={handleRemove}
                                name="color_code"
                                fieldname="color_code"
                                fileLists={values.color_code}
                                textName="color_code_link"
                                placeholder="Enter color code Url"
                                setAllName={setAllColor}
                            />
                            <ImageCommonProduct
                                isVideo
                                label="Video"
                                allName={allVideo || []}
                                handleRemove={handleRemove}
                                name="video"
                                fieldname="video"
                                fileLists={values.video}
                                textName="video_link"
                                placeholder="Enter Video Url"
                            />
                            <ImageCommonProduct
                                label="Size Chart Image"
                                allName={allSizeChart || []}
                                handleRemove={handleRemove}
                                name="size_chart_image_array"
                                fieldname="size_chart_image_array"
                                fileLists={values.size_chart_image_array}
                                textName="size_chart_image"
                                placeholder="Enter Size Chart Image"
                                setAllName={setAllSizeChart}
                            />
                        </>
                    ) : (
                        <>
                            <AddProductImages
                                label="Image"
                                name="image"
                                fileList={values.images}
                                beforeUpload={beforeUpload}
                                fieldNames="images"
                            />
                            <AddProductImages
                                label="Color Code Thumbnail"
                                name="color_code_link"
                                fileList={values.color_code}
                                beforeUpload={beforeUpload}
                                fieldNames="color_code"
                            />
                            <AddProductImages
                                label="Video"
                                name="video_link"
                                fileList={values.video}
                                beforeUpload={beforeVideoUpload}
                                fieldNames="video"
                            />
                            <AddProductImages
                                label="Size Chart Upload"
                                name="size_chart_image"
                                fileList={values.size_chart_image_array}
                                beforeUpload={beforeUpload}
                                fieldNames="size_chart_image_array"
                            />
                        </>
                    )}
                </div>
                <hr />
                <FormItem label="Tags Fields" className="mt-5"></FormItem>
                <FormContainer className="grid grid-cols-2 gap-2">
                    {segmentKeys?.map((item, key) => {
                        return (
                            <FormItem key={key} label={item} className="">
                                <Field type="text" name={item} placeholder={`Enter ${item}`} component={Input} />
                            </FormItem>
                        )
                    })}
                </FormContainer>
                {initialValues?.filter_tags && (
                    <>
                        {Object.entries(initialValues.filter_tags).map(([key, value], index) => {
                            const joinedValue = Array.isArray(value) ? value.join(', ') : value

                            return (
                                <FormItem key={index} label={key} className="col-span-1 w-full">
                                    <Field name={key}>
                                        {({ field, form }: FieldProps) => (
                                            <Input
                                                {...field}
                                                placeholder={key}
                                                value={field.value || joinedValue}
                                                onChange={(e) => form.setFieldValue(key, e.target.value)}
                                            />
                                        )}
                                    </Field>
                                </FormItem>
                            )
                        })}
                    </>
                )}
            </FormContainer>
        </div>
    )
}

export default ProductFormCommon
