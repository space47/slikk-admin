/* eslint-disable @typescript-eslint/no-explicit-any */
import GetEvenNames from '@/common/GetEvenNames'
import { Button, FormContainer, FormItem, Select, Switcher, Tooltip } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldArray, FieldProps } from 'formik'
import React from 'react'
import { BiSolidDuplicate } from 'react-icons/bi'
import {
    FaCalendarDay,
    FaClock,
    FaCogs,
    FaFilter,
    FaInfoCircle,
    FaListAlt,
    FaPlayCircle,
    FaSlidersH,
    FaStopCircle,
    FaUserCheck,
    FaUsers,
} from 'react-icons/fa'
import { TimeFrameArray } from './notificationGroupsCommon'
import FullDateForm from '@/common/FullDateForm'
import GetPropertiesFromEvent from '@/common/GetPropertiesFromEvent'
import ConditonMapings from './ConditonMapings'
import GetAggregationFromEvents from '../newGroupsComponents/GetAggregationFromEvent'
import { GrAggregate } from 'react-icons/gr'
import { MdDelete } from 'react-icons/md'

interface Props {
    isEdit?: boolean
    values: any
    formattedData: {
        value: any
        label: any
    }[]
    searchInputs: {
        [key: number]: string
    }
    handleAddCondition: (push: any, relation: string) => void
    handleSearch: (inputValue: string, index: number) => void
}

