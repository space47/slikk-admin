/* eslint-disable @typescript-eslint/no-explicit-any */
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from '@tanstack/react-table'

interface DataType {
    type: string
    filters: any[]
    barcodes: string
    posts: string
    brands: string
    handles: string
}

interface Config {
    icon: string
    text: string
    image: string
    style: string
    position: string
}

type WebType = {
    data_type: DataType
    footer_config: Config
    header_config: Config
    component_type: string
    section_heading: string
    background_image: string
    sub_header_config: Config
}

type OrderProductsProps = {
    data?: WebType[]
}

const { Tr, Th, Td, THead, TBody } = Table

const columnHelper = createColumnHelper<WebType>()

const columns = [
    columnHelper.accessor('section_heading', {
        header: 'SECTION HEADING',
        cell: (props) => props.row.original.section_heading,
    }),
    columnHelper.accessor('component_type', {
        header: 'COMPONENT TYPE',
        cell: (props) => props.row.original.component_type,
    }),
    columnHelper.accessor('background_image', {
        header: 'Background Image',
        cell: (info) => (
            <div className="flex items-center justify-center">
                {info.getValue() ? <img src={info.getValue()} alt="Image" className="w-16 h-16 object-cover" /> : 'NA'}
            </div>
        ),
    }),
    columnHelper.accessor('header_config.image', {
        header: 'Header Image',
        cell: (info) => (
            <div className="flex items-center justify-center">
                {info.getValue() && <img src={info.getValue()} alt="Image" className="w-16 h-16 object-cover" />}
            </div>
        ),
    }),
]

const BannerDetails = ({ data = [] }: OrderProductsProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <AdaptableCard className="mb-4 border border-gray-800 w-full">
            {/* Table View - Large Screens */}
            <div className="hidden lg:block">
                <Table className="table-auto" overflow>
                    <THead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <Th key={header.id} colSpan={header.colSpan}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </Th>
                                ))}
                            </Tr>
                        ))}
                    </THead>
                    <TBody>
                        {table.getRowModel().rows.map((row) => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                                ))}
                            </Tr>
                        ))}
                    </TBody>
                </Table>
            </div>

            {/* Card View - Small Screens */}
            <div className="block lg:hidden space-y-4">
                {data.map((item, index) => (
                    <div key={index} className="border p-4 rounded-lg shadow-sm bg-white">
                        <h2 className="font-semibold text-lg">{item.section_heading}</h2>
                        <p className="text-sm text-gray-600">Component: {item.component_type}</p>
                        <div className="mt-2">
                            {item.background_image && (
                                <img src={item.background_image} alt="Background" className="w-full h-32 object-cover rounded" />
                            )}
                        </div>
                        <div className="mt-2">
                            {item.header_config?.image && (
                                <img src={item.header_config.image} alt="Header" className="w-full h-32 object-cover rounded" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </AdaptableCard>
    )
}

export default BannerDetails
