/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik } from 'formik'
import { useNavigate } from 'react-router-dom'
import { IoIosAddCircle } from 'react-icons/io'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import ReportCommonForm from '../reportUtils/ReportCommonForm'
import { textParser } from '@/common/textParser'
import { AxiosError } from 'axios'
import { errorMessage, successMessage } from '@/utils/responseMessages'

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
        try {
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
                required_fields: values.required_fields,
                cache_config: {
                    cache_time_seconds: values.cache_config.cache_time_seconds,
                },
            }
            const response = await axioisInstance.post(`/query/config`, body)
            successMessage(response)
        } catch (error) {
            if (error instanceof AxiosError) errorMessage(error)
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
