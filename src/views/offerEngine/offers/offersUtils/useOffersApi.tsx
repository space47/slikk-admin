import { useAppDispatch, useAppSelector } from '@/store'
import { offersService } from '@/store/services/offersService'
import { OffersInitialStateType, setOffersData, setPage, setPageSize } from '@/store/slices/offerSlice/offerSlice'
import { useEffect } from 'react'

export const useOffersApi = () => {
    const dispatch = useAppDispatch()
    const { offers, page, pageSize } = useAppSelector<OffersInitialStateType>((state) => state.offers)
    const { data, isSuccess, isError, error } = offersService.useOffersQuery(
        {
            page: page,
            pageSize: pageSize,
        },
        {
            refetchOnMountOrArgChange: true,
        },
    )

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setOffersData(data.body?.data || []))
        }
    }, [isSuccess, data])

    return { offers, page, pageSize, setPage, setPageSize, isError, error }
}
