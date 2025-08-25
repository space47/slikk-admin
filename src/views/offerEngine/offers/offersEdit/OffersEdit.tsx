/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, FormContainer } from '@/components/ui'
import { Form, Formik } from 'formik'
import React, { useEffect, useState, useRef } from 'react'
import OfferForms from '../offersUtils/OfferForms'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { OfferFormTypes } from '../../offerEngineCommon'
import { useOfferFunctions } from '../offersUtils/useOfferFunctions'
import { getChangedValues, hasChanges } from '@/common/objectDiff'

const OffersEdit = () => {
    const { id } = useParams()
    const [offersData, setOffersData] = useState<OfferFormTypes | null>(null)
    const [buyFilterId, setBuyFilterId] = useState<any>(undefined)
    const [getFilterId, setGetFilterId] = useState<any>(undefined)
    const initialValuesRef = useRef<any>(null)

    const fetchOfferDetails = async () => {
        try {
            const response = await axios.get(`http://slikk-offer-lb-new-431979695.ap-south-1.elb.amazonaws.com/v1/offers/${id}`)
            setOffersData(response?.data?.body?.data)
        } catch (error) {
            console.error('Error fetching offer details:', error)
        }
    }

    useEffect(() => {
        fetchOfferDetails()
    }, [id])

    useEffect(() => {
        if (offersData) {
            setBuyFilterId(offersData?.buy_filter_id as number)
            setGetFilterId(offersData?.get_filter_id as number)
        }
    }, [offersData])

    const { initialValues } = useOfferFunctions({ offersData })

    useEffect(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            initialValuesRef.current = { ...initialValues }
        }
    }, [initialValues])

    const handleSubmit = async (values: any) => {
        if (!initialValuesRef.current) return

        const changedValues = getChangedValues(values, initialValuesRef.current)
        if (!hasChanges(values, initialValuesRef.current)) {
            alert('No changes detected')
            return
        }

        try {
            const response = await axios.patch(
                `http://slikk-offer-lb-new-431979695.ap-south-1.elb.amazonaws.com/v1/offers/${id}`,
                changedValues,
            )
            console.log('Update successful:', response.data)
            initialValuesRef.current = { ...values }
            fetchOfferDetails()
        } catch (error) {
            console.error('Error updating offer:', error)
        }
    }

    return (
        <div>
            <div className="bg-gray-50 rounded-2xl">
                <Formik enableReinitialize initialValues={initialValues} onSubmit={handleSubmit}>
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
                                    Update Offer
                                </Button>
                            </FormContainer>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    )
}

export default OffersEdit
