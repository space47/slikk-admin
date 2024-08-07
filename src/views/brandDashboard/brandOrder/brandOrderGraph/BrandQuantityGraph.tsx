import Chart from 'react-apexcharts'
import { COLOR_4 } from '@/constants/chart.constant'

type DATA_WISE_SALES = {
    dateKey: string
    total_quantity: number
}

type GraphProps = {
    data: DATA_WISE_SALES[]
}

const BrandQuantityGraph: React.FC<GraphProps> = ({ data }) => {
    const Quantitydata = [
        {
            name: 'Total Quantity',
            data: data.map((item) => item.total_quantity),
        },
    ]

    return (
        <div>
            <span className="flex justify-center font-semibold">
                TOTAL QUANTITY
            </span>
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
                    colors: [COLOR_4],
                    xaxis: {
                        categories: data.map((item) => item.dateKey),
                    },
                }}
                series={Quantitydata}
                width={500}
                height={300}
            />
        </div>
    )
}

export default BrandQuantityGraph
