import React from 'react'
import { UtmArray } from '../sendNotify.common'
import { FormItem, Input } from '@/components/ui'
import { Field } from 'formik'

const ThirdStepNotification = () => {
    return (
        <div className="space-y-6 shadow-lg rounded-lg px-14 py-9">
            <div className="text-xl font-bold">Select UTM Filters</div>
            {UtmArray.map((item, key) => (
                <FormItem key={key} label={item.label} className={item.classname}>
                    <Field type={item.type} name={item.name} placeholder={item.placeholder} component={Input} />
                </FormItem>
            ))}
        </div>
    )
}

export default ThirdStepNotification
