import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useState } from 'react'
import OfferForms from '../offersUtils/OfferForms'

const OffersAdd = () => {
    const [buyFilterId, setBuyFilterId] = useState<string | undefined>(undefined)
    const [getFilterId, setGetFilterId] = useState<string | undefined>(undefined)
    const handleSubmit = async (values: any) => {
        console.log(values)
    }

    return (
        <div>
            <div className="bg-gray-50 rounded-2xl">
                <Formik enableReinitialize initialValues={{}} onSubmit={handleSubmit}>
                    {({ values }) => (
                        <Form className="w-full shadow-xl p-3 rounded-2xl ">
                            <FormContainer className="">
                                <OfferForms
                                    buyFilterId={buyFilterId as string}
                                    getFilterId={getFilterId as string}
                                    setBuyFilterId={setBuyFilterId}
                                    setGetFilterId={setGetFilterId}
                                    values={values}
                                />
                            </FormContainer>
                            <FormContainer>
                                <Button variant="solid" type="submit" className="bg-blue-500 text-white">
                                    Submit
                                </Button>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default OffersAdd
