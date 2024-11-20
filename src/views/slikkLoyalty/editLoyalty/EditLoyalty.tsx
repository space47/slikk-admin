/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, FormContainer } from '@/components/ui/Form'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Field, Form, Formik } from 'formik'
import { notification } from 'antd'
// import { useNavigate } from 'react-router-dom'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { IconArray, LoyaltyFieldArray, TierCondition, TierUpgradeConditionArray } from '../addLoyalty/LoyaltyCommon'
import LoyaltyAddoffer from '../addLoyalty/LoyaltyAddoffer'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { TierData } from '@/store/types/slikkLoyalty'
import LoadingSpinner from '@/common/LoadingSpinner'
import ImageComponent from '@/views/appsSettings/banners/editBanner/component/ImageComponent'
import { beforeUpload } from '@/common/beforeUpload'
import { handleimage } from '@/common/handleImage'

const EditLoyalty = () => {
    // const navigate = useNavigate()
    const [loyalityData, setLoyalityData] = useState<TierData>()
    const [imageView, setImageView] = useState<string[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const { name } = useParams()

    console.log('Name is', name)

    const fetchLoyalty = async () => {
        try {
            const response = await axioisInstance.get(`/loyalty?name=${name}`)
            const data = response?.data?.data
            setLoyalityData(data[0])
            setImageView(data[0]?.image ? [data[0].image] : [])
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchLoyalty()
    }, [])

    const initialValue = {
        name: loyalityData?.name,
        tier_upgrade_offer: loyalityData?.tier_upgrade_offer?.map((item) => ({
            type: item?.type || '',
            value: item?.value || null,
            max_discount: item?.max_discount || null,
            min_discount: item?.min_discount || null,
            max_order_value: item?.max_order_value || null,
            min_order_value: item?.min_order_value || null,
        })),
        tier_upgrade_condition: {
            type: loyalityData?.tier_upgrade_condition?.type || '',
            duration: loyalityData?.tier_upgrade_condition?.duration || '',
            value: loyalityData?.tier_upgrade_condition?.value || null,
        },
        discount: loyalityData?.discount || null,
        level: loyalityData?.level || null,
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
                type: values?.tier_upgrade_condition?.type,
                duration: values?.tier_upgrade_condition?.duration || '',
                value: Number(values?.tier_upgrade_condition?.value) || null,
            },
            tier_upgrade_offer:
                values.tier_upgrade_offer?.map((offer: any) => ({
                    type: offer?.type || '',
                    value: Number(offer?.value) || null,
                    max_discount: offer?.max_discount !== undefined ? Number(offer?.max_discount) : null,
                    min_order_value: Number(offer?.min_order_value) || 0,
                    max_order_value: Number(offer?.max_order_value) || null,
                })) || [],
        }

        try {
            setShowSpinner(true)
            const response = await axioisInstance.patch(`/loyalty`, body)
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

    const handleImageRemove = (index: number) => {
        setImageView((item) => item.filter((_, id) => id !== index))
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

                                    {LoyaltyFieldArray?.map((item, key) => (
                                        <FormItem key={key} label={item?.label} className="col-span-1 w-full">
                                            <Field
                                                type={item?.type}
                                                name={item?.name}
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {TierUpgradeConditionArray?.map((item, key) => (
                                            <FormItem key={key} label={item.label} className="w-full">
                                                <Field
                                                    type={item?.type}
                                                    name={item?.name}
                                                    placeholder={`Enter ${item?.label}`}
                                                    component={Input}
                                                    className="w-1/2"
                                                />
                                            </FormItem>
                                        ))}
                                    </div>
                                </FormContainer>
                            </FormContainer>
                            <h3 className="text-lg font-medium mb-4">Image:</h3>
                            <ImageComponent
                                imageView={imageView}
                                imageremove="imageArray"
                                handleImageRemove={handleImageRemove}
                                name="imageArray"
                                beforeUpload={beforeUpload}
                                fileList={values.imageArray}
                            />

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

export default EditLoyalty
