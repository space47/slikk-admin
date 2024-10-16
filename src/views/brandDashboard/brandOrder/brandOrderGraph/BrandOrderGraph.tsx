import Chart from 'react-apexcharts'
import { COLOR_2 } from '@/constants/chart.constant'

type DATA_WISE_SALES = {
    dateKey: string
    total_amount: number
}

type GraphProps = {
    data: DATA_WISE_SALES[]
}

const BrandOrderGraph: React.FC<GraphProps> = ({ data }) => {
    const sortedData = data.sort((a, b) => new Date(a.dateKey).getTime() - new Date(b.dateKey).getTime())
    const Amountdata = [
        {
            name: 'Total Amount',
            data: sortedData.map((item) => item.total_amount),
        },
    ]

    return (
        <div>
            <span className="flex justify-center font-semibold">TOTAL AMOUNT</span>
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
                        categories: sortedData.map((item) => item.dateKey),
                    },
                }}
                series={Amountdata}
                width={500}
                height={300}
            />
        </div>
    )
}

export default BrandOrderGraph
