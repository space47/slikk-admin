/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import ReportCommonForm from '../reportUtils/ReportCommonForm'
import { textParser } from '@/common/textParser'

const AddReportQuery = () => {
    const navigate = useNavigate()
    const initialValue = {
        name: '',
        display_name: '',
        value: [
            {
                name: '',
                display_name: '',
                position: 0,
                is_graph: false,
                query: '',
                extra_attributes: {},
            },
        ],
        required_fields: [{ position: '', key: '', value: '', dataType: 'String', prefix: '', suffixL: '' }],
    }

    const handleSubmit = async (values: any) => {
        console.log('Submitting form...', values)

        try {
            const formattedRequiredFields = values.required_fields.reduce((result: any, item: any) => {
                if (item.key) {
                    let valueArray: [number | undefined, string, string | string[], string, string]
                    if (item.dataType === 'MultiSelect') {
                        const multiSelectValues = item.value.split(',').map((val: string) => val.trim())
                        valueArray = [item?.position, item.dataType, multiSelectValues, item.prefix || '', item.suffix || '']
                    } else {
                        const value = item.value.trim()
                        valueArray = [item?.position, item.dataType, value, item.prefix || '', item.suffix || '']
                    }
                    result[item.key] = valueArray
                }
                return result
            }, {})

            const updatedValues = values.value.map((item: any, index: number) => {
                if (!item.query) {
                    throw new Error(`Missing query for value at index ${index}`)
                }
                const parser = new DOMParser()
                const htmlDoc = parser.parseFromString(item.query, 'text/html')
                const plainTextValue = htmlDoc.body.textContent || ''
                return {
                    ...item,
                    query: plainTextValue.trim(),
                    extra_attributes: {
                        is_graph: item.extra_attributes?.is_graph || false,
                        x_axis: item.extra_attributes?.x_axis || null,
                        y_axis: item.extra_attributes?.y_axis || null,
                        secondary_y_axis: item.extra_attributes?.secondary_y_axis || null,
                        graph_type: item.extra_attributes?.graph_type || null,
                        logic: textParser(item.extra_attributes?.logic) || null,
                        use_case: item.extra_attributes?.use_case || null,
                    },
                }
            })

            const body = {
                ...values,
                value: updatedValues,
                required_fields: formattedRequiredFields,
            }

            console.log('API payload:', body)

            const response = await axioisInstance.post(`/query/config`, body)

            notification.success({
                message: response?.data?.message || 'Successfully added query',
            })
            console.log('API response:', response)
        } catch (error: any) {
            console.error('Error during API call:', error.message || error)
            notification.error({
                message: error?.response?.data?.message || 'Failed to add query',
            })
        }
    }

    return (
        <div className="p-8 bg-white rounded-lg shadow-md">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md">
                        <IoIosAddCircle className="text-2xl text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                            Add New Report Query
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">Configure and customize your report queries</p>
                    </div>
                </div>
            </div>
            <Formik initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => <ReportCommonForm resetForm={resetForm} values={values} />}
            </Formik>
        </div>
    )
}

export default AddReportQuery
