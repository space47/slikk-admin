import { Button, FormContainer, FormItem } from '@/components/ui'
import { Form, Formik } from 'formik'
import React from 'react'
import NewPageCommonForms from '../newPageSettingsUtils/NewPageCommonForms'

const AddPageSettings = () => {
    const handleSubmit = () => {}
    return (
        <div>
            <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                {({ values, resetForm }) => {
                    return (
                        <Form>
                            <NewPageCommonForms values={values} />

                            <FormContainer className="flex gap-2 items-center justify-end">
                                <FormItem>
                                    <Button variant="reject" type="button" onClick={() => resetForm()}>
                                        clear
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button variant="accept">Add</Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default AddPageSettings
