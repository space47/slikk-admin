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
}

const GraphComponent = ({
    keyData,
    setXAxisValue,
    setYAxisValue,
    setYAxisValue2,
    xAxisValue,
    yAxisValue,
    yAxisValue2,
    selectedOption,
}: GraphProps) => {
    console.log('KeyData Value', keyData.data)

    // Extracting xAxis and yAxis from xAxisValue and yAxisValue
    const xAxis = Object.values(xAxisValue).join()
    const yAxis = Object.values(yAxisValue).join()
    const yAxis2 = Object.values(yAxisValue2).join()
    console.log('Values', yAxis2)

    console.log('X and Y axis', xAxis, yAxis)
    // Process xAxisData
    const xAxisData = keyData.data
        .map((item) => {
            if (xAxis.toLowerCase().includes('date') && item[xAxis]) {
                return moment(item[xAxis]).utcOffset(330).format('YYYY-MM-DD')
            }
            return item[xAxis]
        })
        .filter((value) => value !== undefined)

    // Process yAxisData
    const yAxisData = keyData.data
        .map((item) => {
            if (yAxis.toLowerCase().includes('date') && item[yAxis]) {
                return moment(item[yAxis]).utcOffset(330).format('YYYY-MM-DD')
            }
            return item[yAxis]
        })
        .filter((value) => value !== undefined)

    // Process yAxisData2
    const yAxisData2 = keyData.data
        .map((item) => {
            if (yAxis2.toLowerCase().includes('date') && item[yAxis2]) {
                return moment(item[yAxis2]).utcOffset(330).format('YYYY-MM-DD')
            }
            return item[yAxis2]
        })
        .filter((value) => value !== undefined)

    console.log('XAxisDatashow', xAxisData)
    console.log('YAxisDatashow', yAxisData)

    return (
        <div key={keyData.key}>
            <h3>{keyData.key}</h3>
            {selectedOption === 'line' && <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} type="line" />}
            {selectedOption === 'bar' && <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} type="bar" />}
            {selectedOption === 'pie' && <ReportPieGraph xAxisData={xAxisData} yAxisData={yAxisData} />}
            {selectedOption === 'heatmap' && <ReportLineGraph xAxisData={xAxisData} yAxisData={yAxisData} type="heatmap" />}
            {selectedOption === 'composite' && (
                <ReportCompositeGraph xAxisData={xAxisData} yAxisData1={yAxisData} yAxisData2={yAxisData2} />
            )}
        </div>
    )
}

export default GraphComponent
