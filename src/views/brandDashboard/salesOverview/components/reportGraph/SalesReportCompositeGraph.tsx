import Chart from 'react-apexcharts'
import { COLOR_2 } from '@/constants/chart.constant'
import { useAppSelector } from '@/store'

interface LineGraphProps {
    xAxisData?: any
    yAxisData1?: any
    yAxisData2?: any
}

const SalesReportCompositeGraph = ({ xAxisData, yAxisData1, yAxisData2 }: LineGraphProps) => {
    const barChartData = [
        {
            name: 'Bar Data',
            type: 'bar',
            data: yAxisData1,
        },
    ]

    const lineChartData = [
        {
            name: 'Line Data',
            type: 'line',
            data: yAxisData2,
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
                colors: [COLOR_2, '#FF5733'], // Adjust colors for both series
                xaxis: {
                    categories: xAxisData,
                },
                yaxis: [
                    {
                        title: {
                            text: 'Bar Data',
                        },
                        labels: {
                            formatter: (val: number) => val,
                        },
                    },
                    {
                        opposite: true, // This puts the second y-axis on the opposite side
                        title: {
                            text: 'Line Data',
                        },
                        labels: {
                            formatter: (val: number) => val,
                        },
                    },
                ],
            }}
            series={[...barChartData, ...lineChartData]}
            height={300}
        />
    )
}

export default SalesReportCompositeGraph
