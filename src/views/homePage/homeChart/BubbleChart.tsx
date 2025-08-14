/* eslint-disable @typescript-eslint/no-explicit-any */
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
            <div
                style={{
                    maxHeight: '600px',
                    overflowY: 'auto',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
                className="hide-scrollbar border border-gray-300 rounded-lg p-2"
            >
                <Chart
                    options={{
                        chart: {
                            toolbar: {
                                show: true,
                                export: {
                                    csv: {
                                        headerCategory: 'Brand',
                                        categoryFormatter(value: any) {
                                            return value?.replace(/\(.*?\)/g, '')?.trim()
                                        },

                                        filename: `BrandChart-${Math.floor(Math.random() * 100)}`,
                                    },
                                },
                            },

                            events: {
                                dataPointSelection: (event, chartContext, config) => {
                                    const label = brandName[config.dataPointIndex]

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
                    height={categories.length * 30}
                    type="bar"
                />
            </div>
        </div>
    )
}

export default BrandDataChart
