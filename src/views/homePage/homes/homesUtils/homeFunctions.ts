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

    const averageOrderValue = homeData
        ? homeData?.received?.total_amount /
          (homeData?.received?.count - (homeData?.delivery_type?.EXCHANGE ? homeData?.delivery_type?.EXCHANGE : 0))
        : 0

    const dataValues = Object.values(homeData?.brand_wise_sale ?? {})

    const sum = dataValues.reduce((acc: number, value) => acc + value, 0)

    const basketSize = homeData
        ? sum / (homeData?.received?.count - (homeData?.delivery_type?.EXCHANGE ? homeData?.delivery_type?.EXCHANGE : 0))
        : 0

    const receiverOrderValue = homeData
        ? homeData?.received.count - (homeData?.delivery_type?.EXCHANGE ? homeData?.delivery_type?.EXCHANGE : 0)
        : 0

    return { netSales, netReturn, netReturnSales, averageOrderValue, basketSize, receiverOrderValue }
}
