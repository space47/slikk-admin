import { Button, Checkbox, FormItem, Input } from '@/components/ui'
import { Field, FieldProps, Form } from 'formik'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const ConfigJsonData = () => {
    const navigate = useNavigate()

    return (
        <Form className="w-full space-y-4">
            <FormItem label="Configuration Name">
                <Field name="name" component={Input} placeholder="Enter configuration name" />
            </FormItem>
            <FormItem>
                <Field name="is_active">
                    {({ field }: FieldProps) => (
                        <Checkbox checked={field.value} {...field}>
                            Active
                        </Checkbox>
                    )}
                </Field>
            </FormItem>
            <FormItem label="Configuration JSON">
                <Field name="json_value">
                    {({ field }: FieldProps) => (
                        <textarea
                            {...field}
                            rows={18}
                            className="w-full rounded-lg border p-3 font-mono text-sm"
                            placeholder={`{"example_key": "value","items": []}`}
                        />
                    )}
                </Field>
            </FormItem>
            <div className="flex justify-end gap-3">
                <Button type="button" variant="plain" onClick={() => navigate('/app/configurations')}>
                    Cancel
                </Button>
                <Button type="submit" variant="solid">
                    Save Configuration
                </Button>
            </div>
        </Form>
    )
}

export default ConfigJsonData
