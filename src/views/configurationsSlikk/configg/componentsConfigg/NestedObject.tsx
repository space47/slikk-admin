import React, { useState, useEffect } from 'react'
import { Field, FieldArray } from 'formik'

const NestedObject = ({ parentKey, obj }) => {
    const [entries, setEntries] = useState([])

    // Sync entries with obj whenever obj changes
    useEffect(() => {
        setEntries(Object.entries(obj || {}))
    }, [obj])

    return (
        <FieldArray
            name={parentKey || ''}
            render={(arrayHelpers) => {
                return (
                    <div>
                        {entries.map(([key, value], index) => (
                            <div key={index} className="flex items-center space-x-4 mb-2">
                                {/* Input for key */}
                                <Field
                                    name={`${parentKey}[${index}].key`}
                                    placeholder="Key"
                                    value={key}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const newKey = e.target.value
                                        const updatedEntries = [...entries]
                                        updatedEntries[index] = [newKey, value]
                                        setEntries(updatedEntries)

                                        const updatedObj = { ...obj }
                                        delete updatedObj[key] // Remove the old key
                                        updatedObj[newKey] = value // Add the new key with the same value
                                        arrayHelpers.form.setFieldValue(parentKey, updatedObj)
                                    }}
                                    className="border rounded px-2 py-1 w-full"
                                />

                                {/* Input for value */}
                                <Field
                                    name={`${parentKey}[${index}].value`}
                                    placeholder="Value"
                                    value={value}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        const updatedEntries = [...entries]
                                        updatedEntries[index] = [key, e.target.value]
                                        setEntries(updatedEntries)

                                        const updatedObj = { ...obj, [key]: e.target.value }
                                        arrayHelpers.form.setFieldValue(parentKey, updatedObj)
                                    }}
                                    className="border rounded px-2 py-1 w-full"
                                />

                                {/* Remove button */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updatedEntries = entries.filter((_, i) => i !== index)
                                        setEntries(updatedEntries)

                                        const updatedObj = { ...obj }
                                        delete updatedObj[key] // Remove the key-value pair
                                        arrayHelpers.form.setFieldValue(parentKey, updatedObj)
                                    }}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        {/* Add button */}
                        <button
                            type="button"
                            onClick={() => {
                                const newKey = `key${entries.length + 1}`
                                const updatedEntries = [...entries, [newKey, '']]
                                setEntries(updatedEntries)

                                arrayHelpers.form.setFieldValue(parentKey, { ...obj, [newKey]: '' })
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                        >
                            Add
                        </button>
                    </div>
                )
            }}
        />
    )
}

export default NestedObject
