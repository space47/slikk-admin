import Chart from 'react-apexcharts'
import moment from 'moment'
import { COLOR_2 } from '@/constants/chart.constant'
import { MONTHLYREPORTTYPES } from '@/store/types/monthlyReport.types'
import { useAppSelector } from '@/store'

function convertDatesToDays(orderData) {
    return orderData.map((item) => {
        const day = moment(item.create_at_date).format('dddd') // Get the day name (e.g., "Monday")

        return {
            day: day,
            total: item.total,
        }
    })
}

const weekDaysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const WeekOnWeekGraph = () => {
    const { monthlyReport } = useAppSelector((state: { monthlyReport: MONTHLYREPORTTYPES }) => state.monthlyReport)

    const sortedData = monthlyReport?.order_by_date
    const groupedData = convertDatesToDays(sortedData)

    console.log('groupdata', groupedData)

    const data = [
        {
            name: 'TOTAL',
            data: groupedData.map((item) => item.total),
        },
    ]

    return (
        <Chart
            options={{
                chart: {
                    type: 'bar',
                    stacked: true,
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
                colors: [COLOR_2, '#FF4560', '#775DD0'],
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
                    categories: groupedData.map((item) => item.day),
                },
            }}
            series={data}
            type="bar"
            height={300}
        />
    )
}

export default WeekOnWeekGraph
