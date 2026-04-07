import React from 'react'
import { AgencyFields } from './riderAgencyCommon'
import { FormItem, Input, Switcher } from '@/components/ui'
import { Field } from 'formik'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'

const sectionStyles = [
    'border-l-4 border-yellow-400 bg-yellow-50/40',
    'border-l-4 border-green-400 bg-green-50/40',
    'border-l-4 border-blue-400 bg-blue-50/40',
]

const RiderAgencyForm = () => {
    return (
        <div className="space-y-6">
            {AgencyFields.map((section, index) => (
                <div
                    key={section.title}
                    className={`p-5 rounded-2xl shadow-sm ${sectionStyles[index % sectionStyles.length]} transition-all duration-200 hover:shadow-md`}
                >
                    {/* Section Header */}
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-800 tracking-wide uppercase">{section.title}</h3>
                        <div className="h-[2px] w-10 bg-gray-300 mt-1 rounded-full" />
                    </div>

                    {/* Fields */}
                    <div className={`grid ${section.grid} gap-4 max-md:grid-cols-1`}>
                        {section.fields.map((field) => (
                            <FormItem key={field.name} label={field.label}>
                                {field.type === 'select' ? (
                                    <CommonSelect name={field.name} options={field.options || []} label="" isMulti={field.isMulti} />
                                ) : field.type === 'checkbox' ? (
                                    <div className="flex items-center h-full pt-2">
                                        <Field name={field.name} component={Switcher} type="checkbox" />
                                    </div>
                                ) : (
                                    <Field
                                        name={field.name}
                                        type={field.type}
                                        component={Input}
                                        className={`w-full ${field.type === 'color' ? 'h-10 p-1 cursor-pointer' : ''}`}
                                    />
                                )}
                            </FormItem>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default RiderAgencyForm
