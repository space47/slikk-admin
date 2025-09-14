import { Button, FormContainer, FormItem, Input } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field, FieldArray } from 'formik'
import React from 'react'
import { FaTrash } from 'react-icons/fa'

const TypeArray = [
    { label: 'Text', value: 'text' },
    { label: 'Number', value: 'number' },
    { label: 'Boolean', value: 'boolean' },
]

interface EventFormProps {
    values: any
}

const EventForm = ({ values }: EventFormProps) => {
    return (
        <FormContainer>
            <FormItem label="Name">
                <Field name="name" component={Input} placeholder="Enter Name" type="text" />
            </FormItem>

            <FormContainer>
                <div className="mb-2">Select Property According to Event</div>

                <FieldArray name="properties">
                    {({ push, remove }) => (
                        <div className="space-y-4">
                            {values?.properties?.map((_, index) => (
                                <div key={index} className="grid grid-cols-3 gap-6 items-center">
                                    <FormItem label="Property">
                                        <Field
                                            name={`properties[${index}].key`}
                                            component={Input}
                                            placeholder="Enter Property"
                                            type="text"
                                        />
                                    </FormItem>

                                    <CommonSelect label="Type" name={`properties[${index}].type`} options={TypeArray} />

                                    <div>
                                        <FaTrash className="text-red-500 cursor-pointer text-2xl" onClick={() => remove(index)} />
                                    </div>
                                </div>
                            ))}

                            <Button type="button" variant="accept" onClick={() => push({ key: '', type: '' })}>
                                + Add Property
                            </Button>
                            <br />
                        </div>
                    )}
                </FieldArray>
            </FormContainer>
        </FormContainer>
    )
}

export default EventForm
