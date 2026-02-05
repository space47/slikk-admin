/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import { Button, Checkbox, FormContainer, FormItem, Input, Tabs } from '@/components/ui'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useNavigate } from 'react-router-dom'
import { notification } from 'antd'
import LoadingSpinner from '@/common/LoadingSpinner'
import { useAppDispatch, useAppSelector } from '@/store'
import { getAllFiltersAPI } from '@/store/action/filters.action'
import { FILTER_STATE } from '@/store/types/filters.types'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import _ from 'lodash'
import { handleimage } from '@/common/handleImage'
import { VscJson } from 'react-icons/vsc'
import { CiTextAlignCenter } from 'react-icons/ci'
import StoreSelectForm from '@/common/StoreSelectForm'
import { EDITFIELDSARRAY } from '../configg/componentsConfigg/commonConfigTypes'
import RenderAdd from '../storeConfig/storeConfigAdd/RenderAdd'
import ConfigJsonData from '../configg/componentsConfigg/ConfigJsonData'

interface Props {
    configType: string
}

const BasicConfigAdd: React.FC<Props> = ({ configType }) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const [editableKeys, setEditableKeys] = useState<Record<string, string>>({})
    const [showSpinner, setShowSpinner] = useState(false)

    const [tabValue, setTabValue] = useState('field')

    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    useEffect(() => {
        dispatch(getAllFiltersAPI())
    }, [dispatch])

    const initialValue = {}

    const handleSubmit = async (values: any) => {
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

        console.log('here', tabValue)

        let body: Record<string, string | number> = {}

        body = {
            is_active: values.is_active,
            config_name: values.name,
            config_value: tabValue === 'field' ? await processValues(values.value) : await JSON.parse(values.json_value),
        }

        if (configType === 'store') {
            body.store_id = values.store?.id
        }

        try {
            setShowSpinner(true)
            const response = await axiosInstance.post(`/${configType}/configuration`, body)
            notification.success({
                message: response.data?.message || 'Configuration updated successfully',
            })
            if (configType === 'store') {
                navigate(`/app/storeConfigurations`)
            } else {
                navigate('/app/configurations')
            }
        } catch (error) {
            notification.error({ message: 'Failed to update configuration' })
        } finally {
            setShowSpinner(false)
        }
    }

    if (showSpinner) return <LoadingSpinner />

    return (
        <div className="w-full shadow-xl p-4 rounded-xl">
            <div className="w-full mb-10">
                <Tabs defaultValue="active" className="flex flex-col" value={tabValue} onChange={(value) => setTabValue(value)}>
                    <TabList className="flex gap-8 border-b border-gray-200 dark:border-gray-700">
                        <TabNav
                            value="field"
                            icon={<CiTextAlignCenter className="text-green-500 text-xl" />}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-500 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            <span className="text-xl">Field Data</span>
                        </TabNav>
                        <TabNav
                            value="jsonData"
                            icon={<VscJson className="text-orange-400 text-xl" />}
                            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:border-blue-500 border-b-2 border-transparent data-[state=active]:text-blue-600 data-[state=active]:border-blue-600 transition-colors duration-200"
                        >
                            <span className="text-xl"> JSON DATA</span>
                        </TabNav>
                    </TabList>
                </Tabs>
            </div>
            <Formik enableReinitialize initialValues={initialValue as any} onSubmit={handleSubmit}>
                {({ values, setFieldValue }) => {
                    return tabValue === 'field' ? (
                        <>
                            <Form className="w-full">
                                <FormContainer>
                                    <h5 className="mb-5 text-neutral-900">Edit Configurations</h5>

                                    {EDITFIELDSARRAY.map((item) => (
                                        <FormItem key={item.name} label={item.label} className="col-span-1 w-1/2">
                                            <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                                        </FormItem>
                                    ))}
                                    <FormItem label="Last Updated By" className="col-span-1 w-1/2">
                                        <Field
                                            disabled
                                            type="text"
                                            name="last_updated_by"
                                            placeholder="Enter updated by"
                                            component={Input}
                                        />
                                    </FormItem>
                                    {configType === 'store' && <StoreSelectForm label="Store" name="store" isSingle />}
                                    <FormItem label="Is Active" className="col-span-1 w-1/2">
                                        <Field type="checkbox" name="is_active" placeholder="Enter updated by" component={Checkbox} />
                                    </FormItem>

                                    <RenderAdd
                                        obj={values.value}
                                        parentKey="value"
                                        setFieldValue={setFieldValue}
                                        editableKeys={editableKeys}
                                        setEditableKeys={setEditableKeys}
                                        filters={filters}
                                    />

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
                        </>
                    ) : (
                        <ConfigJsonData />
                    )
                }}
            </Formik>
        </div>
    )
}

export default BasicConfigAdd
