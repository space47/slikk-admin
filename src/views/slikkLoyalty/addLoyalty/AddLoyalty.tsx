// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FormItem, FormContainer } from '@/components/ui/Form'
// import Input from '@/components/ui/Input'
// import Button from '@/components/ui/Button'
// import Select from '@/components/ui/Select'
// import { Field, Form, Formik, FieldProps, FieldArray } from 'formik'
// import * as Yup from 'yup'
// import { useState } from 'react'
// import { notification } from 'antd'
// import { useNavigate } from 'react-router-dom'
// import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
// import { IconArray, LoyaltyFieldArray, TierCondition, TierOffer, TierOfferArray, TierUpgradeConditionArray } from './LoyaltyCommon'

// const AddLoyalty = () => {
//     const navigate = useNavigate()

//     const initialValue = {}

//     const handleSubmit = async (values: any) => {
//         const body = {
//             ...values,
//             tier_upgrade_condition: {
//                 type: values?.tier_upgrade_condition.type,
//                 duration: values?.tier_upgrade_condition.duration || '',
//                 value: Number(values?.tier_upgrade_condition.value) || null,
//             },
//             tier_upgrade_offer:
//                 values.tier_upgrade_offer?.map((offer: any) => ({
//                     type: offer.type || '',
//                     value: Number(offer.value) || null,
//                     max_discount: offer.max_discount !== undefined ? Number(offer.max_discount) : null,
//                     min_order_value: Number(offer.min_order_value) || 0,
//                     max_order_value: Number(offer.max_order_value) || null,
//                 })) || [],
//         }

//         console.log('Body of Loyalty', body)
//     }

//     return (
//         <div>
//             <h3 className="mb-5 from-neutral-900">ADD Loyalty</h3>
//             <Formik
//                 enableReinitialize
//                 initialValues={initialValue}
//                 // validationSchema={validationSchema}
//                 onSubmit={handleSubmit}
//             >
//                 {({ values, resetForm, setFieldValue }) => (
//                     <Form className="w-2/3">
//                         <FormContainer className="p-6 bg-white  rounded-lg">
//                             {/* Form Header */}
//                             <h2 className="text-xl font-semibold mb-6">Loyalty Configuration</h2>

//                             {/* Main Form Grid */}
//                             <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                                 {/* Icon Selection */}
//                                 <CommonSelect name="icon" label="Select Icon" options={IconArray} className="w-full" />

//                                 {/* Loyalty Fields */}
//                                 {LoyaltyFieldArray.map((item, key) => (
//                                     <FormItem key={key} label={item.label} className="col-span-1 w-full">
//                                         <Field
//                                             type={item?.type}
//                                             name={item.name}
//                                             placeholder={`Enter ${item.label}`}
//                                             component={Input}
//                                             className="w-full"
//                                         />
//                                     </FormItem>
//                                 ))}

//                                 {/* Tier Upgrade Condition */}
//                                 <FormContainer className="col-span-2">
//                                     <h3 className="text-lg font-medium mb-4">Tier Upgrade Condition</h3>
//                                     <CommonSelect
//                                         name="tier_upgrade_condition.type"
//                                         label="Select Tier Type"
//                                         options={TierCondition}
//                                         className="w-1/2 mb-4"
//                                     />
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                         {TierUpgradeConditionArray.map((item, key) => (
//                                             <FormItem key={key} label={item.label} className="w-full">
//                                                 <Field
//                                                     type={item?.type}
//                                                     name={item.name}
//                                                     placeholder={`Enter ${item.label}`}
//                                                     component={Input}
//                                                     className="w-full"
//                                                 />
//                                             </FormItem>
//                                         ))}
//                                     </div>
//                                 </FormContainer>

//                                 {/* Tier Offer */}
//                                 {/* <FormContainer className="col-span-2">
//                                     <h3 className="text-lg font-medium mb-4">Tier Upgrade Offer</h3>
//                                     <CommonSelect name="type" label="Select Tier Type" options={TierOffer} className="w-full mb-4" />
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                                         {TierOfferArray.map((item, key) => (
//                                             <FormItem key={key} label={item.label} className="w-full">
//                                                 <Field
//                                                     type={item?.type}
//                                                     name={item.name}
//                                                     placeholder={`Enter ${item.label}`}
//                                                     component={Input}
//                                                     className="w-full"
//                                                 />
//                                             </FormItem>
//                                         ))}
//                                     </div>
//                                 </FormContainer> */}

//  <FieldArray name="config_value">
//                                     {({ push }) => (
//                                         <div>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => {
//                                                     if (values.component_type === 'object') {
//                                                         push({ key: '', value: '' })
//                                                     } else {
//                                                         push('')
//                                                     }
//                                                 }}
//                                                 className="mt-3 bg-none border-none "
//                                             >
//                                                 <IoIosAddCircle className="text-green-600 text-xl" />
//                                             </button>

//                                             {Array.isArray(values.config_value) &&
//                                                 values.config_value.map((item: any, index: number) => (
//                                                     <div key={index} className="flex space-x-4 mt-2">

//                                                                 <Field
//                                                                     name={`config_value[${index}].key`}
//                                                                     placeholder="Key"
//                                                                     component={Input}
//                                                                     className="w-1/2"
//                                                                 />
//                                                                 <Field
//                                                                     name={`config_value[${index}].value`}
//                                                                     placeholder="Value"
//                                                                     component={Input}
//                                                                     className="w-1/2"
//                                                                 />

//                                                 ))}
//                                         </div>
//                                     )}
//                                 </FieldArray>
//                             </FormContainer>

//                             {/* Form Actions */}
//                             <FormContainer className="flex justify-end mt-8 space-x-4">
//                                 <Button
//                                     type="reset"
//                                     className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
//                                     onClick={() => resetForm()}
//                                 >
//                                     Reset
//                                 </Button>
//                                 <Button
//                                     variant="solid"
//                                     type="submit"
//                                     className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                                 >
//                                     Submit
//                                 </Button>
//                             </FormContainer>
//                         </FormContainer>
//                     </Form>
//                 )}
//             </Formik>
//         </div>
//     )
// }

// export default AddLoyalty
