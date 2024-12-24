import { Card, FormContainer, FormItem, Select } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import React from 'react'
import { Field, FieldArray, FieldProps, useFormikContext } from 'formik'

interface ButtonProps {
    values: any
    setButtonText: (texts: string[]) => void
    setQuickButtonText?: (texts: string[]) => void
}

const AddbuttonsArray = [
    { label: 'Call To Action', value: 'CALL_TO_ACTION' },
    { label: 'Quick Reply', value: 'QUICK_REPLY' },
]
const URLSArray = [
    { label: 'Static', value: 'static' },
    { label: 'Dynamic', value: 'dynamic' },
]
const QuickReplyArray = [
    { label: 'Custom', value: 'Custom' },
    { label: 'Marketing Opt Out', value: 'Marketing_Opt_Out' },
]

const ActionOptions = [
    { label: 'Visit Website', value: 'website' },
    { label: 'Call Phone Number', value: 'phone' },
]

const ButtonTemplate = ({ values, setButtonText, setQuickButtonText }: ButtonProps) => {
    const { setFieldValue } = useFormikContext<any>()

    const handleButtonChange = (index: number, type: 'buttons' | 'quickButtons', key: string, value: string) => {
        const updatedButtons = [...values[type]]
        updatedButtons[index][key] = value

        // Update button text array
        const updatedTexts = updatedButtons.map((button) => button.buttonText)
        if (type === 'buttons') {
            setButtonText(updatedTexts)
        } else {
            setQuickButtonText?.(updatedTexts)
        }
    }

    return (
        <Card className="p-6 shadow-md rounded-lg border border-gray-200">
            <div className="flex flex-col gap-2">
                <span className="font-bold text-lg text-gray-800">Buttons</span>
                <p className="text-sm text-gray-600">Create buttons that let customers respond to your message or take actions.</p>
            </div>
            <br />
            <br />

            <FormContainer>
                <FormItem label="Add Buttons" className="col-span-1 w-1/2">
                    <Field name="addButtons">
                        {({ field, form }: FieldProps<any>) => (
                            <Select
                                isMulti
                                placeholder="Select Filter Tags"
                                options={AddbuttonsArray}
                                getOptionLabel={(option) => option.label}
                                getOptionValue={(option) => option.value}
                                onChange={(newVal) => {
                                    const newValues = newVal ? newVal.map((val) => val.value) : []
                                    form.setFieldValue(field.name, newValues)
                                }}
                            />
                        )}
                    </Field>
                </FormItem>
            </FormContainer>

            {values?.addButtons?.includes('CALL_TO_ACTION') && (
                <FieldArray
                    name="buttons"
                    render={(arrayHelpers) => (
                        <div className="mt-6 space-y-6">
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() =>
                                    arrayHelpers.push({
                                        type: '',
                                        action: '',
                                        buttonText: '',
                                        urlType: '',
                                        websiteUrl: '',
                                        countryCode: '',
                                        phoneNumber: '',
                                        sampleUrl: '', // Add the sampleUrl field here
                                    })
                                }
                            >
                                + Add Static Button
                            </button>

                            {values.buttons?.map((button: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                                    <CommonSelect
                                        options={ActionOptions}
                                        label="Type"
                                        name={`buttons[${index}].type`}
                                        requireOnChange={true}
                                        onChange={(value: string) => {
                                            setFieldValue(`buttons[${index}].type`, value)
                                            setFieldValue(`buttons[${index}].urlType`, '')
                                            setFieldValue(`buttons[${index}].websiteUrl`, '')
                                            setFieldValue(`buttons[${index}].countryCode`, '')
                                            setFieldValue(`buttons[${index}].phoneNumber`, '')
                                            setFieldValue(`buttons[${index}].sampleUrl`, '') // Reset sampleUrl when type changes
                                        }}
                                    />

                                    <div className="flex flex-row items-center gap-2">
                                        {button.type.value === 'website' && (
                                            <div className="flex gap-4">
                                                <FormItem className="flex-1" label="Button Text">
                                                    <Field
                                                        name={`buttons[${index}].buttonText`}
                                                        placeholder="Button Text"
                                                        className="input-field border rounded-md p-2 w-full"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleButtonChange(index, 'buttons', 'buttonText', e.target.value)
                                                        }
                                                    />
                                                </FormItem>

                                                <div className="flex-1">
                                                    <CommonSelect label="Url Type" name={`buttons[${index}].urlType`} options={URLSArray} />
                                                </div>

                                                <FormItem className="flex-1" label="Web Url">
                                                    <Field
                                                        name={`buttons[${index}].websiteUrl`}
                                                        placeholder="Website Url"
                                                        className="input-field border rounded-md p-2 w-full"
                                                    />
                                                </FormItem>

                                                <div className="flex items-center justify-end ml-4">
                                                    <button
                                                        type="button"
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                        onClick={() => {
                                                            arrayHelpers.remove(index)
                                                            setButtonText(values.buttons.map((b: any) => b.buttonText))
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {button.type.value === 'phone' && (
                                            <div className="grid grid-cols-4 gap-2">
                                                <FormItem label="Button Text">
                                                    <Field
                                                        name={`buttons[${index}].buttonText`}
                                                        placeholder="Button Text"
                                                        className="input-field border rounded-md p-2 w-full"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleButtonChange(index, 'buttons', 'buttonText', e.target.value)
                                                        }
                                                    />
                                                </FormItem>
                                                <FormItem label="Country Code">
                                                    <Field
                                                        name={`buttons[${index}].countryCode`}
                                                        placeholder="Country Code"
                                                        className="input-field border rounded-md p-2 w-full"
                                                    />
                                                </FormItem>
                                                <FormItem label="Phone">
                                                    <Field
                                                        name={`buttons[${index}].phoneNumber`}
                                                        placeholder="Phone Number"
                                                        className="input-field border rounded-md p-2 w-full"
                                                    />
                                                </FormItem>
                                                <div className="flex items-center justify-end ml-4">
                                                    <button
                                                        type="button"
                                                        className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                                        onClick={() => {
                                                            arrayHelpers.remove(index)
                                                            setButtonText(values.buttons.map((b: any) => b.buttonText))
                                                        }}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    {button.urlType === 'dynamic' && (
                                        <div className="mt-4">
                                            <div>ADD SAMPLE URL</div>
                                            <div className="grid grid-cols-4 gap-2">
                                                <Field
                                                    name={`buttons[${index}].sampleUrl`}
                                                    placeholder="Sample URL"
                                                    className="input-field border rounded-md p-2 w-full"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleButtonChange(index, 'buttons', 'sampleUrl', e.target.value)
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                />
            )}

            {values?.addButtons?.includes('QUICK_REPLY') && (
                <FieldArray
                    name="quickButtons"
                    render={(arrayHelpers) => (
                        <div className="mt-6 space-y-6">
                            <button
                                type="button"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                onClick={() =>
                                    arrayHelpers.push({
                                        type: '',
                                        buttonText: '',
                                    })
                                }
                            >
                                + Add Quick Reply Button
                            </button>

                            {values.quickButtons?.map((button: any, index: number) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50 space-y-4">
                                    <div className="flex flex-row items-center gap-2">
                                        <div>
                                            <CommonSelect label="Type" name="quickReplyType" options={QuickReplyArray} />
                                        </div>
                                        {values?.quickReplyType === 'Custom' && (
                                            <FormItem label="Button Text">
                                                <Field
                                                    name={`quickButtons[${index}].buttonText`}
                                                    placeholder="Button Text"
                                                    className="input-field border rounded-md p-2 w-full"
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handleButtonChange(index, 'quickButtons', 'buttonText', e.target.value)
                                                    }
                                                />
                                            </FormItem>
                                        )}
                                        {values?.quickReplyType === 'Marketing_Opt_Out' && (
                                            <>
                                                <FormItem label="Button Text">
                                                    <Field
                                                        name={`quickButtons[${index}].buttonText`}
                                                        placeholder="Button Text"
                                                        value="Stop Promotions"
                                                        disabled
                                                        className="input-field border rounded-md p-2 w-full"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                            handleButtonChange(index, 'quickButtons', 'buttonText', e.target.value)
                                                        }
                                                    />
                                                </FormItem>
                                                <FormItem label="Footer Text">
                                                    <Field
                                                        name={`quickButtons[${index}].footerText`}
                                                        placeholder="Footer Text"
                                                        value="Not Interested"
                                                        disabled
                                                        className="input-field border rounded-md p-2 w-full"
                                                    />
                                                </FormItem>
                                            </>
                                        )}
                                        <button
                                            type="button"
                                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                            onClick={() => {
                                                arrayHelpers.remove(index)
                                                setQuickButtonText?.(values.quickButtons.map((b: any) => ''))
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                />
            )}
        </Card>
    )
}

export default ButtonTemplate
