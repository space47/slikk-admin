import { Button, FormItem, Input } from '@/components/ui'
import { Field, FieldArray } from 'formik'
import React from 'react'
import { ParametersArray } from './createNotification/createNotification.common'

interface props {
    values: any
}

const WhatsAppForm = ({ values }: props) => {
    return (
        <div>
            <>
                {/* Body Config */}
                <FormItem label="Body Config" className="w-full">
                    <FieldArray
                        name="config_data.body_config"
                        render={(arrayHelpers) => (
                            <div>
                                {values?.config_data?.body_config?.map((config, index) => (
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
                                <Button
                                    type="button"
                                    variant="accept"
                                    onClick={() => arrayHelpers.push({ textParam: '', text: '', type: 'text' })}
                                >
                                    Add Body Config
                                </Button>
                            </div>
                        )}
                    />
                </FormItem>

                <FormItem label="Header Config" className="w-full">
                    <FieldArray
                        name="config_data.header_config"
                        render={(arrayHelpers) => (
                            <div>
                                {values?.config_data?.header_config?.map((config, index) => (
                                    <div key={index} className="flex items-center space-x-4 mb-2">
                                        <div className="">{`{${config.textParam}}`}</div>
                                        <Field
                                            name={`config_data.header_config[${index}].text`}
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
                                ))}
                                <Button
                                    type="button"
                                    variant="accept"
                                    onClick={() => arrayHelpers.push({ textParam: '', text: '', type: 'text' })}
                                >
                                    Add Header Config
                                </Button>
                            </div>
                        )}
                    />
                </FormItem>

                {/* Button Config */}
                <FormItem label="Button Config" className="w-full mt-5">
                    <FieldArray
                        name="config_data.button_config"
                        render={(arrayHelpers) => (
                            <div>
                                {values?.config_data?.button_config?.map((config, index) => (
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
                                        {/* <Field
                                            name={`config_data.button_config[${index}].text`}
                                            placeholder="Enter Text"
                                            className="flex-1"
                                            component={Input}
                                        /> */}
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
                                <Button
                                    type="button"
                                    variant="accept"
                                    onClick={() =>
                                        arrayHelpers.push({
                                            url: '',
                                            index: values?.config_data?.button_config?.length || 0,
                                            sub_type: 'url',
                                        })
                                    }
                                >
                                    Add Button Config
                                </Button>
                            </div>
                        )}
                    />
                </FormItem>
            </>
        </div>
    )
}

export default WhatsAppForm
