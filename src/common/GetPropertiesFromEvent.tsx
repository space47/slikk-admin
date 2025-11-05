/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { eventNameService } from '@/store/services/eventNameSerices'
import { FieldType } from '@/views/configurationsSlikk/configg/componentsConfigg/commonConfigTypes'

interface props {
    label: string
    name: string
    eventId?: string | number
    customClassName?: string
    eventName?: string
}

const GetPropertiesFromEvent = ({ label, name, customClassName, eventId, eventName }: props) => {
    console.log('eventId in get properties', eventName)
    const [eventNamesData, setEventNamesDataState] = useState<any>(null)
    const { data: eventNameList, isSuccess } = eventNameService.useEventNamesDataQuery({
        event_name: eventName && typeof eventName !== 'object' ? eventName?.toString() : '',
    })

    console.log('eventId', eventName)

    useEffect(() => {
        if (isSuccess) {
            if (eventId) {
                setEventNamesDataState(eventNameList || [])
            } else {
                setEventNamesDataState(eventNameList?.results ? eventNameList?.results?.find((item) => item?.name === eventName) : [])
            }
        }
    }, [isSuccess, eventNameList, eventName])

    const merged = eventNameList?.results
        ?.map((item: any) => item.attributes)
        ?.flatMap((i: any) => i)
        .reduce<Record<string, FieldType>>((acc, obj) => {
            Object.assign(acc, obj)
            return acc
        }, {})

    const properties = eventName ? eventNamesData?.attributes : merged

    console.log('properties', properties)

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
                        console.log('field for properties', field)
                        return (
                            <Select
                                isClearable
                                field={field}
                                form={form}
                                options={propertyArray || []}
                                value={propertyArray?.find((option) => option.value?.toLocaleLowerCase() === field.value)}
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
