/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import _ from 'lodash'
import { Field } from 'formik'
import { Input, FormItem } from '@/components/ui'

interface ObjectProps {
    obj: Record<string, any>
    parentKey?: string
    setFieldValue: (field: string, value: any) => void
}

const NestedObjectComponent = ({ obj, parentKey = '', setFieldValue }: ObjectProps) => {
    const renderFields = (obj: any, parentKey: any) => {
        return Object.entries(obj).map(([key, val]) => {
            const fieldName = parentKey ? `${parentKey}.${key}` : key
            console.log('FieldName', fieldName)

            if (_.isPlainObject(val)) {
                return (
                    <div key={fieldName} className="col-span-2">
                        <h4 className="font-semibold mb-2">{key}</h4>
                        <div className="grid grid-cols-2 gap-4">{renderFields(val, fieldName)}</div>
                    </div>
                )
            } else {
                return (
                    <FormItem key={fieldName} label={key} className="col-span-1 w-full">
                        <Field
                            component={Input}
                            type="text"
                            name={fieldName}
                            value={val}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue(fieldName, e.target.value)}
                            placeholder={`Enter ${key}`}
                        />
                    </FormItem>
                )
            }
        })
    }

    return <>{renderFields(obj, parentKey)}</>
}

export default NestedObjectComponent
