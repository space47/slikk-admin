import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

interface ActiveChartProps {
    data: { [key: string]: number }
}

const ActiveChart = ({ data }: ActiveChartProps) => {
    const labels = Object.keys(data)
    const series = Object.values(data)

    console.log('Chart Labels:', labels)
    console.log('Chart Series:', series)

    return (
        <Chart
            options={{
                colors: COLORS,
                labels: labels,
                dataLabels: {
                    enabled: true,
                    formatter: (val: number, opts: any) => {
                        const index = opts.seriesIndex
                        return series[index]
                    },
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                    },
                },
                tooltip: {
                    y: {
                        formatter: (value: number) => `${value}`,
                    },
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                            legend: {
                                position: 'bottom',
                            },
                        },
                    },
                ],
            }}
            series={series}
            height={300}
            type="pie"
        />
    )
}

export default ActiveChart
