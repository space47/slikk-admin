import { FormItem, Input } from '@/components/ui'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { Field } from 'formik'
import React from 'react'

const LanguageArray = [
    { label: 'English', value: 'en' },
    { label: 'English(US)', value: 'en_us' },
]
const CategoryArray = [
    { label: 'Marketing', value: 'MARKETING' },
    { label: 'Utility', value: 'UTILITY' },
]

interface TemplateDetailsProps {}

const TemplateDetails = () => {
    return (
        <div>
            <FormItem label="Template Name" className="w-full rounded-[10px]">
                <Field type="text" name="name" placeholder="Enter Title" component={Input} />
            </FormItem>
            <CommonSelect options={LanguageArray} name="language" label="Language" />
            <CommonSelect options={CategoryArray} name="category" label="Category" />
        </div>
    )
}

export default TemplateDetails
