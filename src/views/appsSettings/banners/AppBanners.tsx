import React, { useEffect, useState } from 'react'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
import moment from 'moment'
import Table from '@/components/ui/Table'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'

interface BannerType {
    id: number
    name: string
    section_heading: string
    parent_banner: string | null
    quick_filter_tags: string[]
    brand: string[]
    division: string[]
    category: string[]
    sub_category: string[]
    product_type: string[]
    type: string | null
    image_web: string
    image_mobile: string
    offers: boolean
    offer_id: string
    page: string
    from_date: string
    to_date: string
    uptooff: string
    tags: string[]
    footer: string | null
    coupon_code: string | null
    is_clickable: boolean
    section_background_web: string
    section_background_mobile: string
    max_price: number
    min_price: number
    barcodes: string
    redirection_url: string | null
}

type Option = {
    value: number
    label: string
}

const { Tr, Th, Td, THead, TBody } = Table

const pageSizeOptions = [
    { value: 10, label: '10 / page' },
    { value: 25, label: '25 / page' },
    { value: 50, label: '50 / page' },
    { value: 100, label: '100 / page' },
]

const AppBanners = () => {
    const [data, setData] = useState<BannerType[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)
    const [globalFilter, setGlobalFilter] = useState('')
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axiosInstance.get('/banners')
            const data = response.data.data.results
            const total = response.data.data.count
            setData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = data.filter((item) =>
        Object.values(item).some((val) =>
            val
                ? val
                      .toString()
                      .toLowerCase()
                      .includes(globalFilter.toLowerCase())
                : false,
        ),
    )

    const handleActionClick = (id: number) => {
        console.log('clicked', id)
    }

    const paginatedData = filteredData.slice(
        (page - 1) * pageSize,
        page * pageSize,
    )
    const totalPages = Math.ceil(totalData / pageSize)

    const handleBanner = () => {
        navigate('/app/appSettings/banners/addNew')
    }

    const columns = [
        { header: 'ID', accessor: 'id' },
        { header: 'Name', accessor: 'name', format: (value: string) => value },
        {
            header: 'Section Heading',
            accessor: 'section_heading',
            format: (value: string) => value,
        },
        {
            header: 'Parent Banner',
            accessor: 'parent_banner',
            format: (value: string) => value,
        },
        {
            header: 'Quick Filter Tags',
            accessor: 'quick_filter_tags',
            format: (value: string[]) => value?.join(', '),
        },
        {
            header: 'Brand',
            accessor: 'brand',
            format: (value: string[]) => value?.join(', '),
        },
        {
            header: 'Division',
            accessor: 'division',
            format: (value: string[]) => value?.join(', '),
        },
        {
            header: 'Category',
            accessor: 'category',
            format: (value: string[]) => value?.join(', '),
        },
        {
            header: 'Sub Category',
            accessor: 'sub_category',
            format: (value: string[]) => value?.join(', '),
        },
        {
            header: 'Product Type',
            accessor: 'product_type',
            format: (value: string[]) => value?.join(', '),
        },
        { header: 'Type', accessor: 'type' },
        {
            header: 'Image (Web)',
            accessor: 'image_web',
            format: (value: string) => (
                <img src={value} alt="web image" width="50" />
            ),
        },
        {
            header: 'Image (Mobile)',
            accessor: 'image_mobile',
            format: (value: string) => (
                <img src={value} alt="web image" width="50" />
            ),
        },
        {
            header: 'Offers',
            accessor: 'offers',
            format: (value: boolean) => (value ? 'Yes' : 'No'),
        },
        {
            header: 'Offer ID',
            accessor: 'offer_id',
            format: (value: string) => value,
        },
        { header: 'Page', accessor: 'page', format: (value: string) => value },
        {
            header: 'Valid From',
            accessor: 'from_date',
            format: (value: string) => moment(value).format('YYYY-MM-DD'),
        },
        {
            header: 'Valid To',
            accessor: 'to_date',
            format: (value: string) => moment(value).format('YYYY-MM-DD'),
        },
        { header: 'Upto Off', accessor: 'uptooff' },
        {
            header: 'Tags',
            accessor: 'tags',
            format: (value: string[]) => value?.join(', '),
        },
        { header: 'Footer', accessor: 'footer' },
        { header: 'Coupon Code', accessor: 'coupon_code' },
        {
            header: 'Is Clickable',
            accessor: 'is_clickable',
            format: (value: boolean) => (value ? 'Yes' : 'No'),
        },
        {
            header: 'Section Background (Web)',
            accessor: 'section_background_web',
        },
        {
            header: 'Section Background (Mobile)',
            accessor: 'section_background_mobile',
        },
        {
            header: 'Max Price',
            accessor: 'max_price',
            format: (value: string) => value,
        },
        {
            header: 'Min Price',
            accessor: 'min_price',
            format: (value: string) => value,
        },
        {
            header: 'Barcodes',
            accessor: 'barcodes',
            format: (value: string) => value,
        },
        {
            header: 'Redirection URL',
            accessor: 'redirection_url',
            format: (value: string) => value,
        },
        {
            header: 'Action',
            accessor: 'id',
            format: (value: number) => (
                <Button onClick={() => handleActionClick(value)}>EDIT</Button>
            ),
        },
    ]

    return (
        <div>
            <div className="flex justify-between mb-5">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search here"
                        value={globalFilter}
                        className="p-2 border rounded"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>

                <div>
                    <Button variant="new" onClick={handleBanner}>
                        Add New Banner
                    </Button>
                </div>
            </div>
            <Table>
                <THead>
                    <Tr>
                        {columns.map((col) => (
                            <Th key={col.header}>{col.header}</Th>
                        ))}
                    </Tr>
                </THead>
                <TBody>
                    {paginatedData.map((row) => (
                        <Tr key={row.id}>
                            {columns.map((col) => (
                                <Td key={col.accessor}>
                                    {col.format
                                        ? col.format(row[col.accessor])
                                        : row[col.accessor]}
                                </Td>
                            ))}
                        </Tr>
                    ))}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    currentPage={page}
                    
                    onChange={(page) => setPage(page)}
                    total={totalPages}
                />
                <div style={{ minWidth: 130 }}>
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find(
                            (option) => option.value === pageSize,
                        )}
                        options={pageSizeOptions}
                        onChange={(option) =>
                            setPageSize(Number(option?.value))
                        }
                    />
                </div>
            </div>
        </div>
    )
}

export default AppBanners
