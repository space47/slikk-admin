/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import Tabs from '@/components/ui/Tabs'
import { MdOutlinePendingActions } from 'react-icons/md'
import { FaCheck } from 'react-icons/fa'
import { RxCross1 } from 'react-icons/rx'
import Pending from './pending/Pending'
import Accepted from './accepted/Accepted'
import Rejected from './rejected/Rejected'
import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'

const { TabNav, TabList, TabContent } = Tabs

interface Product {
    barcode: string
    mrp: string
    sp: string
    name: string
    brand: string
    product_feedback: string | null
    is_wish_listed: boolean
    is_try_and_buy: boolean
    trends: any | null
    styles: any | null
    inventory_count: number
    image: string
    division: string
    category: string
    sub_category: string
    product_type: string
    variants: any[]
}

interface Post {
    id: number
    url: string
    products: Product[]
    post_id: string
    caption: string
    type: string
    latitude: string
    longitude: string
    likes_count: number
    comments_count: number
    clicks_count: number
    unique_clicks_count: number
    views_count: number
    thumbnail_url: string
    low_res_url: string
    video_url: string
    video_low_bandwidth_url: string
    video_low_res_url: string
    is_active: boolean
    create_date: string
    update_date: string
    approval_status: string
    owner: string
}

const CreatorPost = () => {
    const [activeTab, setActiveTab] = useState('tab1')

    const [totalData, setTotalData] = useState(0)
    const [tableData, setTableData] = useState<Post[]>([])
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')

    const fetchData = async (
        status: string,
        page = 1,
        pageSize = 10,
        filter: string = '',
    ) => {
        try {
            const response = await axiosInstance.get(
                `userposts/approval?status=${status}&p=${page}&page_size=${pageSize}&name=${filter}`,
            )
            const data = response.data.data.results
            const total = response.data.data.count
            setTableData(data)
            setTotalData(total)
        } catch (error) {
            console.error(error)
        }
    }

    const handleChange = (tab: string) => {
        setActiveTab(tab)
        setPage(1)
    }

    useEffect(() => {
        let status = 'PENDING'
        if (activeTab === 'tab2') status = 'APPROVED'
        if (activeTab === 'tab3') status = 'REJECTED'

        console.log('Active Tab........', activeTab)
        console.log('Page...........', page)
        console.log('Page Size........', pageSize)
        console.log('Status.........', status)

        fetchData(status, page, pageSize, globalFilter)
    }, [activeTab, page, pageSize, globalFilter])

    return (
        <div>
            <Tabs defaultValue="tab1" onChange={handleChange}>
                <TabList>
                    <TabNav value="tab1" icon={<MdOutlinePendingActions />}>
                        PENDING
                    </TabNav>
                    <TabNav value="tab2" icon={<FaCheck />}>
                        Approved
                    </TabNav>
                    <TabNav value="tab3" icon={<RxCross1 />}>
                        Reject
                    </TabNav>
                </TabList>
                <div className="p-4 mt-5">
                    <TabContent value="tab1">
                        <Pending
                            data={tableData}
                            totalData={totalData}
                            page={page}
                            pageSize={pageSize}
                            setPage={setPage}
                            setPageSize={setPageSize}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </TabContent>
                    <TabContent value="tab2">
                        <Accepted
                            data={tableData}
                            totalData={totalData}
                            page={page}
                            pageSize={pageSize}
                            setPage={setPage}
                            setPageSize={setPageSize}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </TabContent>
                    <TabContent value="tab3">
                        <Rejected
                            data={tableData}
                            totalData={totalData}
                            page={page}
                            pageSize={pageSize}
                            setPage={setPage}
                            setPageSize={setPageSize}
                            globalFilter={globalFilter}
                            setGlobalFilter={setGlobalFilter}
                        />
                    </TabContent>
                </div>
            </Tabs>
        </div>
    )
}

export default CreatorPost
