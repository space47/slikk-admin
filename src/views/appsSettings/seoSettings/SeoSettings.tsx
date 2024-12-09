/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { NotFoundData } from '@/views/pages/AccessDenied/AccessDenied'
import React, { useEffect, useState } from 'react'
import { MdSearchOff } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { PopularLinksTypes, SubLinkTypes } from './SeoCommon'
import EasyTable from '@/common/EasyTable'

const SeoSettings = () => {
    const navigate = useNavigate()
    const [seoLinksData, setSeoLinksData] = useState<SubLinkTypes[]>([])
    const [seoData, setSeoData] = useState<PopularLinksTypes>()
    const [seoValue, setSeoValue] = useState<string>('')
    const [seoTable, setSeoTable] = useState(false)
    const [seo400, setSeo400] = useState(false)

    const fetchSeoDatas = async (linkValue: string) => {
        try {
            const response = await axioisInstance.get(`/seo/links?link_types=${linkValue}`)
            const data = response?.data?.data
            // if required Change the data holder
            setSeoData(data[0])
            setSeoLinksData(data[0]?.sub_links)
            setSeo400(false)
        } catch (error: any) {
            if (error?.response && error?.response?.status === 400) {
                setSeo400(true)
            }
            console.error(error)
        }
    }

    // useEffect(() => {
    //     fetchSeoDatas()
    // }, [])
    console.log('seo table', seoLinksData)

    const columns = [
        {
            header: 'Name',
            accessorKey: 'name',
        },
        {
            header: 'Type',
            accessorKey: 'type',
        },
        {
            header: 'Url',
            accessorKey: 'url',
            cell: ({ row }) => {
                return (
                    <div>
                        <a href={row?.url} className="hover:text-blue-700 cursor-pointer">
                            {row?.url}
                        </a>
                    </div>
                )
            },
        },
        {
            header: 'Sub Links',
            accessorKey: 'sub_links',
            cell: ({ row }) => {
                const value = row?.sub_links
                ;<div>{value?.map((item) => item?.url)}</div>
            },
        },
    ]

    const handleSeoTable = () => {
        fetchSeoDatas(seoValue)
        setSeoTable(true)
    }

    return (
        <div className="flex flex-col gap-10">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <input placeholder="Enter Seo link" value={seoValue} onChange={(e) => setSeoValue(e.target.value)} />
                    <Button variant="new" onClick={handleSeoTable}>
                        Search
                    </Button>
                </div>
                <div>
                    <Button variant="new" onClick={handleAddSeoSettings}>
                        Add SEO settings
                    </Button>
                </div>
            </div>

            {seo400 && <NotFoundData />}
            {seoData && seoLinksData?.length === 0 && <NotFoundData />}
            {seoLinksData?.length > 0 && !seo400 && (
                <div>
                    <div>Seo Name : {seoData?.name}</div>

                    <EasyTable mainData={seoLinksData} columns={columns} noPage />
                </div>
            )}
        </div>
    )

    function handleAddSeoSettings() {
        navigate(`/app/appSettings/seoSettings/addNew`)
    }
}

export default SeoSettings
