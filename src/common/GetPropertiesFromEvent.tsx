/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { eventNameService } from '@/store/services/eventNameSerices'

interface props {
    label: string
    name: string
    eventId?: string | number
    customClassName?: string
}

const GetPropertiesFromEvent = ({ label, name, customClassName, eventId }: props) => {
    const [eventNamesData, setEventNamesDataState] = useState<any>(null)
    const { data: eventNameList, isSuccess } = eventNameService.useEventNamesDataQuery({
        id: eventId ? parseInt(eventId as string) : undefined,
    })

    console.log('eventId', eventId)

    useEffect(() => {
        if (isSuccess) {
            if (eventId) {
                setEventNamesDataState(eventNameList || [])
            } else {
                setEventNamesDataState(eventNameList?.results ? eventNameList?.results[0] : [])
            }
        }
    }, [isSuccess, eventNameList, eventId])

    const properties = eventNamesData?.attributes

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
