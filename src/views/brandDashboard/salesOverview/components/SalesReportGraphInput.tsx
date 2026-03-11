/* eslint-disable @typescript-eslint/no-explicit-any */
import SalesGraphComponent from './reportGraph/SalesGraphComponent'
import { Dropdown, Select } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import SalesReportTable from './SalesReportTable'
import { BiBarChart, BiLineChart, BiPieChart } from 'react-icons/bi'

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
    totalount: any
    showSpinner?: any
}

const SalesReportGraphInput = ({
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

    console.log('x_axis alues are', xAxisValue, yAxisValue)

    const Options = (table: any) => {
        return Object.keys(table.data[0] || {}).map((key) => ({
            label: key,
            value: key,
        }))
    }

    return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-4 md:p-6">
            {dynamicReportTable.map((table, index) => (
                <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group"
                >
                    {/* Table Section */}
                    <div className="">
                        <SalesReportTable
                            showSpinner={showSpinner}
                            tableData={table?.data?.data}
                            keyName={table?.data?.display_name}
                            tableName={table?.data?.name}
                            orderCount={totalount}
                            handleDownloadCsv={handleDownloadCsv}
                        />
                    </div>

                    {/* Graph Section */}
                    {table?.data?.extra_attributes?.is_graph && (
                        <div className="border-t border-gray-100 bg-gradient-to-br from-gray-50/50 to-white">
                            {/* Axis Controls */}
                            <div className="p-4 md:p-6 space-y-5">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* X-Axis */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                            X-Axis
                                            <span className="text-gray-400 font-normal text-[10px]">({table.key})</span>
                                        </label>
                                        <Select
                                            className="w-full"
                                            placeholder={`Select X-Axis`}
                                            defaultValue={
                                                table?.data?.extra_attributes?.x_axis
                                                    ? {
                                                          label: table?.data?.extra_attributes?.x_axis,
                                                          value: table?.data?.extra_attributes?.x_axis,
                                                      }
                                                    : xAxisValue[table.key]
                                                      ? {
                                                            label: xAxisValue[table.key],
                                                            value: xAxisValue[table.key],
                                                        }
                                                      : null
                                            }
                                            options={Options(table?.data)}
                                            onChange={(option) => handleAxisValue('x', option, table)}
                                        />
                                    </div>

                                    {/* Y-Axis */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                            Y-Axis
                                            <span className="text-gray-400 font-normal text-[10px]">({table.key})</span>
                                        </label>
                                        <Select
                                            className="w-full"
                                            placeholder={`Select Y-Axis`}
                                            defaultValue={
                                                table?.data?.extra_attributes?.y_axis
                                                    ? {
                                                          label: table?.data?.extra_attributes?.y_axis,
                                                          value: table?.data?.extra_attributes?.y_axis,
                                                      }
                                                    : yAxisValue[table.key]
                                                      ? {
                                                            label: yAxisValue[table.key],
                                                            value: yAxisValue[table.key],
                                                        }
                                                      : null
                                            }
                                            options={Options(table?.data)}
                                            onChange={(option) => handleAxisValue('y', option, table)}
                                        />
                                    </div>
                                </div>

                                {/* Y-Axis 2 (Composite) */}
                                {selectedOption === 'composite' && (
                                    <div className="space-y-2 animate-fadeIn">
                                        <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                                            Y-Axis 2<span className="text-gray-400 font-normal text-[10px]">({table.key})</span>
                                        </label>
                                        <Select
                                            className="w-full"
                                            placeholder={`Select Secondary Y-Axis`}
                                            value={
                                                yAxisValue2[table.key]
                                                    ? {
                                                          label: yAxisValue2[table.key],
                                                          value: yAxisValue2[table.key],
                                                      }
                                                    : null
                                            }
                                            options={Options(table?.data)}
                                            onChange={(option) => handleAxisValue('y2', option, table)}
                                        />
                                    </div>
                                )}

                                {/* Graph Type Selector */}
                                <div className="flex items-center justify-end pt-2">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1 flex items-center">
                                        <Dropdown
                                            className="min-w-[140px]"
                                            title={selectedOption}
                                            onSelect={(value) => handleSelect(value.toString())}
                                        >
                                            {GRAPHARRAY.map((item) => (
                                                <DropdownItem
                                                    key={item.value}
                                                    eventKey={item.value}
                                                    className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                                                >
                                                    <span className="flex items-center gap-2">
                                                        {item.value === 'bar' && <BiBarChart className="w-4 h-4 text-blue-500" />}
                                                        {item.value === 'line' && <BiLineChart className="w-4 h-4 text-emerald-500" />}
                                                        {item.value === 'composite' && <BiBarChart className="w-4 h-4 text-purple-500" />}
                                                        {item.value === 'pie' && <BiPieChart className="w-4 h-4 text-amber-500" />}
                                                        <span className="capitalize">{item.label}</span>
                                                    </span>
                                                </DropdownItem>
                                            ))}
                                        </Dropdown>
                                    </div>
                                </div>
                            </div>

                            {/* Graph Component */}
                            <div className="px-4 md:px-6 pb-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300">
                                    <SalesGraphComponent
                                        key={`${table.key}-${index}`}
                                        keyData={table?.data}
                                        selectedOption={selectedOption}
                                        xAxisValue={xAxisValue}
                                        yAxisValue={yAxisValue}
                                        yAxisValue2={yAxisValue2}
                                        setXAxisValue={setXAxisvalue}
                                        setYAxisValue={setYAxisvalue}
                                        setYAxisValue2={setYAxisvalue2}
                                        graphType={table?.data?.extra_attributes?.graphType}
                                        xAxisResponse={table?.data?.extra_attributes?.x_axis}
                                        yAxisResponse={table?.data?.extra_attributes?.y_axis}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default SalesReportGraphInput
