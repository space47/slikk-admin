/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useEffect, useState } from 'react'
import { notification } from 'antd'
import ReportCommonForm from '../reportUtils/ReportCommonForm'
import { textParser } from '@/common/textParser'

const EditReportQuery = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    console.log('edit Report')

    const [reportData, setReportData] = useState({
        name: '',
        display_name: '',
        value: [
            {
                key: '',
                value: {
                    name: '',
                    display_name: '',
                    position: 0,
                    extra_attributes: {
                        is_graph: false,
                        x_axis: '',
                        y_axis: '',
                        secondary_y_axis: '',
                        graph_type: '',
                    },
                    query: '',
                },
            },
        ],
        required_fields: [{ position: '', key: '', value: '', dataType: 'String', prefix: '', suffix: '' }],
    })

    const fetchReportApi = async () => {
        try {
            const response = await axioisInstance.get(`/query/config?id=${id}`)
            const data = response?.data?.data

            const formattedData = {
                name: data?.results[0]?.name || '',
                display_name: data?.results[0]?.display_name || '',
                cache_config: data?.results[0]?.cache_config,
                value:
                    data?.results[0]?.value.map((item: any) => ({
                        name: item.name,
                        display_name: item.display_name,
                        position: item.position,
                        enable_cache: data?.results[0]?.cache_config?.[item.name]?.enable ?? false,
                        query: item.query,
                        extra_attributes: {
                            is_graph: item.extra_attributes?.is_graph || false,
                            x_axis: item?.extra_attributes?.x_axis || '',
                            y_axis: item?.extra_attributes?.y_axis || '',
                            secondary_y_axis: item?.extra_attributes?.secondary_y_axis || '',
                            graph_type: item?.extra_attributes?.graph_type || '',
                            logic: item?.extra_attributes?.logic || '',
                            use_case: item?.extra_attributes?.use_case || '',
                        },
                    })) || [],
                required_fields:
                    typeof data?.results?.[0]?.required_fields === 'object' && !Array.isArray(data?.results?.[0]?.required_fields)
                        ? Object.entries(data?.results?.[0]?.required_fields || {})
                              .map(([key, fullValue]) => {
                                  if (!Array.isArray(fullValue)) return null

                                  const [position, dataType, value, prefix = '', suffix = ''] = fullValue

                                  return {
                                      position,
                                      key,
                                      value: Array.isArray(value) ? value.join(', ') : value,
                                      dataType: dataType || 'String',
                                      prefix,
                                      suffix,
                                  }
                              })
                              .filter(Boolean)
                        : data?.results?.[0]?.required_fields,

                // required_fields: data?.results[0]?.required_fields,
            }

            setReportData(formattedData)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchReportApi()
    }, [id])

    const handleSubmit = async (values: any) => {
        const requiredFields = values?.cache_config?.cache_time_seconds && values?.display_name && values?.name

        if (!requiredFields) {
            notification.error({ message: 'Name, Cache and Display name are mandatory' })
            return
        }

        const isCacheEnableForAField = values?.value?.filter((item: Record<string, any>) => item?.enable_cache) || []

        const configForFieldsCached = isCacheEnableForAField.reduce(
            (acc: Record<string, { enable: boolean }>, item: Record<string, any>) => {
                if (item?.name) {
                    acc[item.name] = { enable: true }
                }
                return acc
            },
            {},
        )

        const updatedValues = values.value.map((item: any) => {
            return {
                ...item,
                query: textParser(item.query),
                extra_attributes: {
                    is_graph: item?.extra_attributes?.is_graph,
                    x_axis: item?.extra_attributes?.x_axis,
                    y_axis: item?.extra_attributes?.y_axis,
                    secondary_y_axis: item?.extra_attributes?.secondary_y_axis,
                    graph_type: item?.extra_attributes?.graph_type ? item?.extra_attributes?.graph_type : 'line',
                    logic: textParser(item.extra_attributes?.logic) || null,
                    use_case: item.extra_attributes?.use_case || null,
                },
            }
        })

        const body = {
            ...values,
            value: updatedValues,
            required_fields: values.required_fields,
            cache_config: {
                cache_time_seconds: values.cache_config.cache_time_seconds,
                ...configForFieldsCached,
            },
        }

        try {
            const response = await axioisInstance.patch(`/query/config/${id}`, body)
            notification.success({
                message: response?.data.message || 'Successfully updated query',
            })
            // navigate(`/app/reportConfigurations`)
        } catch (error: any) {
            console.log(error)
            notification.error({
                message: error?.response?.data?.message || 'Failed to Update query',
            })
        }
    }

    return (
        <div>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
                        <IoIosAddCircle className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Edit Report Query
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">Configure and customize your report queries</p>
                    </div>
                </div>
            </div>
            <Formik initialValues={reportData} enableReinitialize onSubmit={handleSubmit}>
                {({ values, resetForm }) => <ReportCommonForm resetForm={resetForm} values={values} />}
            </Formik>
        </div>
    )
}

export default EditReportQuery
