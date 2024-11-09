import Chart from 'react-apexcharts'
import { COLOR_2 } from '@/constants/chart.constant'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { useAppSelector } from '@/store'

interface LineGraphProps {
    xAxisData?: any
    yAxisData?: any
}

const ReportLineGraph = ({ xAxisData, yAxisData }: LineGraphProps) => {
    // const sortedData = [...(monthlyReport?.order_by_date || [])].sort(
    //     (a, b) => new Date(a.create_at_date).getTime() - new Date(b.create_at_date).getTime(),
    // )

    const data = [
        {
            name: 'TOTAL',
            data: xAxisData,
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
                    categories: yAxisData,
                },
            }}
            series={data}
            height={300}
        />
    )
}

export default ReportLineGraph
