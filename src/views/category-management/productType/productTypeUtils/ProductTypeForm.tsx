/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { Field, FormikErrors } from 'formik'
import { FormContainer, FormItem, Input, Switcher } from '@/components/ui'
import NestedCategorySelection from '@/common/NestedCategorySelection'
import RichTextCommon from '@/common/RichTextCommon'
import { HiOutlineInformationCircle, HiOutlineCollection, HiOutlineDocumentText } from 'react-icons/hi'
import BannerFilterTags from '@/views/appsSettings/banners/editBanner/component/BannerFilterTags'
import PageEditVideo from '@/views/appsSettings/pageSettings/PageEditVideo'
import PageAddVideo from '@/views/appsSettings/pageSettings/PageAddVideo'
import { beforeUpload } from '@/common/beforeUpload'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'

interface Props {
    editMode?: boolean
    values?: any
    initialValue?: any
    setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => Promise<void | FormikErrors<any>>
    setInitialValue?: any
}

const GenderArray = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
]

const ProductTypeForm = ({ setFieldValue, values, editMode, initialValue, setInitialValue }: Props) => {
    return (
        <div className="space-y-6">
            <FormContainer className="bg-white rounded-2xl shadow-sm border border-l-4 border-l-blue-600 p-5">
                <div className="flex items-center gap-2 mb-4 text-blue-700 font-semibold">
                    <HiOutlineInformationCircle className="text-lg" />
                    <span>Basic Details</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormItem label="Name">
                        <Field name="name" component={Input} placeholder="Enter category name" type="text" />
                    </FormItem>
                    <FormItem label="Title">
                        <Field name="title" component={Input} placeholder="Enter display title" type="text" />
                    </FormItem>
                    <FormItem label="Position">
                        <Field name="position" component={Input} placeholder="Enter position" type="number" />
                    </FormItem>
                    <CommonSelect name="gender" options={GenderArray} label="Gender" />
                    <BannerFilterTags label="Quick Filter Tags" name="quick_filter_tags" />
                    <FormItem label="Active Status">
                        <Field name="is_active" component={Switcher} type="checkbox" />
                    </FormItem>

                    <FormItem label="Try & Buy">
                        <Field name="is_try_and_buy" component={Switcher} type="checkbox" />
                    </FormItem>
                </div>
            </FormContainer>
            <FormContainer className="bg-white rounded-2xl shadow-sm border border-l-4 border-l-purple-600 p-5">
                <div className="flex items-center gap-2 mb-4 text-purple-700 font-semibold">
                    <HiOutlineCollection className="text-lg" />
                    <span>Category Mapping</span>
                </div>
                <NestedCategorySelection isSub values={values} setFieldValue={setFieldValue} />
            </FormContainer>
            <FormContainer className="bg-white rounded-2xl shadow-sm border border-l-4 border-l-green-600 p-5">
                {editMode ? (
                    <PageEditVideo
                        isImage
                        label="Image"
                        rowName={initialValue?.image}
                        removeName="image"
                        handleRemoveVideo={() => {
                            setFieldValue('image', '')
                            setFieldValue('image_array', [])
                            setInitialValue({
                                ...initialValue,
                                image: '',
                                image_array: [],
                            })
                        }}
                        name="image_array"
                        beforeVideoUpload={beforeUpload}
                        fileList={values?.image_array}
                        fieldName="image_array"
                    />
                ) : (
                    <PageAddVideo
                        label="Image"
                        name="image_array"
                        fieldName="image_array"
                        fileList={values.image_array}
                        beforeUpload={beforeUpload}
                    />
                )}
            </FormContainer>
            <FormContainer className="bg-white rounded-2xl shadow-sm border border-l-4 border-l-amber-500 p-5">
                <div className="flex items-center gap-2 mb-4 text-amber-700 font-semibold">
                    <HiOutlineDocumentText className="text-lg" />
                    <span>Content</span>
                </div>
                <div className="space-y-5">
                    <RichTextCommon label="Description" name="description" />
                    <RichTextCommon label="Footer" name="footer" />
                </div>
            </FormContainer>
        </div>
    )
}

export default ProductTypeForm
