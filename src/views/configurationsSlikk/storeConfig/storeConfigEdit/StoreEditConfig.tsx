/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { Button, Checkbox, FormContainer, FormItem, Input } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate, useParams } from 'react-router-dom'
import { notification } from 'antd'
import _ from 'lodash'
import LoadingSpinner from '@/common/LoadingSpinner'
import { handleimage } from '@/common/handleImage'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { ConfigInterface, EDITFIELDSARRAY } from '../../configg/componentsConfigg/commonConfigTypes'
import RenderFields from '../../configg/componentsConfigg/RenderLogic'

const EditConfigurations = () => {
    const navigate = useNavigate()
    const [editConfigData, setEditConfigData] = useState<ConfigInterface | null>(null)
    const [showSpinner, setShowSpinner] = useState(false)
    const { id } = useParams()
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const selectedCompany = useAppSelector<USER_PROFILE_DATA>((store) => store.company)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const fetchConfigurationApi = async () => {
        try {
            const response = await axiosInstance.get(`/store/configuration?config_id=${id}`)
            setEditConfigData(response.data?.config || null)
        } catch (error) {
            console.error('Error fetching configuration:', error)
        }
    }

    useEffect(() => {
        if (id) fetchConfigurationApi()
    }, [id])

    const handleSubmit = async (values: ConfigInterface) => {
        const processValues = async (obj: any): Promise<any> => {
            if (Array.isArray(obj)) {
                return Promise.all(obj.map(processValues))
            }
            if (_.isPlainObject(obj)) {
                const entries = await Promise.all(
                    Object.entries(obj).map(async ([key, val]: any) => {
                        const value = key.includes('DLT_NUMBER')
                            ? val
                            : /^[0-9]+$/.test(val)
                              ? Number(val)
                              : val === 'true'
                                ? true
                                : val === 'false'
                                  ? false
                                  : val

                        console.log('Values to check is  number', value)
                        if (key.toLowerCase().includes('image') && Array.isArray(val)) {
                            const processedImage = await handleimage('product', val)
                            if (processedImage === 'Error') {
                                notification.error({ message: 'Imagey failed to upload' })
                                return
                            }
                            return [key, processedImage]
                        }
                        if (key.toLowerCase().includes('lottie') && Array.isArray(val)) {
                            const processedLottie = await handleimage('product', val)
                            if (processedLottie === 'Error') {
                                notification.error({ message: 'Lottie failed to upload' })
                                return
                            }
                            return [key, processedLottie]
                        }
                        if (_.isPlainObject(val) || Array.isArray(val)) {
                            return [key, await processValues(value)]
                        }
                        return [key, value]
                    }),
                )
                return Object.fromEntries(entries as any)
            }
            return obj
        }

        const body = {
            is_active: values?.is_active,
            config_name: values.name,
            config_value: await processValues(values.value),
        }

        try {
            setShowSpinner(true)
            const response = await axiosInstance.post('/store/configuration', body)
            notification.success({ message: response.data?.message || 'Successfully Configured' })
            navigate(-1)
        } catch (error) {
            console.error('Submit Error:', error)
            notification.error({ message: 'Failed to configure' })
        } finally {
            setShowSpinner(false)
        }
    }

    if (showSpinner) {
        return <LoadingSpinner />
    }

    return (
        <div className="w-full shadow-xl p-4 rounded-xl">
            <Formik
                enableReinitialize
                initialValues={
                    editConfigData || {
                        id: '',
                        name: '',
                        is_active: false,
                        last_updated_by: selectedCompany?.mobile || '',
                        create_date: '',
                        update_date: '',
                        value: {},
                    }
                }
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <Form className="w-4/5">
                        <FormContainer>
                            <h5 className="mb-5 text-neutral-900">Edit Configurations</h5>

                            {EDITFIELDSARRAY?.map((item) => (
                                <FormItem key={item.name} label={item.label} className="col-span-1 w-1/2">
                                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                </FormItem>
                            ))}
                            <FormItem label="Last Updated By" className="col-span-1 w-1/2">
                                <Field disabled type="text" name="last_updated_by" placeholder="Enter updated by" component={Input} />
                            </FormItem>
                            <FormItem label="Is Active" className="col-span-1 w-1/2">
                                <Field type="checkbox" name="is_active" placeholder="Enter updated by" component={Checkbox} />
                            </FormItem>

                            <FormContainer className="grid grid-cols-1 gap-10">
                                <RenderFields
                                    obj={values.value}
                                    parentKey="value"
                                    setFieldValue={setFieldValue}
                                    editableKeys={editableKeys}
                                    setEditableKeys={setEditableKeys}
                                    filters={filters}
                                />
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
