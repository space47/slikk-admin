/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldArray, Form } from 'formik'
import React from 'react'
import { MdCancel } from 'react-icons/md'
import { ExtraAttributes } from '../editQueryReport/ExtraAttributes'
import { RichTextEditor } from '@/components/shared'
import { IoIosAddCircle } from 'react-icons/io'
import { FaKey } from 'react-icons/fa'
import RichTextCommon from '@/common/RichTextCommon'

const reportQueryNames = [
    { label: 'Date', value: 'Date' },
    { label: 'Number', value: 'Number' },
    { label: 'String', value: 'String' },
    { label: 'Boolean', value: 'Boolean' },
    { label: 'Filter', value: 'filter' },
    { label: 'Select', value: 'Select' },
    { label: 'MulltiSelect', value: 'MultiSelect' },
]

interface Props {
    values: any
    resetForm: any
}

const createDefaultField = () => ({
    position: '',
    key: '',
    value: '',
    dataType: 'String',
    prefix: '',
    suffix: '',
    subFields: [],
})

interface DynamicFieldProps {
    name: string
    values: any[]
    remove: (index: number) => void
    reportQueryNames: any[]
}

const DynamicField = ({ name, values, remove, reportQueryNames }: DynamicFieldProps) => {
    return (
        <>
            {values?.map((item, index) => (
                <div
                    key={index}
                    className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                            </div>
                            <span className="font-medium text-gray-700">Field #{index + 1}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => remove(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            <MdCancel className="text-xl" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-8 gap-3">
                        <div className="md:col-span-2">
                            <Field
                                name={`${name}[${index}].position`}
                                component={Input}
                                type="number"
                                placeholder="Position"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <Field
                                name={`${name}[${index}].key`}
                                component={Input}
                                placeholder="Field Key"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Field name={`${name}[${index}].dataType`}>
                                {({ field, form }: any) => (
                                    <Select
                                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                                        placeholder="Data Type"
                                        options={reportQueryNames}
                                        value={reportQueryNames.find((option) => option.value === field.value)}
                                        onChange={(option) => form.setFieldValue(field.name, option?.value)}
                                    />
                                )}
                            </Field>
                        </div>

                        <div className="md:col-span-3">
                            <Field name={`${name}[${index}].value`}>
                                {({ field, form }: any) => {
                                    const dataType = form.values?.[name]?.[index]?.dataType

                                    return (
                                        <Input
                                            {...field}
                                            type={dataType === 'Date' ? 'date' : 'text'}
                                            placeholder={dataType === 'Date' ? 'Select date' : 'Enter value'}
                                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                                        />
                                    )
                                }}
                            </Field>
                        </div>

                        <div className="flex gap-2">
                            <Field
                                name={`${name}[${index}].prefix`}
                                component={Input}
                                placeholder="Prefix"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                            <Field
                                name={`${name}[${index}].suffix`}
                                component={Input}
                                placeholder="Suffix"
                                className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                        </div>
                    </div>

                    <FieldArray name={`${name}[${index}].subFields`}>
                        {({ push, remove: removeSub }) => {
                            const subFields = item?.subFields || []

                            return (
                                item?.dataType === 'filter' && (
                                    <div className="mt-4 ml-8 border-l-2 border-emerald-200 pl-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-medium text-gray-600">Sub Fields</h4>

                                            <button
                                                type="button"
                                                onClick={() => push(createDefaultField())}
                                                className="flex items-center gap-1 px-2 py-1 text-xs border border-dashed border-emerald-300 rounded-md hover:border-emerald-500 hover:bg-emerald-50/30 text-emerald-600 hover:text-emerald-700 transition-all duration-200"
                                            >
                                                <IoIosAddCircle className="text-sm" />
                                                <span>Add Sub Field</span>
                                            </button>
                                        </div>
                                        <DynamicField
                                            name={`${name}[${index}].subFields`}
                                            values={subFields}
                                            remove={removeSub}
                                            reportQueryNames={reportQueryNames}
                                        />
                                    </div>
                                )
                            )
                        }}
                    </FieldArray>
                </div>
            ))}
        </>
    )
}

