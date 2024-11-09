import Chart from 'react-apexcharts'
import { COLOR_2, COLORS } from '@/constants/chart.constant'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { useAppSelector } from '@/store'

interface LineGraphProps {
    xAxisData?: any
    yAxisData?: any
}

const ReportPieGraph = ({ xAxisData, yAxisData }: LineGraphProps) => {
    console.log('Y axis data in graph', yAxisData)

    // Ensure yAxisData represents values for each slice of the pie chart
    const data = yAxisData

    return (
        <Chart
            options={{
                colors: COLORS,
                labels: xAxisData, // Use xAxisData as the categories (labels) for the pie chart
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
                legend: {
                    position: 'right', // Customize legend position
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '50%', // Make the pie chart into a donut if desired
                        },
                    },
                },
            }}
            series={data} // Pie chart expects series to be numerical values
            height={300}
            type="pie" // Pie chart type
        />
    )
}

export default ReportPieGraph
