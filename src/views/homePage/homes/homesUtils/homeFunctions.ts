import { SalesData } from '../homes.common'

export const HomeCalculations = (homeData: SalesData | null) => {
    const netSales =
        (homeData?.received?.total_amount || 0) -
        (homeData?.returned?.total_amount || 0) -
        (homeData?.cancelled?.total_amount || 0) -
        (homeData?.declined?.total_amount || 0)

    const netReturn = (homeData?.returned?.count || 0) + (homeData?.cancelled?.count || 0) + (homeData?.declined?.count || 0)

    const netReturnSales =
        (homeData?.returned?.total_amount || 0) + (homeData?.cancelled?.total_amount || 0) + (homeData?.declined?.total_amount || 0)

    const exchange = homeData?.delivery_type?.EXCHANGE || 0
    const receivedCount = homeData?.received?.count || 0

    const averageOrderValue =
        homeData && receivedCount - exchange > 0 ? (homeData.received?.total_amount || 0) / (receivedCount - exchange) : 0

    const dataValues = Object.values(homeData?.brand_wise_sale ?? {})

    const sum = dataValues.reduce((acc: number, value) => acc + value, 0)

    const basketSize = homeData && receivedCount - exchange > 0 ? sum / (receivedCount - exchange) : 0

    const receiverOrderValue = receivedCount - exchange

    return { netSales, netReturn, netReturnSales, averageOrderValue, basketSize, receiverOrderValue }
}
