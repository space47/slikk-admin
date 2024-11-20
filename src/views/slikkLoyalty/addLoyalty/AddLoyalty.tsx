/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, FieldProps, Form, Formik } from 'formik'
import { notification } from 'antd'
// import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { IconArray, LoyaltyFieldArray, TierCondition, TierUpgradeConditionArray } from './LoyaltyCommon'
import LoyaltyAddoffer from './LoyaltyAddoffer'
import { useState } from 'react'
import LoadingSpinner from '@/common/LoadingSpinner'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'
import { Upload } from '@/components/ui'

const AddLoyalty = () => {
    // const navigate = useNavigate()
    const [showSpinner, setShowSpinner] = useState(false)

    const initialValue = {
        name: '',
        tier_upgrade_offer: [{ type: '', value: '', max_discount: '', min_discount: '', max_order_value: '', min_order_value: '' }],
        tier_upgrade_condition: {},
        discount: null,
        level: null,
        imageArray: [],
    }

    const handleSubmit = async (values: any) => {
        let imageUpload
        if (values.imageArray && values?.imageArray.length > 0) {
            imageUpload = await handleimage('product', values?.imageArray)
        }

        const { imageArray, ...rest } = values
        console.log(imageArray)

        const body = {
            ...rest,
            image: imageUpload,
            tier_upgrade_condition: {
                type: values?.tier_upgrade_condition.type,
                duration: values?.tier_upgrade_condition.duration || '',
                value: Number(values?.tier_upgrade_condition.value) || null,
            },
            tier_upgrade_offer:
                values.tier_upgrade_offer?.map((offer: any) => ({
                    type: offer.type || '',
                    value: Number(offer.value) || null,
                    max_discount: offer.max_discount !== undefined ? Number(offer.max_discount) : null,
                    min_order_value: Number(offer.min_order_value) || 0,
                    max_order_value: Number(offer.max_order_value) || null,
                })) || [],
        }

        try {
            setShowSpinner(true)
            const response = await axioisInstance.post(`/loyalty`, body)
            notification.success({
                message: response?.data?.message || 'Successfully added loyalty',
            })
        } catch (error: any) {
            console.error(error)
            notification.error({
                message: error?.response?.data?.message || 'Failed to add Loyalty',
            })
        } finally {
            setShowSpinner(false)
        }
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div>
            <h3 className="mb-5 from-neutral-900">ADD Loyalty</h3>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => (
                    <Form className="w-2/3">
                        <FormContainer className="p-6 bg-white rounded-lg">
                            <h2 className="text-xl font-semibold mb-6">Loyalty Configuration</h2>
                            <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <FormContainer>
                                    <div className="w-[200px]">
                                        <CommonSelect name="name" label="Select Name" options={IconArray} className="w-full" />
                                    </div>

                                    {LoyaltyFieldArray.map((item, key) => (
                                        <FormItem key={key} label={item.label} className="col-span-1 w-full">
                                            <Field
                                                type={item?.type}
                                                name={item.name}
                                                placeholder={`Enter ${item.label}`}
                                                component={Input}
                                                className="w-1/2"
                                            />
                                        </FormItem>
                                    ))}
                                </FormContainer>

                                {/* Tier Upgrade Condition */}
                                <FormContainer className="col-span-2">
                                    <h3 className="text-lg font-medium mb-4">Tier Upgrade Condition</h3>
                                    <div className="w-[200px]">
                                        <CommonSelect
                                            name="tier_upgrade_condition.type"
                                            label="Select Tier Type"
                                            options={TierCondition}
                                            className="w-1/2 mb-4"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {TierUpgradeConditionArray.map((item, key) => (
                                            <FormItem key={key} label={item.label} className="w-full">
                                                <Field
                                                    type={item?.type}
                                                    name={item.name}
                                                    placeholder={`Enter ${item.label}`}
                                                    component={Input}
                                                    className="w-1/2"
                                                />
                                            </FormItem>
                                        ))}
                                    </div>
                                </FormContainer>
                            </FormContainer>

                            <h3>Image:</h3>

                            <FormItem label="" className="mt-4">
                                <Field name="imageArray">
                                    {({ form }: FieldProps<any>) => (
                                        <Upload
                                            multiple
                                            beforeUpload={beforeUpload}
                                            fileList={values.imageArray}
                                            onChange={(files) => form.setFieldValue('imageArray', files)}
                                            onFileRemove={(files) => form.setFieldValue('imageArray', files)}
                                        />
                                    )}
                                </Field>
                            </FormItem>

                            <LoyaltyAddoffer values={values} />

                            <FormContainer className="flex justify-end mt-8 space-x-4">
                                <Button type="reset" onClick={() => resetForm()}>
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit">
                                    Submit
                                </Button>
                            </FormContainer>
                        </FormContainer>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default AddLoyalty
