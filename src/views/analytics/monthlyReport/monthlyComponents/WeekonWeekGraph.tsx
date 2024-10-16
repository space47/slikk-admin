/* eslint-disable @typescript-eslint/no-explicit-any */
import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'
import { useAppSelector } from '@/store'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { useMemo } from 'react'

const WeekOnWeekGraph = () => {
    const { monthlyReport } = useAppSelector((state: { monthlyReport: MONTHLYREPORTTYPES }) => state.monthlyReport)
    const orderState = monthlyReport?.order_by_date

    const transformData = () => {
        const weeksData: any = []

        for (let i = 0; i < 4; i++) {
            weeksData.push(Array(7).fill(0))
        }

        orderState?.forEach((order) => {
            const orderDate = new Date(order.create_at_date)
            const dayIndex = (orderDate.getDay() + 6) % 7
            const weekIndex = Math.floor((orderDate.getDate() - 1) / 7)

            if (weekIndex < 4) {
                weeksData[weekIndex][dayIndex] += order.total
            }
        })

        const seriesData = weeksData.map((weekData: any, index: any) => ({
            name: `Week ${index + 1}`,
            data: weekData,
        }))

        return seriesData
    }

    const data = useMemo(() => transformData(), [orderState])

    return (
        <Chart
            options={{
                chart: {
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                },
                colors: [...COLORS],
                // dataLabels: {
                //     enabled: false,
                // },
                stroke: {
                    width: [3],
                    curve: 'smooth',
                },
                legend: {
                    tooltipHoverFormatter: function (val, opts) {
                        return val + ' - ' + opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] + ''
                    },
                },
                markers: {
                    size: 0,
                    hover: {
                        sizeOffset: 6,
                    },
                },
                xaxis: {
                    categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                },
                tooltip: {
                    y: [
                        {
                            title: {
                                formatter: function (val) {
                                    return val + ':'
                                },
                            },
                        },
                    ],
                },
                grid: {
                    borderColor: '#f1f1f1',
                },
            }}
            series={data}
            height={300}
        />
    )
}

export default WeekOnWeekGraph
