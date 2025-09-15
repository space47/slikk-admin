/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormItem, Select } from '@/components/ui'
import EventNamesModal from '@/views/sales/Notification/EventNamesModal'
import { Field, FieldProps } from 'formik'
import React, { useEffect, useState } from 'react'
import { FaEdit, FaPlusCircle } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@/store'
import { EventNamesSliceType, setEventNamesData } from '@/store/slices/eventNameSlice/eventName.slice'
import { eventNameService } from '@/store/services/eventNameSerices'
import EditEventNamesModal from '@/views/sales/Notification/EditEventNameModal'

interface props {
    label: string
    name: string
    hideButtons?: boolean
    customClassName?: string
}

const GetEvenNames = ({ label, name, hideButtons, customClassName }: props) => {
    const dispatch = useAppDispatch()
    const { eventNamesData } = useAppSelector<EventNamesSliceType>((state) => state.eventNames)
    const [isModalOpen, setIsModalOpen] = useState({ add: false, edit: false })
    const { data: eventNameList, isSuccess, refetch: refetchingData } = eventNameService.useEventNamesDataQuery({})

    useEffect(() => {
        if (isSuccess) {
            dispatch(setEventNamesData(eventNameList?.results || []))
        }
    }, [dispatch, isSuccess, eventNameList])

    const EventNamesArray = eventNamesData?.map((item) => ({
        label: item.name,
        value: item.name,
        id: item.id,
    }))
    return (
        <div>
            <FormItem label={label} className={customClassName ? customClassName : 'col-span-1 w-1/2'}>
                {!hideButtons && (
                    <>
                        <div className="flex items-center gap-2 mb-5">
                            <span onClick={() => setIsModalOpen({ ...isModalOpen, add: true })}>
                                <FaPlusCircle className="text-xl text-green-500 cursor-pointer" />
                            </span>
                            <span onClick={() => setIsModalOpen({ ...isModalOpen, edit: true })}>
                                <FaEdit className="text-xl text-blue-600 cursor-pointer" />
                            </span>
                        </div>
                    </>
                )}
                <Field name={name}>
                    {({ field, form }: FieldProps<any>) => {
                        console.log('field', field)
                        return (
                            <Select
                                isClearable
                                field={field}
                                form={form}
                                options={EventNamesArray || []}
                                value={EventNamesArray?.find((option) => option.value?.toLocaleLowerCase() === field?.value)}
                                onChange={(newVal) => {
                                    form.setFieldValue(field.name, {
                                        value: newVal?.value,
                                        id: newVal?.id,
                                    })
                                }}
                            />
                        )
                    }}
                </Field>
            </FormItem>
            {isModalOpen.add && <EventNamesModal dialogIsOpen={isModalOpen.add} setIsOpen={setIsModalOpen} refetch={refetchingData} />}
            {isModalOpen.edit && (
                <EditEventNamesModal
                    dialogIsOpen={isModalOpen.edit}
                    setIsOpen={setIsModalOpen}
                    eventNamesData={eventNamesData}
                    refetch={refetchingData}
                />
            )}
        </div>
    )
}

export default GetEvenNames
