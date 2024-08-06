/* eslint-disable @typescript-eslint/no-explicit-any */
import AdaptableCard from '@/components/shared/AdaptableCard'
import Table from '@/components/ui/Table'

import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
} from '@tanstack/react-table'

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
        cell: (props) => {
            const row = props.row.original
            return <div>{row.section_heading}</div>
        },
    }),

    columnHelper.accessor('component_type', {
        header: 'COMPONENT TYPE',
        cell: (props) => {
            const row = props.row.original
            return <div>{row.component_type}</div>
        },
    }),
    columnHelper.accessor('background_image', {
        header: 'Background Image',
        cell: (info) => {
            return (
                <div className="w-[200px] h-[100px] flex items-center justify-center">
                    {info.getValue() && (
                        <img
                            src={info.getValue()}
                            alt="Image"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            )
        },
    }),
    columnHelper.accessor('header_config.image', {
        header: 'Header Image',
        cell: (info) => {
            return (
                <div className="w-[200px] h-[100px] flex items-center justify-center">
                    {info.getValue() && (
                        <img
                            src={info.getValue()}
                            alt="Image"
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            )
        },
    }),
]

const BannerDetails = ({ data }: OrderProductsProps) => {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <AdaptableCard className="mb-4 border border-gray-800">
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
        </AdaptableCard>
    )
}

export default BannerDetails
