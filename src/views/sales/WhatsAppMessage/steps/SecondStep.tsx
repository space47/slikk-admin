import SearchableGroups from '@/common/SearchableGroups'
import { FormContainer, FormItem, Input, Select } from '@/components/ui'
import { Field, FieldProps } from 'formik'
import React, { useState } from 'react'

const SecondStep = () => {
    const [searchInputs, setSearchInputs] = useState<string>('')

    const handleSearch = (inputValue: string) => {
        setSearchInputs(inputValue)
    }

    return (
        <div>
            <FormContainer>
                <FormItem>
                    <FormItem label="Template Name">
                        <Field name="template_name" type="text" component={Input} placeholder="Template Name" />
                    </FormItem>
                    <FormItem label="Language Code">
                        <Field name="language_code" type="text" component={Input} placeholder="Language Code" />
                    </FormItem>
                    <FormItem label="User">
                        <Field name="user" type="text" component={Input} placeholder="user " />
                    </FormItem>
                    <SearchableGroups label="Group Name" name="group" searchInputs={searchInputs} handleSearch={handleSearch} />
                </FormItem>
            </FormContainer>
        </div>
    )
}

export default SecondStep
