import { useAppDispatch, useAppSelector } from '@/store'
import { OffersInitialStateType, setOffersData } from '@/store/slices/offerSlice/offerSlice'
import axios from 'axios'
import { useEffect } from 'react'

export const useOffersApi = () => {
    const dispatch = useAppDispatch()
    const { offers } = useAppSelector<OffersInitialStateType>((state) => state.offers)

    const fetchOffers = async () => {
        try {
            const res = await axios.get(`http://slikk-offer-lb-new-431979695.ap-south-1.elb.amazonaws.com/v1/offers`)
            const data = res?.data?.body?.data
            console.log('Response:', data)
            dispatch(setOffersData(data))
        } catch (error) {
            console.error(error)
        }
    }

    console.log(offers)
    useEffect(() => {
        fetchOffers()
    }, [])

    return { offers }
}
