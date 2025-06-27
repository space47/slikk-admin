import { useFetchSingleData } from '@/commonHooks/useFetchSingleData'
import { Button, FormContainer, FormItem } from '@/components/ui'
import { pageSettingsType } from '@/store/types/pageSettings.types'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { InitialValuesEdit } from '../newPageSettingsUtils/newpageConstants'
import NewPageCommonForms from '../newPageSettingsUtils/NewPageCommonForms'

const EditPageSettings = () => {
    const { section_id } = useParams()
    const queryParams =
        useMemo(() => {
            if (!section_id) {
                return
            }
            return `/section?section_id=${section_id}`
        }, [section_id]) || ''

    const { data: pageSettingsData } = useFetchSingleData<pageSettingsType>({ url: queryParams })

    const [initialValue, setInitialValue] = useState({})

    useEffect(() => {
        setInitialValue(InitialValuesEdit(pageSettingsData))
    }, [pageSettingsData])

    const handleSubmit = () => {}
    return (
        <div>
            <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
                {({ values, resetForm }) => {
                    return (
                        <Form>
                            <NewPageCommonForms
                                isEdit
                                values={values}
                                initialValue={initialValue as pageSettingsType}
                                setInitialValue={setInitialValue}
                            />
                            <FormContainer className="flex gap-2 mt-4 items-center justify-end">
                                <FormItem>
                                    <Button variant="reject" type="button" onClick={() => resetForm()}>
                                        clear
                                    </Button>
                                </FormItem>
                                <FormItem>
                                    <Button variant="accept">Edit</Button>
                                </FormItem>
                            </FormContainer>
                        </Form>
                    )
                }}
            </Formik>
        </div>
    )
}

export default EditPageSettings
