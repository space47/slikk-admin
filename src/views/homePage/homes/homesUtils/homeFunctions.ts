import { useMemo } from 'react'
import { SalesData } from '../homes.common'

export const HomeCalculations = (homeData: SalesData | null) => {
    const netSales = useMemo(() => {
        return (
            (homeData?.received?.total_amount || 0) -
            (homeData?.returned?.total_amount || 0) -
            (homeData?.cancelled?.total_amount || 0) -
            (homeData?.declined?.total_amount || 0)
        )
    }, [homeData])

    const netReturn = useMemo(() => {
        return (homeData?.returned?.count || 0) + (homeData?.cancelled?.count || 0) + (homeData?.declined?.count || 0)
    }, [homeData])

    const netReturnSales = useMemo(() => {
        return (homeData?.returned?.total_amount || 0) + (homeData?.cancelled?.total_amount || 0) + (homeData?.declined?.total_amount || 0)
    }, [homeData])

    const averageOrderValue = useMemo(() => {
        if (!homeData) return 0
        const exchange = homeData?.delivery_type?.EXCHANGE || 0
        return homeData.received?.total_amount / (homeData.received?.count - exchange)
    }, [homeData])

    const dataValues = useMemo(() => {
        return Object.values(homeData?.brand_wise_sale ?? {})
    }, [homeData])

    const sum = useMemo(() => {
        return dataValues.reduce((acc: number, value) => acc + value, 0)
    }, [dataValues])

    const basketSize = useMemo(() => {
        if (!homeData) return 0
        const exchange = homeData?.delivery_type?.EXCHANGE || 0
        return sum / (homeData.received?.count - exchange)
    }, [homeData, sum])

    const receiverOrderValue = useMemo(() => {
        if (!homeData) return 0
        const exchange = homeData?.delivery_type?.EXCHANGE || 0
        return homeData.received?.count - exchange
    }, [homeData])

    return { netSales, netReturn, netReturnSales, averageOrderValue, basketSize, receiverOrderValue }
}
