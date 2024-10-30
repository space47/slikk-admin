import React, { useEffect, useState } from 'react'
import { ConfigInterface, EDITFIELDSARRAY } from './commonConfigTypes'
import { Field, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useParams } from 'react-router-dom'
import NestedObjectComponent from './NestedObjectComp'
import { notification } from 'antd'

const EditConfigurations = () => {
    const [editConfigData, setEditConfigData] = useState<ConfigInterface | null>(null)
    const { id } = useParams()

    const fetchConfigurationApi = async () => {
        try {
            const response = await axiosInstance.get(`/app/configuration?config_id=${id}`)
            const apiData = response.data?.config
            setEditConfigData(apiData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchConfigurationApi()
    }, [id])

    const initialValues: ConfigInterface = editConfigData || {
        id: '',
        name: '',
        is_active: false,
        last_updated_by: '',
        create_date: '',
        update_date: '',
        value: {}, // initialize `value` as an empty object for default state
    }

    const handleSubmit = async (values: ConfigInterface) => {
        console.log('All values', values)
        const body = {
            config_name: values.name,
            config_value: values.value,
        }
        console.log('BODY', body)

        try {
            const response = await axiosInstance.post(`/app/configuration`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Configured',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to configure ',
            })
        }
    }

    return (
        <div>
            <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => (
                    <Form className="w-2/3">
                        <FormContainer>
                            <h5 className="mb-5 text-neutral-900">Edit Configurations</h5>

                            {EDITFIELDSARRAY.map((item, key) => (
                                <FormItem key={key} label={item.label} className="col-span-1 w-1/2">
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}

                            <FormContainer className="grid grid-cols-2 gap-10">
                                {/* Pass only the `value` object to NestedObjectComponent */}
                                <NestedObjectComponent obj={values.value} setFieldValue={setFieldValue} />
                            </FormContainer>

                            <FormContainer className="flex justify-end mt-5">
                                <Button type="reset" className="mr-2">
                                    Reset
                                </Button>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
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

export default EditConfigurations
