import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import EasyTable from '@/common/EasyTable'
import PageCommon from '@/common/PageCommon'
import { Button } from '@/components/ui'
import { notificationConfigService } from '@/store/services/sellerTemplateService'
import { NotificationConfigData } from '@/store/types/sellerTemplate.types'
import { useTemplateColumns } from '../templateUtils/useTemplateColumns'
import { Spin, Empty, notification } from 'antd'
import { getApiErrorMessage } from '@/constants/generateErrorMessage'
import TemplateViewDialog from '../sellerTemplateComponent/TemplateViewDialog'

const SellerTemplateList = () => {
    const navigate = useNavigate()

    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [templateList, setTemplateList] = useState<NotificationConfigData[]>([])
    const [currentHtml, setCurrentHtml] = useState('')
    const [preview, setPreview] = useState(false)
    const [count, setCount] = useState(0)

    const templateApi = notificationConfigService.useGetTemplateListQuery(
        {
            event_name: globalFilter || '',
            page,
            pageSize,
            notification_type: 'email',
        },
        {
            refetchOnMountOrArgChange: true,
        },
    )

    useEffect(() => {
        if (templateApi.isSuccess && templateApi.data?.data) {
            setTemplateList(templateApi.data.data.results || [])
            setCount(templateApi.data.data.count || 0)
        }

        if (templateApi.isError) {
            notification.error({ message: getApiErrorMessage(templateApi.error) })
            setTemplateList([])
            setCount(0)
        }
    }, [templateApi.isSuccess, templateApi.isError, templateApi.data, templateApi.error])

    const handleViewTemplate = (x: string) => {
        setPreview(true)
        setCurrentHtml(x)
    }

    const columns = useTemplateColumns({ handleViewTemplate })

    const isLoading = templateApi.isLoading || templateApi.isFetching

    return (
        <Spin spinning={isLoading}>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="mb-4 w-full xl:w-auto">
                    <input
                        type="text"
                        placeholder="Search here..."
                        value={globalFilter}
                        className="p-2 border rounded w-full xl:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setGlobalFilter(e.target.value)}
                    />
                </div>
                <div className="flex items-end justify-end mb-4 order-first xl:order-none">
                    <Button variant="new" size="sm" onClick={() => navigate('/app/sellerTemplate/addNew')}>
                        ADD NEW
                    </Button>
                </div>
            </div>

            {templateList?.length > 0 ? (
                <>
                    <EasyTable overflow mainData={templateList} columns={columns} page={page} pageSize={pageSize} />
                    <PageCommon page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
                </>
            ) : !isLoading ? (
                <div className="flex justify-center py-10">
                    <Empty description="No Templates Found" />
                </div>
            ) : null}
            <TemplateViewDialog htmlBody={currentHtml} isOpen={preview} setIsOpen={setPreview} />
        </Spin>
    )
}

export default SellerTemplateList
