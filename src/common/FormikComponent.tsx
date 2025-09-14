import { Formik } from 'formik'
import React from 'react'

interface FormikComponentProps extends React.PropsWithChildren {
    initialValue: any
    handleSubmit: (values: any) => void
}

const FormikComponent = ({ initialValue, handleSubmit, children }: FormikComponentProps) => {
    return (
        <Formik enableReinitialize initialValues={initialValue} onSubmit={handleSubmit}>
            {children}
        </Formik>
    )
}

export default FormikComponent
