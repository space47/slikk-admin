/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { ConfigInterface, EDITFIELDSARRAY } from './commonConfigTypes'
import { Field, Form, Formik } from 'formik'
import { Button, FormContainer, FormItem, Input, Spinner } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate, useParams } from 'react-router-dom'
import { notification } from 'antd'
import _ from 'lodash'
import LoadingSpinner from '@/common/LoadingSpinner'

const EditConfigurations = () => {
    const navigate = useNavigate()
    const [editConfigData, setEditConfigData] = useState<ConfigInterface | null>(null)
    const [showSpinner, setShowSpinner] = useState(false)
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

    const renderFields = (obj: any, parentKey: string, setFieldValue: any) => {
        return Object.entries(obj).map(([key, val]) => {
            const fieldName = parentKey ? `${parentKey}.${key}` : key

            if (_.isPlainObject(val)) {
                return (
                    <div key={fieldName} className="col-span-2">
                        <div className="text-xl font-semibold mb-1">{key}</div>
                        <div className="grid grid-cols-2 gap-4">{renderFields(val, fieldName, setFieldValue)}</div>
                    </div>
                )
            } else {
                return (
                    <FormItem key={fieldName} label={key} className="col-span-1 w-full">
                        <Field
                            component={Input}
                            type="text"
                            placeholder={`Enter ${key}`}
                            name={fieldName}
                            value={val}
                            onChange={(e: any) => setFieldValue(fieldName, e.target.value)}
                        />
                    </FormItem>
                )
            }
        })
    }

    const handleSubmit = async (values: ConfigInterface) => {
        const body = {
            config_name: values.name,
            config_value: values.value,
        }

        try {
            setShowSpinner(true)
            const response = await axiosInstance.post(`/app/configuration`, body)
            notification.success({
                message: response?.data?.message || 'Successfully Configured',
            })
            navigate(`/app/configurations`)
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failed to configure ',
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
            <Formik
                enableReinitialize
                initialValues={
                    editConfigData || {
                        id: '',
                        name: '',
                        is_active: false,
                        last_updated_by: '',
                        create_date: '',
                        update_date: '',
                        value: {},
                    }
                }
                onSubmit={handleSubmit}
            >
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
                                {renderFields(values.value, 'value', setFieldValue)}
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
