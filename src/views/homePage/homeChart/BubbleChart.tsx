import Chart from 'react-apexcharts'
import { COLOR_6 } from '@/constants/chart.constant'

interface BRANDWISEDATA {
    brandData: Record<string, number>
}

const BrandDataChart = ({ brandData }: BRANDWISEDATA) => {
    const categories = Object.keys(brandData).map(
        (key) => `${key} (${brandData[key]})`,
    )
    const dataValues = Object.values(brandData)

    console.log('CATE', categories)

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
                    colors: COLOR_6,
                    dataLabels: {
                        enabled: true,
                        offsetX: -6,
                        style: {
                            fontSize: 'auto',
                            colors: ['#fff'],
                        },
                    },

                    xaxis: {
                        categories: categories,
                        data: dataValues,
                    },
                }}
                series={data}
                height={600}
                type="bar"
            />
        </div>
    )
}

export default BrandDataChart
