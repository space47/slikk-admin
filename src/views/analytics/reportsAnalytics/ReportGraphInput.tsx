/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useMemo } from 'react'
import GraphComponent from './reportGraphs/GraphComponent'
import { Button, Dropdown, Select } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import ReportTable from './ReportTable'

const GRAPHARRAY = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' },
    { label: 'Pie', value: 'pie' },
    { label: 'heatmap', value: 'heatmap' },
    { label: 'Composite', value: 'composite' },
]

interface ReportGraphComponentProps {
    dynamicReportTable: any[]
    xAxisValue: any
    yAxisValue: any
    yAxisValue2: any
    setXAxisvalue: any
    setYAxisvalue: any
    setYAxisvalue2: any
    selectedOption: any
    handleSelect: any
    handleDownloadCsv: any
    page: any
    pageSize: any
    onPaginationChange: any
    setPage: any
    setPageSize: any
    totalount: any
    showSpinner?: any
}

const ReportGraphInput = ({
    dynamicReportTable,
    xAxisValue,
    yAxisValue,
    yAxisValue2,
    selectedOption,
    setXAxisvalue,
    setYAxisvalue2,
    setYAxisvalue,
    handleSelect,
    handleDownloadCsv,
    page,
    pageSize,
    onPaginationChange,
    setPage,
    setPageSize,
    totalount,
    showSpinner,
}: ReportGraphComponentProps) => {
    const handleAxisValue = (axis: string, option: any, table: any) => {
        if (axis === 'x') {
            setXAxisvalue(() => ({
                [table.key]: option?.value || '',
            }))
        } else if (axis === 'y') {
            setYAxisvalue(() => ({
                [table.key]: option?.value || '',
            }))
        } else if (axis === 'y2') {
            setYAxisvalue2(() => ({
                [table.key]: option?.value || '',
            }))
        }
    }

    const Options = (table: any) => {
        return Object.keys(table.data[0] || {}).map((key) => ({
            label: key,
            value: key,
        }))
    }

    return dynamicReportTable.map((table, index) => {
        return (
            <div key={index} className="mt-5 flex flex-col gap-4">
                <div className="flex justify-end ">
                    <Button variant="new" onClick={() => handleDownloadCsv(table?.data?.name)}>
                        Download CSV
                    </Button>
                </div>

                <ReportTable
                    showSpinner={showSpinner}
                    tableData={table?.data?.data}
                    keyName={table?.data.display_name}
                    page={page}
                    pageSize={pageSize}
                    onPaginationChange={onPaginationChange}
                    orderCount={totalount}
                    setPage={setPage}
                    setPageSize={setPageSize}
                />

                <div key={table.key} className="flex gap-3">
                    <div className="flex flex-col gap-2">
                        <label>X-Axis ({table.key})</label>
                        <Select
                            className="w-[300px]"
                            placeholder={`Select X-Axis for ${table.key}`}
                            value={xAxisValue[table.key] ? { label: xAxisValue[table.key], value: xAxisValue[table.key] } : null}
                            options={Options(table?.data)}
                            onChange={(option) => handleAxisValue('x', option, table)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label>Y-Axis ({table.key})</label>
                        <Select
                            className="w-[300px]"
                            placeholder={`Select Y-Axis for ${table.key}`}
                            value={yAxisValue[table.key] ? { label: yAxisValue[table.key], value: yAxisValue[table.key] } : null}
                            options={Options(table?.data)}
                            onChange={(option) => handleAxisValue('y', option, table)}
                        />
                    </div>

                    {selectedOption === 'composite' && (
                        <div className="flex flex-col gap-2">
                            <label>Y-Axis 2 ({table.key})</label>
                            <Select
                                className="w-[300px]"
                                placeholder={`Select Y-Axis 2 for ${table.key}`}
                                value={yAxisValue2[table.key] ? { label: yAxisValue2[table.key], value: yAxisValue2[table.key] } : null}
                                options={Options(table?.data)}
                                onChange={(option) => handleAxisValue('y2', option, table)}
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-end items-center mb-7 mr-10">
                    <div className="bg-black text-white w-auto rounded-[8px] xl:mr-7 items-center flex justify-center text-xl">
                        <Dropdown
                            className="text-xl text-white bg-white font-bold border-2 border-blue-600"
                            title={selectedOption}
                            onSelect={(value) => handleSelect(value.toString())}
                        >
                            {GRAPHARRAY.map((item) => (
                                <DropdownItem key={item.value} eventKey={item.value}>
                                    <span>{item.label}</span>
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>
                </div>

                <GraphComponent
                    key={table.key}
                    keyData={table?.data}
                    selectedOption={selectedOption}
                    xAxisValue={xAxisValue}
                    yAxisValue={yAxisValue}
                    yAxisValue2={yAxisValue2}
                    setXAxisValue={setXAxisvalue}
                    setYAxisValue={setYAxisvalue}
                    setYAxisValue2={setYAxisvalue2}
                />
                <hr className="font-bold text-xl" />
                <hr className="font-bold text-xl" />
            </div>
        )
    })
}

export default ReportGraphInput
