import Chart from 'react-apexcharts'
import moment from 'moment'
import { COLOR_2 } from '@/constants/chart.constant'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { useAppSelector } from '@/store'

const getMaxTotalPerMonth = (data) => {
    const monthMap = data.reduce((acc, item) => {
        const month = moment(item.create_at_date).format('MMMM')

        if (acc[month]) {
            acc[month] = Math.max(acc[month], item.total)
        } else {
            acc[month] = item.total
        }

        return acc
    }, {})

    return Object.entries(monthMap).map(([month, total]) => ({ month, total }))
}

const MonthlyReportDraph = () => {
    const { monthlyReport } = useAppSelector((state: { monthlyReport: MONTHLYREPORTTYPES }) => state.monthlyReport)

    const sortedData = [...(monthlyReport?.order_by_date || [])].sort(
        (a, b) => new Date(a.create_at_date).getTime() - new Date(b.create_at_date).getTime(),
    )

    const maxTotalsPerMonth = getMaxTotalPerMonth(sortedData)

    const data = [
        {
            name: 'TOTAL',
            data: maxTotalsPerMonth.map((item) => item.total),
        },
    ]

    const categories = maxTotalsPerMonth.map((item) => item.month)

    return (
        <Chart
            options={{
                chart: {
                    type: 'line',
                    zoom: {
                        enabled: false,
                    },
                },
                dataLabels: {
                    enabled: false,
                },
                stroke: {
                    curve: 'smooth',
                    width: 3,
                },
                colors: [COLOR_2],
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            legend: {
                                position: 'bottom',
                                offsetX: -10,
                                offsetY: 0,
                            },
                        },
                    },
                ],
                legend: {
                    position: 'right',
                    offsetY: 40,
                },
                xaxis: {
                    categories, // Use month names as categories
                },
            }}
            series={data}
            // type="bar"
            height={300}
        />
    )
}

export default MonthlyReportDraph
