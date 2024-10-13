// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { FormItem, FormContainer } from '@/components/ui/Form'
// import Input from '@/components/ui/Input'
// import Button from '@/components/ui/Button'
// // import Select from '@/components/ui/Select'
// import { Field, Form, Formik } from 'formik' // Add FieldProps here
// // import * as Yup from 'yup'

// import { notification } from 'antd'
// import { useNavigate } from 'react-router-dom'
// import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { URLARRAY, URLTYPES, initialValueForUrl } from './urlShortner.common'

// const EditUrlShortner = () => {
//     const navigate = useNavigate()

//     const fetchUrlData = async()=>{
//         try {
//             const response = await axioisInstance.get(``)

//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleSubmit = async (values: URLTYPES) => {
//         console.log('handleSubmit')
//         const formData = {
//             ...values,
//         }

//         console.log('formData', formData)

//         try {
//             const response = await axioisInstance.post('/short_url/create', formData)

//             console.log(response)
//             notification.success({
//                 message: 'Success',
//                 description: response?.data?.message || 'Url Shortner created Successfully',
//             })
//         } catch (error: any) {
//             console.error('Error submitting form:', error)
//             notification.error({
//                 message: 'Failure',
//                 description: error?.response?.data?.message || 'Failed to create Url Shortner',
//             })
//         }
//     }

//     return (
//         <div>
//             <h3 className="mb-5 from-neutral-900">Create Url Shortner</h3>
//             <Formik
//                 enableReinitialize
//                 initialValues={initialValueForUrl}
//                 // validationSchema={validationSchema}
//                 onSubmit={handleSubmit}
//             >
//                 {(
//                     { resetForm }, //  values, touched, errors, resetForm, setFieldValue
//                 ) => (
//                     <Form className="w-2/3">
//                         <FormContainer>
//                             <FormContainer className="grid grid-cols-2 gap-10">
//                                 {URLARRAY.map((item, key) => (
//                                     <FormItem key={key} label={item.label} className={item.classname}>
//                                         <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
//                                     </FormItem>
//                                 ))}
//                             </FormContainer>
//                             {/* ------------------------------------------------------------------------------------------------ */}

//                             <FormContainer className="flex justify-end mt-5">
//                                 <Button type="reset" className="mr-2 bg-gray-600" onClick={() => resetForm()}>
//                                     Reset
//                                 </Button>
//                                 <Button variant="solid" type="submit" className=" text-white">
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

// export default EditUrlShortner
