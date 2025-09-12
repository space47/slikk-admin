/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { EventNamesSliceType, setEventNamesData } from '@/store/slices/eventNameSlice/eventName.slice'
import { eventNameService } from '@/store/services/eventNameSerices'

interface props {
    label: string
    name: string
    eventId?: string
    customClassName?: string
}

const GetPropertiesFromEvent = ({ label, name, customClassName, eventId }: props) => {
    const [eventNamesData, setEventNamesDataState] = useState<any>(null)
    const { data: eventNameList, isSuccess } = eventNameService.useEventNamesDataQuery({
        id: eventId ? parseInt(eventId) : undefined,
    })

    console.log('eventId', eventId)

    useEffect(() => {
        if (isSuccess) {
            setEventNamesDataState(eventNameList || [])
        }
    }, [isSuccess, eventNameList, eventId])

    const properties = eventNamesData?.attributes

    console.log('properties', eventNamesData)

    const propertyArray = properties
        ? Object.keys(properties).map((key) => ({
              label: key,
              value: key,
          }))
        : []

    return (
        <div>
            <FormItem label={label} className={customClassName ? customClassName : 'col-span-1 w-1/2'}>
                <Field name={name}>
                    {({ field, form }: FieldProps<any>) => {
                        return (
                            <Select
                                isClearable
                                field={field}
                                form={form}
                                options={propertyArray || []}
                                value={propertyArray?.find((option) => option.value === field.value)}
                                onChange={(newVal) => {
                                    console.log(newVal?.value)
                                    form.setFieldValue(field.name, newVal?.value)
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
        </div>
    )
}

export default GetPropertiesFromEvent
