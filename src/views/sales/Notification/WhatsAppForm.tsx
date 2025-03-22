/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormItem, Input } from '@/components/ui'
import { Field, FieldArray } from 'formik'
import React from 'react'
import { ParametersArray } from './createNotification/createNotification.common'

interface props {
    values: any
    messageParticular: any
}

const WhatsAppForm = ({ values, messageParticular }: props) => {
    return (
        <div>
            <>
                {/* Body Config */}
                <FormItem label="Body Config" className="w-full">
                    <FieldArray
                        name="config_data.body_config"
                        render={(arrayHelpers) => (
                            <div>
                                {values?.config_data?.body_config?.map((config: any, index: any) => (
                                    <div key={index} className="flex items-center space-x-4 mb-2">
                                        <div className="">{`{${config.textParam}}`}</div>
                                        <Field
                                            name={`config_data.body_config[${index}].text`}
                                            as="select"
                                            className="flex-1 border rounded px-2 py-1"
                                        >
                                            <option disabled selected value="">
                                                Examples
                                            </option>
                                            {ParametersArray.map((item, key) => (
                                                <option key={key} value={`{${item}}`}>
                                                    {item}
                                                </option>
                                            ))}
                                        </Field>
                                        <Field
                                            name={`config_data.body_config[${index}].type`}
                                            as="select"
                                            className="flex-1 border rounded px-2 py-1"
                                        >
                                            <option value="text">Text</option>
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </Field>
                                        <Button type="button" variant="reject" onClick={() => arrayHelpers.remove(index)}>
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    />
                </FormItem>

                <FormItem label="Header Config" className="w-full">
                    <FieldArray
                        name="config_data.header_config"
                        render={(arrayHelpers) => (
                            <div>
                                {messageParticular?.components?.some((comp: any) => comp.type === 'HEADER' && comp.format === 'IMAGE') ? (
                                    <>
                                        <Field
                                            name="config_data.header_config.link"
                                            type="text"
                                            placeholder="Enter Link"
                                            className="w-full"
                                            component={Input}
                                        />
                                    </>
                                ) : Array.isArray(values?.config_data?.header_config) ? (
                                    values.config_data.header_config.map((config: any, index: number) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <div className="">{`{${config.textParam}}`}</div>
                                            <Field
                                                name={`config_data.header_config[${index}].text`}
                                                as="select"
                                                className="flex-1 border rounded px-2 py-1"
                                            >
                                                <option disabled value="">
                                                    Examples
                                                </option>
                                                {ParametersArray.map((item, key) => (
                                                    <option key={key} value={`{${item}}`}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </Field>
                                            <Field
                                                name={`config_data.header_config[${index}].type`}
                                                as="select"
                                                className="flex-1 border rounded px-2 py-1"
                                            >
                                                <option value="text">Text</option>
                                                <option value="image">Image</option>
                                                <option value="video">Video</option>
                                            </Field>
                                            <Button type="button" variant="reject" onClick={() => arrayHelpers.remove(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))
                                ) : null}
                            </div>
                        )}
                    />
                </FormItem>

                {/* Button Config */}
                {messageParticular?.components
                    ?.filter((comp: any) => comp.type === 'BUTTONS')
                    ?.some((comp: any) => comp.buttons?.some((btn: any) => btn.example)) ? (
                    <FormItem label="Button Config" className="w-full mt-5">
                        <FieldArray
                            name="config_data.button_config"
                            render={(arrayHelpers) => (
                                <div>
                                    {values?.config_data?.button_config?.map((config: any, index: any) => (
                                        <div key={index} className="flex items-center space-x-4 mb-2">
                                            <Field
                                                name={`config_data.button_config[${index}].url`}
                                                as="select"
                                                className="flex-1 border rounded px-2 py-1"
                                            >
                                                <option disabled selected value="">
                                                    Examples
                                                </option>
                                                {ParametersArray.map((item, key) => (
                                                    <option key={key} value={`{${item}}`}>
                                                        {item}
                                                    </option>
                                                ))}
                                            </Field>

                                            <Field
                                                name={`config_data.button_config[${index}].sub_type`}
                                                as="select"
                                                className="flex-1 border rounded px-2 py-1"
                                            >
                                                <option value="url">URL</option>
                                                <option value="call">Phone</option>
                                            </Field>
                                            <Field
                                                name={`config_data.button_config[${index}].index`}
                                                type="number"
                                                placeholder="Enter Index"
                                                className="flex-1"
                                                component={Input}
                                            />
                                            <Button type="button" variant="reject" onClick={() => arrayHelpers.remove(index)}>
                                                Remove
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        />
                    </FormItem>
                ) : null}
            </>
        </div>
    )
}

export default WhatsAppForm
