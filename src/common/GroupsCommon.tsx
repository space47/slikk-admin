/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'

interface props {
    values?: any
}

const GroupsCommon = ({ values }: props) => {
    const [groupDataToSend, setGroupDataToSend] = useState<any[]>([])

    const fetchGroupValue = async () => {
        try {
            const response = await axioisInstance.get(`/notification/groups?p=1&page_size=1000&is_active=true`)
            const data = response?.data?.data.results
            setGroupDataToSend(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchGroupValue()
    }, [])

    return (
        <FormItem label={'Group Ids'} className={'col-span-1 w-full mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100'}>
            <Field name="groupId">
                {({ field, form }: FieldProps<any>) => {
                    const selectedOptions = groupDataToSend?.find((option) => option.id === field.value?.id || option.id === field.value)

                    return (
                        <Select
                            isClearable
                            options={groupDataToSend}
                            value={selectedOptions}
                            getOptionLabel={(option: any) => option.name}
                            getOptionValue={(option: any) => option.id}
                            onChange={(option) => {
                                form.setFieldValue(field.name, option)
                            }}
                            onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                        />
                    )
                }}
            </Field>
            {values?.groupId && (
                <div className="mt-4 px-4 py-2 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-medium shadow-sm w-fit">
                    Users: {values?.groupId?.user?.length || 0}
                </div>
            )}
        </FormItem>
    )
}

export default GroupsCommon
