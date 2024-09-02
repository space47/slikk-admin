import Chart from 'react-apexcharts'
import { COLORS } from '@/constants/chart.constant'

interface BRANDWISEDATA {
    brandData: Record<string, number>
}

const BrandDataChart = ({ brandData }: BRANDWISEDATA) => {
    const categories = Object.keys(brandData)
    const dataValues = Object.values(brandData)

    const data = [
        {
            data: dataValues,
        },
    ]

    return (
        <div>
            <div className="text-xl font-semibold">BRAND WISE DATA CHART</div>
            <Chart
                options={{
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            dataLabels: {
                                position: 'top',
                            },
                        },
                    },
                    colors: COLORS,
                    dataLabels: {
                        enabled: true,
                        offsetX: -6,
                        style: {
                            fontSize: '12px',
                            colors: ['#fff'],
                        },
                    },
                    stroke: {
                        show: true,
                        width: 1,
                        colors: ['#fff'],
                    },
                    xaxis: {
                        categories: categories,
                    },
                }}
                series={data}
                height={300}
                type="bar"
            />
        </div>
    )
}

export default BrandDataChart
