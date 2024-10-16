import Chart from 'react-apexcharts'
import { COLOR_2 } from '@/constants/chart.constant'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { useAppSelector } from '@/store'

const DailyReportDraph = () => {
    const { monthlyReport } = useAppSelector((state: { monthlyReport: MONTHLYREPORTTYPES }) => state.monthlyReport)

    const sortedData = [...(monthlyReport?.order_by_date || [])].sort(
        (a, b) => new Date(a.create_at_date).getTime() - new Date(b.create_at_date).getTime(),
    )

    const data = [
        {
            name: 'TOTAL',
            data: sortedData.map((item) => item.total),
        },
    ]

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
                xaxis: {
                    categories: sortedData.map((item) => item.create_at_date),
                },
            }}
            series={data}
            height={300}
        />
    )
}

export default DailyReportDraph
