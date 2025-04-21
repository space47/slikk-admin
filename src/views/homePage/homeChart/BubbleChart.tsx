import Chart from 'react-apexcharts'
import { COLOR_6 } from '@/constants/chart.constant'
import { useNavigate } from 'react-router-dom'

interface BRANDWISEDATA {
    brandData: Record<string, number>
    from: any
    to: any
}

const BrandDataChart = ({ brandData, from, to }: BRANDWISEDATA) => {
    const brandName = Object.keys(brandData).map((key) => key)
    const categories = Object.keys(brandData).map((key) => `${key} (${brandData[key]})`)
    const dataValues = Object.values(brandData)
    const navigate = useNavigate()
    const sum = dataValues.reduce((acc, value) => acc + value, 0)

    const data = [
        {
            data: dataValues,
        },
    ]

    return (
        <div>
            <div className="text-xl font-bold text-blue-900">
                BRAND WISE DATA CHART : <span>({sum})</span>
            </div>
            <Chart
                options={{
                    chart: {
                        events: {
                            dataPointSelection: (event, chartContext, config) => {
                                const label = brandName[config.dataPointIndex]
                                console.log('Clicked label:', label, from, to)
                                navigate(`/app/analytics/orders`, {
                                    state: {
                                        stateName: label,
                                        var1: from,
                                        var2: to,
                                    },
                                })
                            },
                        },
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                            dataLabels: {
                                position: 'top',
                            },
                        },
                    },
                    fill: {
                        colors: COLOR_6,
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
                                fontSize: '9px',
                                display: 'flex',
                                fontWeight: 'bold',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            },
                        },
                    },
                }}
                series={data}
                height={1200}
                type="bar"
            />
        </div>
    )
}

export default BrandDataChart
