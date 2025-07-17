/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react'
import moment from 'moment'
import { FaEdit, FaSync, FaTrash } from 'react-icons/fa'

interface ColumnProps {
    data: any[]
    bannerIdStore: number[]
    updatedPosition?: Record<number, number>
    handleSelectAllBanners: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSelectBannerId: (id: number, isSelected: boolean) => void
    handleUpdate: (id: number, position: number) => void
    handleQuantityChange: (id: number, quantity: number) => void
    handleDeleteClick: (id: number) => void
}

export const useBannerColumns = ({
    data,
    bannerIdStore,
    updatedPosition = {},
    handleSelectAllBanners,
    handleSelectBannerId,
    handleUpdate,
    handleQuantityChange,
    handleDeleteClick,
}: ColumnProps) => {
    return useMemo(
        () => [
            {
                header: (
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <input
                            type="checkbox"
                            name="selectAll"
                            checked={data.length > 0 && bannerIdStore.length === data.length}
                            onChange={handleSelectAllBanners}
                        />
                    </div>
                ),
                accessorKey: 'id',
                cell: ({ row }: { row: { original: any } }) => {
                    const bannerId = row.original.id
                    return (
                        <div className="flex items-center justify-center">
                            <input
                                type="checkbox"
                                name="bannerId"
                                checked={bannerIdStore.includes(bannerId)}
                                onChange={(e) => handleSelectBannerId(bannerId, e.target.checked)}
                            />
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: 'id',
                cell: ({ row }: { row: { original: any } }) => (
                    <button className="border-none bg-none">
                        <a href={`/app/appSettings/banners/${row.original.id}`} target="_blank" rel="noreferrer">
                            <FaEdit className="text-xl text-blue-600" />
                        </a>
                    </button>
                ),
            },

            {
                header: 'Status',
                accessorKey: '',
                cell: ({ row }: any) => {
                    const now = moment()
                    const fromDate = moment(row.original.from_date)
                    const toDate = moment(row.original.to_date)

                    let status = ''
                    let className = 'px-2 py-1 rounded-md text-xs text-white items-center font-medium flex justify-center'

                    if (now.isAfter(toDate)) {
                        status = 'Expired'
                        className += ' bg-red-500'
                    } else if (now.isBefore(fromDate)) {
                        status = 'Upcoming'
                        className += ' bg-yellow-500 '
                    } else {
                        status = 'Live'
                        className += ' bg-green-500 '
                    }

                    return <div className={className}>{status}</div>
                },
            },
            { header: 'Name', accessorKey: 'name' },
            {
                header: 'Position',
                accessorKey: 'position',
                cell: ({ row }: { row: { original: any } }) => {
                    const stockId = row.original.id
                    const position = updatedPosition[stockId] ?? row.original.position

                    return (
                        <div className="flex gap-1 items-center">
                            <input
                                className="w-[60px]"
                                type="number"
                                min={0}
                                value={position}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleUpdate(stockId, position)
                                    }
                                }}
                                onChange={(e) => handleQuantityChange(stockId, Number(e.target.value))}
                            />
                            <button
                                className="px-4 py-2 bg-none text-xl rounded font-bold text-green-600"
                                onClick={() => handleUpdate(stockId, position)}
                            >
                                <FaSync />
                            </button>
                        </div>
                    )
                },
            },
            { header: 'Section Heading', accessorKey: 'section_heading' },
            {
                header: 'Brand Name',
                accessorKey: 'brand',
                cell: ({ row }: { row: { original: any } }) =>
                    row.original.brand.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },
            {
                header: 'DIVISION Name',
                accessorKey: 'division',
                cell: ({ row }: { row: { original: any } }) =>
                    row.original.division.map((item: any, key: number) => <div key={key}>{item.name}</div>),
            },
            {
                header: 'Image (WEB)',
                accessorKey: 'image_web',
                cell: ({ getValue }: { getValue: () => string }) => {
                    const value = getValue()
                    return value ? <img src={value.split(',')[0]} alt="" className="object-contain w-[100px] h-[100px]" /> : ''
                },
            },
            {
                header: 'Image (Mobile)',
                accessorKey: 'image_mobile',
                cell: ({ getValue }: { getValue: () => string }) => {
                    const value = getValue()
                    return value ? <img src={value.split(',')[0]} alt="" className="object-contain w-[100px]" /> : ''
                },
            },
            {
                header: 'From Update',
                accessorKey: 'from_date',
                cell: ({ getValue }: { getValue: () => string }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'To Update',
                accessorKey: 'to_date',
                cell: ({ getValue }: { getValue: () => string }) => <span>{moment(getValue()).format('YYYY-MM-DD hh:mm:ss a')}</span>,
            },
            {
                header: 'Delete',
                accessorKey: 'id',
                cell: ({ row }: { row: { original: any } }) => (
                    <button onClick={() => handleDeleteClick(row.original.id)} className="border-none bg-none">
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                ),
            },
        ],
        [data, bannerIdStore, updatedPosition],
    )
}
