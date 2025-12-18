/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldArray } from 'formik'
import React from 'react'
import { FaTrash, FaPlus, FaCog, FaChartBar } from 'react-icons/fa'

const TypeArray = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Boolean', value: 'boolean' },
]

interface Props {
    values: any
}

const EventForm = ({ values }: Props) => {
    return (
        <FormContainer>
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaCog className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Event Configuration</h2>
                        <p className="text-gray-500 text-sm">Define your event name and properties</p>
                    </div>
                </div>

                <FormItem label="Event Name" labelClass="font-medium text-gray-700" className="max-w-md">
                    <Field name="name" component={Input} placeholder="e.g., user_signup, purchase_completed" type="text" />
                </FormItem>
            </div>
            <div className="mt-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaCog className="text-indigo-600 text-sm" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800">Event Properties</h3>
                            <p className="text-gray-500 text-sm">Map event data to database paths</p>
                        </div>
                    </div>
                </div>

                <FieldArray name="properties">
                    {({ push, remove }) => (
                        <div className="space-y-6">
                            <Button
                                type="button"
                                variant="solid"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-sm"
                                onClick={() => push({ key: '', path: '', type: '' })}
                            >
                                <FaPlus className="text-sm" />
                                Add Property
                            </Button>

                            {values.properties.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-lg">
                                        <div className="col-span-3">Key</div>
                                        <div className="col-span-4">Database Path</div>
                                        <div className="col-span-3">Type</div>
                                        <div className="col-span-2 text-center">Actions</div>
                                    </div>
                                    {values.properties.map((_: any, index: number) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="col-span-3">
                                                <Field
                                                    name={`properties[${index}].key`}
                                                    component={Input}
                                                    placeholder="e.g., userId, amount"
                                                    size="sm"
                                                />
                                            </div>
                                            <div className="col-span-4">
                                                <Field
                                                    name={`properties[${index}].path`}
                                                    component={Input}
                                                    placeholder="e.g., data.user.id"
                                                    size="sm"
                                                />
                                            </div>
                                            <div className="col-span-3 xl:mt-5">
                                                <CommonSelect label="" name={`properties[${index}].type`} options={TypeArray} />
                                            </div>
                                            <div className="col-span-2 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    aria-label="Delete property"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                    <FaCog className="text-gray-300 text-3xl mx-auto mb-3" />
                                    <p className="text-gray-500">No properties added yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Click Add Property to get started</p>
                                </div>
                            )}
                        </div>
                    )}
                </FieldArray>
            </div>
            <div className="mt-8 p-6 border border-gray-200 rounded-xl bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <FaChartBar className="text-purple-600 text-sm" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg text-gray-800">Event Aggregation</h3>
                            <p className="text-gray-500 text-sm">Define aggregation and corresponding path</p>
                        </div>
                    </div>
                </div>

                <FieldArray name="aggregation">
                    {({ push, remove }) => (
                        <div className="space-y-6">
                            <Button
                                type="button"
                                variant="solid"
                                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2 shadow-sm"
                                onClick={() => push({ key: '', path: '', type: '' })}
                            >
                                <FaPlus className="text-sm" />
                                Add Aggregation
                            </Button>

                            {values?.aggregation?.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-lg">
                                        <div className="col-span-3">Key</div>
                                        <div className="col-span-4">Database Path</div>
                                        <div className="col-span-3">Type</div>
                                        <div className="col-span-2 text-center">Actions</div>
                                    </div>

                                    {values?.aggregation?.map((_: any, index: number) => (
                                        <div
                                            key={index}
                                            className="grid grid-cols-12 gap-4 items-center p-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                                        >
                                            <div className="col-span-3">
                                                <Field
                                                    name={`aggregation[${index}].key`}
                                                    component={Input}
                                                    placeholder="e.g., total_sales, avg_value"
                                                    size="sm"
                                                />
                                            </div>

                                            <div className="col-span-4">
                                                <Field
                                                    name={`aggregation[${index}].path`}
                                                    component={Input}
                                                    placeholder="e.g., data.amount"
                                                    size="sm"
                                                />
                                            </div>

                                            <div className="col-span-3 xl:mt-5">
                                                <CommonSelect label="" name={`aggregation[${index}].type`} options={TypeArray} />
                                            </div>

                                            <div className="col-span-2 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    aria-label="Delete aggregation"
                                                >
                                                    <FaTrash className="text-sm" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
                                    <FaChartBar className="text-gray-300 text-3xl mx-auto mb-3" />
                                    <p className="text-gray-500">No aggregations added yet</p>
                                    <p className="text-gray-400 text-sm mt-1">Click Add Aggregation to get started</p>
                                </div>
                            )}
                        </div>
                    )}
                </FieldArray>
            </div>
        </FormContainer>
    )
}

export default EventForm
