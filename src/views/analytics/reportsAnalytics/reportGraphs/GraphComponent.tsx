/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from 'moment'
import React from 'react'
import ReportLineGraph from './ReportLineGraph'
import ReportPieGraph from './ReportPieChart'
import ReportCompositeGraph from './ReportCompositeGraph'

interface GraphProps {
    keyData: {
        key: any
        data: any[]
    }
    setXAxisValue: any
    setYAxisValue: any
    setYAxisValue2: any
    xAxisValue: any
    yAxisValue: any
    yAxisValue2: any
    selectedOption: any
    graphType?: any
    xAxisResponse: any
    yAxisResponse: any
}

const GraphComponent = ({
    keyData,
    xAxisValue,
    yAxisValue,
    yAxisValue2,
    selectedOption,
    graphType,
    xAxisResponse,
    yAxisResponse,
}: GraphProps) => {
    console.log('xAxisApi response', xAxisResponse, yAxisResponse)

    const getAxisValue = (defaultValue: any, conditionalValue: any) =>
        conditionalValue ? Object.values(conditionalValue).join() : defaultValue

    const xAxis = getAxisValue(xAxisResponse, xAxisValue)
    const yAxis = getAxisValue(yAxisResponse, yAxisValue)
    const yAxis2 = getAxisValue(yAxisResponse, selectedOption ? yAxisValue2 : null)

    console.log('Values of yAxis in graph is', xAxis, yAxis)

    const xAxisData = keyData.data
        .map((item) => {
            if (xAxis.toLowerCase().includes('date') && item[xAxis]) {
                return moment(item[xAxis]).utcOffset(330).format('YYYY-MM-DD')
            }
            return item[xAxis]
        })
        .filter((value) => value !== undefined)

    const yAxisData = keyData.data
        .map((item) => {
            if (yAxis.toLowerCase().includes('date') && item[yAxis]) {
                return moment(item[yAxis]).utcOffset(330).format('YYYY-MM-DD')
            }
            return item[yAxis]
        })
        .filter((value) => value !== undefined)

    console.log('YAixsData', yAxisData)
    console.log('xAixsData', xAxisData)

    const yAxisData2 = keyData.data
        .map((item) => {
            if (yAxis2.toLowerCase().includes('date') && item[yAxis2]) {
                return moment(item[yAxis2]).utcOffset(330).format('YYYY-MM-DD')
            }
            return item[yAxis2]
        })
        .filter((value) => value !== undefined)

    return (
        <div key={keyData.key}>
            {/* <div className="font-bold text-2xl mb-5">{keyData.key ? keyData.key.toUpperCase() : ''}</div> */}
            {(graphType || graphType === undefined || graphType === '') && selectedOption && (
                <>
                    {selectedOption === 'line' && (graphType === 'line' || graphType === undefined || graphType === '') && (
                        <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} type="line" />
                    )}
                    {selectedOption === 'bar' && (graphType === 'bar' || graphType === undefined || graphType === '') && (
                        <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} type="bar" />
                    )}
                    {selectedOption === 'pie' && (graphType === 'pie' || graphType === undefined || graphType === '') && (
                        <ReportPieGraph xAxisData={xAxisData} yAxisData={yAxisData} />
                    )}
                    {selectedOption === 'heatmap' && (graphType === 'heatmap' || graphType === undefined || graphType === '') && (
                        <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} type="heatmap" />
                    )}
                    {selectedOption === 'composite' && (graphType === 'composite' || graphType === undefined || graphType === '') && (
                        <ReportCompositeGraph xAxisData={xAxisData} yAxisData1={yAxisData} yAxisData2={yAxisData2} />
                    )}
                </>
            )}
        </div>
    )
}

export default GraphComponent