const GroupForm = ({ isEdit, values, formattedData, searchInputs, handleAddCondition, handleSearch }: Props) => {
    return (
        <div className="mt-8">
            <FieldArray name="conditions">
                {({ push, remove }) => (
                    <>
                        {values.conditions.map((cond: any, index: any) => {
                            const nextConditionRelation =
                                index < values.conditions.length - 1 ? values.conditions[index + 1]?.relation : null
                            return (
                                <div key={index} className="shadow-xl rounded-xl p-5 mb-5">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-bold text-sl">ADD RULES #{index + 1}</div>
                                        <div>
                                            <Tooltip title="Duplicate Rule">
                                                <BiSolidDuplicate
                                                    className="text-2xl cursor-pointer hover:text-blue-500"
                                                    onClick={() => push({ ...cond })}
                                                />
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 transition-all duration-200 hover:shadow-xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center">
                                                    <FaFilter className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h5 className="text-lg font-semibold text-gray-800">Event Names and Cohort Filter</h5>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Configure event conditions and cohort filters
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <FormContainer className="space-y-6">
                                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid xl:grid-cols-2 grid-cols-1 gap-2">
                                                <GetEvenNames
                                                    hideButtons
                                                    customClassName="w-full"
                                                    label={
                                                        (
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FaListAlt className="w-4 h-4 text-gray-500" />
                                                                <span className="text-sm font-medium text-gray-700">Event Names</span>
                                                            </div>
                                                        ) as any
                                                    }
                                                    name={`conditions[${index}].event.value`}
                                                />

                                                <CommonSelect
                                                    label={
                                                        (
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <FaClock className="w-4 h-4 text-blue-500" />
                                                                <label className="text-sm font-medium text-gray-700">Time Frame</label>
                                                            </div>
                                                        ) as any
                                                    }
                                                    options={TimeFrameArray}
                                                    name={`conditions[${index}].timeFrame`}
                                                    className="mt-2"
                                                />
                                            </div>
                                            {cond?.timeFrame === 'custom_range' && (
                                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100 shadow-sm">
                                                    <div className="flex items-center gap-2 mb-4">
                                                        <FaCalendarDay className="w-4 h-4 text-blue-600" />
                                                        <label className="text-sm font-semibold text-blue-800">Custom Date Range</label>
                                                    </div>
                                                    <FormContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaPlayCircle className="w-4 h-4 text-green-500" />
                                                                <label className="text-sm font-medium text-gray-700">Start Date</label>
                                                            </div>
                                                            <FullDateForm
                                                                label=""
                                                                name={`conditions[${index}].start_date`}
                                                                fieldname={`conditions[${index}].start_date`}
                                                                customCss="mt-1 w-full"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2">
                                                                <FaStopCircle className="w-4 h-4 text-red-500" />
                                                                <label className="text-sm font-medium text-gray-700">End Date</label>
                                                            </div>
                                                            <FullDateForm
                                                                label=""
                                                                name={`conditions[${index}].end_date`}
                                                                fieldname={`conditions[${index}].end_date`}
                                                                customCss="mt-1 w-full"
                                                            />
                                                        </div>
                                                    </FormContainer>
                                                </div>
                                            )}
                                            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100 shadow-sm">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <FaUsers className="w-5 h-5 text-purple-600" />
                                                    <div>
                                                        <label className="text-sm font-semibold text-purple-800">Cohort Selection</label>
                                                        <p className="text-xs text-gray-500 mt-1">Select or search for specific cohorts</p>
                                                    </div>
                                                </div>
                                                <FormItem className="">
                                                    <div className="flex items-center gap-3">
                                                        <FaUserCheck className="w-5 h-5 text-gray-400" />
                                                        <span className="text-sm font-medium text-gray-700">Include/Exclude</span>
                                                    </div>
                                                    <Field
                                                        type="checkbox"
                                                        name={`conditions[${index}].includeExclude`}
                                                        component={Switcher}
                                                    />
                                                </FormItem>
                                                <FormItem>
                                                    <Field name={`conditions[${index}].cohort_id`}>
                                                        {({ form, field }: FieldProps) => {
                                                            return (
                                                                <div className="relative">
                                                                    <Select
                                                                        isSearchable
                                                                        isClearable
                                                                        inputValue={searchInputs[index] || ''}
                                                                        options={formattedData}
                                                                        value={formattedData?.find(
                                                                            (option) => option.value === field.value,
                                                                        )}
                                                                        onInputChange={(inputValue: string) =>
                                                                            handleSearch(inputValue, index)
                                                                        }
                                                                        onChange={(selectedOption: any) => {
                                                                            const value = selectedOption ? selectedOption.value : ''
                                                                            form.setFieldValue(field.name, value)
                                                                        }}
                                                                        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                                                                    />
                                                                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                                        <FaInfoCircle className="w-3 h-3" />
                                                                        <span>Press Enter to submit search</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }}
                                                    </Field>
                                                </FormItem>
                                            </div>
                                        </FormContainer>
                                    </div>

                                    <div className="shadow-xl mt-6 p-2 rounded-xl bg-blue-50">
                                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg flex items-center justify-center shadow-sm">
                                                    <FaSlidersH className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <h5 className="text-lg font-semibold text-gray-800">Property & Value Configuration</h5>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Define specific property criteria for your event filter
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <FormContainer className="grid xl:grid-cols-3 grid-cols-1 gap-2">
                                            <GetPropertiesFromEvent
                                                eventId={
                                                    isEdit
                                                        ? values.conditions[index]?.event?.value?.id
                                                        : (values.conditions[index]?.event as any)?.id
                                                }
                                                customClassName="w-full "
                                                label={
                                                    (
                                                        <div className="flex items-center gap-2">
                                                            <FaCogs className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm font-medium text-gray-700">Property</span>
                                                        </div>
                                                    ) as any
                                                }
                                                name={`conditions[${index}].property`}
                                                eventName={values.conditions[index]?.event?.value}
                                            />
                                            <ConditonMapings isEdit={isEdit} cond={cond} index={index} />
                                        </FormContainer>
                                        <FormContainer className="grid xl:grid-cols-3 grid-cols-1 gap-2">
                                            <GetAggregationFromEvents
                                                eventId={
                                                    isEdit
                                                        ? values.conditions[index]?.event?.value?.id
                                                        : (values.conditions[index]?.event as any)?.id
                                                }
                                                customClassName="w-full "
                                                label={
                                                    (
                                                        <div className="flex items-center gap-2">
                                                            <GrAggregate className="w-4 h-4 text-gray-500" />
                                                            <span className="text-sm font-medium text-gray-700">Aggregation</span>
                                                        </div>
                                                    ) as any
                                                }
                                                name={`conditions[${index}].aggregation`}
                                                eventName={values.conditions[index]?.event?.value}
                                            />
                                            {cond.aggregation && <ConditonMapings isEdit={isEdit} isFunction cond={cond} index={index} />}
                                        </FormContainer>
                                    </div>

                                    <div className="flex gap-4 mt-6 justify-center items-center relative z-10">
                                        <Button
                                            variant="twoTone"
                                            type="button"
                                            className={`relative px-6 py-2 transition-all ${
                                                nextConditionRelation === 'AND'
                                                    ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-200'
                                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                            }`}
                                            onClick={() => handleAddCondition(push, 'AND')}
                                        >
                                            AND
                                            {nextConditionRelation === 'AND' && (
                                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                                    <div className="w-1 h-4 bg-blue-500 rounded-t"></div>
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full rotate-45"></div>
                                                </div>
                                            )}
                                        </Button>
                                        <Button
                                            variant="twoTone"
                                            type="button"
                                            className={`relative px-6 py-2 transition-all ${
                                                nextConditionRelation === 'OR'
                                                    ? 'bg-orange-600 text-white shadow-md ring-2 ring-orange-200'
                                                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                                            }`}
                                            onClick={() => handleAddCondition(push, 'OR')}
                                        >
                                            OR
                                            {nextConditionRelation === 'OR' && (
                                                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                                                    <div className="w-1 h-4 bg-orange-500 rounded-t"></div>
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full rotate-45"></div>
                                                </div>
                                            )}
                                        </Button>

                                        {index > 0 && (
                                            <MdDelete
                                                className="text-xl text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                                                onClick={() => remove(index)}
                                            />
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </>
                )}
            </FieldArray>
        </div>
    )
}

export default GroupForm
