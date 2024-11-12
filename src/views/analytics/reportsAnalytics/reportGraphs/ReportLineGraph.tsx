import Chart from 'react-apexcharts'
import { COLOR_2 } from '@/constants/chart.constant'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { useAppSelector } from '@/store'

interface LineGraphProps {
    xAxisData?: any
    yAxisData?: any
    type?: string
}

const ReportLineGraph = ({ xAxisData, yAxisData, type }: LineGraphProps) => {
    const data = [
        {
            data: yAxisData,
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
                    categories: xAxisData,
                },
            }}
            series={data}
            height={300}
            type={type ? type : 'line'}
        />
    )
}

export default ReportLineGraph
