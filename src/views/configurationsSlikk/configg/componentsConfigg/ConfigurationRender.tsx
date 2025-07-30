import React from 'react'
import _ from 'lodash'

export const renderValue = <T,>(value: T) => {
    if (_.isPlainObject(value)) {
        return (
            <div className="flex flex-col h-36 overflow-y-auto bg-gray-100 dark:bg-slate-600 p-3 rounded-lg shadow-inner scrollbar-hide">
                {Object.entries(value as object).map(([key, val]) => (
                    <div key={key} className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <strong className="text-gray-500 dark:text-gray-300">{key}:</strong>
                        {typeof val === 'object' && val !== null ? (
                            Array.isArray(val) ? (
                                <span className="text-indigo-600 dark:text-indigo-400">[{val.join(', ')}]</span>
                            ) : (
                                <span className="text-indigo-600 dark:text-indigo-400">{JSON.stringify(val)}</span>
                            )
                        ) : (
                            <span className="text-indigo-600 dark:text-indigo-400">{val}</span>
                        )}
                    </div>
                ))}
            </div>
        )
    } else if (_.isArray(value)) {
        return (
            <div className="flex flex-col h-36 overflow-y-auto bg-gray-100 dark:bg-slate-600 p-3 rounded-lg shadow-inner scrollbar-hide">
                {value.map((item, index) => (
                    <div key={index} className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        <span className="text-indigo-600 dark:text-indigo-400">{JSON.stringify(item)}</span>
                    </div>
                ))}
            </div>
        )
    }
    return <span className="text-indigo-600 dark:text-indigo-400">{value as React.ReactNode}</span>
}