const ReportCommonForm = ({ resetForm, values }: Props) => {
    return (
        <Form>
            <div className="p-6 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
                <div className="mb-10">
                    <div className="mb-6 pb-4 border-b border-gray-100">
                        <h4 className="text-xl font-semibold text-gray-800">Basic Information</h4>
                        <p className="text-gray-500 text-sm mt-1">Set up your reports basic details</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormItem label="Unique Report Name" className="col-span-1" asterisk>
                            <Field
                                type="text"
                                name="name"
                                placeholder="Enter unique name"
                                component={Input}
                                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 rounded-lg transition-all duration-200 hover:bg-white"
                            />
                        </FormItem>

                        <FormItem label="Report Display Name" className="col-span-1" asterisk>
                            <Field
                                type="text"
                                name="display_name"
                                placeholder="Enter display name"
                                component={Input}
                                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 rounded-lg transition-all duration-200 hover:bg-white"
                            />
                        </FormItem>
                        <FormItem label="Cache Time (in seconds)" className="col-span-1" asterisk>
                            <Field
                                type="number"
                                name="cache_config.cache_time_seconds"
                                placeholder="Enter cache time for this report"
                                component={Input}
                                className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 rounded-lg transition-all duration-200 hover:bg-white"
                            />
                        </FormItem>
                    </div>
                </div>

                <div className="mb-10">
                    <div className="mb-6 pb-4 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800">Query List</h4>
                                <p className="text-gray-500 text-sm mt-1">Manage individual queries within this report</p>
                            </div>
                            <div className="px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-sm font-medium rounded-full inline-flex items-center gap-2 w-fit">
                                <IoIosAddCircle className="text-lg" />
                                <span>{values.value?.length || 0} queries</span>
                            </div>
                        </div>
                    </div>

                    <FormItem label="Query List" labelClass="!justify-start" className="col-span-1 w-full">
                        <FieldArray name="value">
                            {({ push, remove }) => (
                                <div className="space-y-6">
                                    {values.value.map((item, index) => (
                                        <div
                                            key={index}
                                            className="border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-gray-50/50 to-white shadow-sm hover:shadow-md transition-all duration-300 relative group"
                                        >
                                            <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                                                        <span className="text-white font-bold">{index + 1}</span>
                                                    </div>
                                                    <div>
                                                        <h5 className="font-semibold text-gray-800">Query #{index + 1}</h5>
                                                        <p className="text-gray-500 text-sm">Configure query details below</p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group-hover:opacity-100 opacity-70"
                                                    title="Remove query"
                                                >
                                                    <MdCancel className="text-2xl" />
                                                </button>
                                            </div>

                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <FormItem label="Name" className="md:col-span-1" asterisk>
                                                        <Field
                                                            name={`value[${index}].name`}
                                                            placeholder="Enter query name"
                                                            component={Input}
                                                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                                                        />
                                                    </FormItem>

                                                    <FormItem label="Display Name" className="md:col-span-1" asterisk>
                                                        <Field
                                                            name={`value[${index}].display_name`}
                                                            placeholder="Enter display name"
                                                            component={Input}
                                                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                                                        />
                                                    </FormItem>

                                                    <FormItem label="Position" className="md:col-span-1">
                                                        <Field
                                                            name={`value[${index}].position`}
                                                            type="number"
                                                            placeholder="Position"
                                                            component={Input}
                                                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                                                        />
                                                    </FormItem>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <RichTextCommon
                                                        label="Logic behind this query"
                                                        name={`value[${index}].extra_attributes.logic`}
                                                    />

                                                    <FormItem label="Use Case for this query">
                                                        <Field
                                                            name={`value[${index}].extra_attributes.use_case`}
                                                            type="text"
                                                            placeholder="Describe the use case"
                                                            component={Input}
                                                            className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                                                        />
                                                    </FormItem>
                                                </div>

                                                {ExtraAttributes.length > 0 && (
                                                    <div className="bg-gray-50/50 rounded-xl p-4">
                                                        <h6 className="font-medium text-gray-700 mb-4">Additional Settings</h6>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {ExtraAttributes.map((item, key) => (
                                                                <FormItem key={key} label={item.label}>
                                                                    <Field
                                                                        name={`value[${index}].${item.name}`}
                                                                        type={item.type}
                                                                        placeholder={`Enter ${item.label}`}
                                                                        component={item.component}
                                                                        className="bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                                                                    />
                                                                </FormItem>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <FormItem label="Query">
                                                    <div className="relative">
                                                        <Field name={`value[${index}].query`}>
                                                            {({ field, form }: any) => (
                                                                <RichTextEditor
                                                                    value={field.value}
                                                                    onChange={(val) => form.setFieldValue(field.name, val)}
                                                                    className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>
                                                </FormItem>
                                            </div>
                                        </div>
                                    ))}

                                    <Button
                                        variant="new"
                                        type="button"
                                        onClick={() =>
                                            push({
                                                name: '',
                                                display_name: '',
                                                position: 0,
                                                is_graph: false,
                                                enable_cache: false,
                                                query: '',
                                            })
                                        }
                                        icon={<IoIosAddCircle className="text-2xl" />}
                                    >
                                        Add New Query
                                    </Button>
                                </div>
                            )}
                        </FieldArray>
                    </FormItem>
                </div>

                <div className="mb-10">
                    <div className="mb-6 pb-4 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h4 className="text-xl font-semibold text-gray-800">Required Fields</h4>
                                <p className="text-gray-500 text-sm mt-1">Define parameters needed for this report</p>
                            </div>
                            <div className="px-3 py-1 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-100 text-emerald-700 text-sm font-medium rounded-full inline-flex items-center gap-2 w-fit">
                                <FaKey className="text-sm" />
                                <span>{values.required_fields?.length || 0} fields</span>
                            </div>
                        </div>
                    </div>

                    <FormItem asterisk label="Required Fields" className="col-span-1">
                        <FieldArray name="required_fields">
                            {({ push, remove }) => (
                                <div className="space-y-4">
                                    <DynamicField
                                        name="required_fields"
                                        values={values.required_fields}
                                        remove={remove}
                                        reportQueryNames={reportQueryNames}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => push(createDefaultField())}
                                        className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 rounded-lg hover:border-emerald-500 hover:bg-emerald-50/30 text-emerald-600 hover:text-emerald-700 transition-all duration-200 w-full md:w-auto"
                                    >
                                        <IoIosAddCircle className="text-xl" />
                                        <span className="font-medium">Add Required Field</span>
                                    </button>
                                </div>
                            )}
                        </FieldArray>
                    </FormItem>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-3 justify-end">
                        <Button
                            type="reset"
                            className="px-8 py-2.5 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={() => resetForm()}
                        >
                            Reset Form
                        </Button>
                        <Button variant="blue" type="submit">
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default ReportCommonForm
