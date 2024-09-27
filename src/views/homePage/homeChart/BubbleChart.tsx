import Chart from 'react-apexcharts'
import { COLOR_6 } from '@/constants/chart.constant'

interface BRANDWISEDATA {
    brandData: Record<string, number>
}

const BrandDataChart = ({ brandData }: BRANDWISEDATA) => {
    const categories = Object.keys(brandData).map((key) => `${key} (${brandData[key]})`)
    const dataValues = Object.values(brandData)

    const sum = dataValues.reduce((acc, value) => acc + value, 0)

    const data = [
        {
            data: dataValues,
        },
    ]

    return (
        <div>
            <div className="text-xl font-semibold">
                BRAND WISE DATA CHART : <span>({sum})</span>
            </div>
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
                            fontSize: '10px',
                            colors: ['#fff'],
                        },
                    },

                    xaxis: {
                        categories: categories,
                    },
                    yaxis: {
                        labels: {
                            style: {
                                fontSize: '7px',
                                display: 'flex',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        },
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
