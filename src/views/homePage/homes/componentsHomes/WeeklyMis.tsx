/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Chart from 'react-apexcharts'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { errorMessage } from '@/utils/responseMessages'
import { AxiosError } from 'axios'
import { Button } from '@/components/ui'
import { FaSync } from 'react-icons/fa'

interface Props {
    from: string
    to: string
}

const WeeklyMis = ({ from, to }: Props) => {
    const [userData, setUserData] = useState<any[]>([])
    const [showSpinner, setShowSpinner] = useState(false)
    const [refreshToggle, setRefreshToggle] = useState(false)

    const fetchUserTable = useCallback(async () => {
        try {
            setShowSpinner(true)
            const response = await axioisInstance.get(`query/execute/Mis_Report?query_name=Daily_MIS&start_date=${from}&end_date=${to}`)
            const data = response?.data?.data
            const firstKey = data && Object.keys(data)[0]
            const fetchedData = firstKey ? (data[firstKey]?.data ?? []) : []

            setUserData(fetchedData)
        } catch (error) {
            if (error instanceof AxiosError) {
                errorMessage(error)
            }
        } finally {
            setShowSpinner(false)
            setRefreshToggle(false)
        }
    }, [from, to, refreshToggle])

    useEffect(() => {
        fetchUserTable()
    }, [fetchUserTable])

    const metricsData = useMemo(() => {
        if (!userData.length) return null

        const result: Record<string, number> = {}

        userData.forEach((row) => {
            Object.entries(row).forEach(([key, value]) => {
                if (key === 'Date') return

                if (typeof value === 'string' && value.includes('₹')) {
                    const num = Number(value.replace(/[₹,]/g, ''))
                    if (!isNaN(num)) {
                        result[key] = (result[key] ?? 0) + num
                    }
                    return
                }
                if (typeof value === 'number') {
                    result[key] = (result[key] ?? 0) + value
                }
            })
        })

        return result
    }, [userData])

    console.log('metrics data', metricsData)

    const categories = useMemo(() => (metricsData ? Object.keys(metricsData) : []), [metricsData])

    const series = useMemo(
        () =>
            metricsData
                ? [
                      {
                          name: 'MIS Metrics',
                          data: Object.values(metricsData),
                      },
                  ]
                : [],
        [metricsData],
    )

    const maxValue = useMemo(() => {
        if (!metricsData) return 100
        const values = Object.values(metricsData)
        if (values.length === 0) return 100
        const max = Math.max(...values)
        return max * 1.2
    }, [metricsData])

    return (
        <div className="bg-white p-4 rounded-md">
            <div className="flex justify-between">
                <h3 className="text-blue-700">Mis Report</h3>
                <div className="">
                    <Button
                        className="flex flex-row gap-2 items-center"
                        size="sm"
                        variant="pending"
                        onClick={() => setRefreshToggle((prev) => !prev)}
                        icon={<FaSync />}
                    ></Button>
                </div>
            </div>

            {showSpinner ? (
                <div className="text-center py-10">Loading...</div>
            ) : (
                <Chart
                    type="line"
                    height={350}
                    series={series}
                    options={{
                        chart: {
                            type: 'bar',
                            toolbar: { show: true },
                            zoom: { enabled: false },
                        },
                        plotOptions: {
                            bar: {
                                columnWidth: '60%',
                                borderRadius: 6,
                                dataLabels: {
                                    position: 'top',
                                },
                            },
                        },
                        dataLabels: {
                            enabled: true,
                            formatter: function (val: number) {
                                return val.toLocaleString('en-IN')
                            },
                            offsetY: -20,
                            style: {
                                fontSize: '12px',
                                colors: ['#304758'],
                            },
                        },
                        xaxis: {
                            categories,
                            labels: {
                                rotate: -45,
                                style: {
                                    fontSize: '12px',
                                    fontWeight: 600,
                                },
                                trim: true,
                                maxHeight: 100,
                            },
                            title: {
                                text: 'Metrics',
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                },
                            },
                            tickPlacement: 'on',
                        },
                        yaxis: {
                            labels: {
                                formatter: function (val: number) {
                                    return val.toLocaleString('en-IN')
                                },
                            },
                            title: {
                                text: 'Values',
                                style: {
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                },
                            },
                            max: maxValue,
                            forceNiceScale: true,
                        },
                        tooltip: {
                            y: {
                                formatter: function (val: number) {
                                    return val.toLocaleString('en-IN')
                                },
                            },
                        },
                        grid: {
                            borderColor: '#f1f1f1',
                            strokeDashArray: 5,
                        },
                        colors: ['#3B82F6'], // Blue color for bars
                        responsive: [
                            {
                                breakpoint: 768,
                                options: {
                                    plotOptions: {
                                        bar: {
                                            columnWidth: '70%',
                                        },
                                    },
                                    dataLabels: {
                                        enabled: false,
                                    },
                                    xaxis: {
                                        labels: {
                                            rotate: -90,
                                            maxHeight: 120,
                                        },
                                    },
                                },
                            },
                        ],
                    }}
                />
            )}
        </div>
    )
}

export default WeeklyMis
