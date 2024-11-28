/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useRef } from 'react'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'
import type { DropResult } from 'react-beautiful-dnd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Dropdown, Button } from '@/components/ui'
import { BANNER_PAGE_NAME } from '@/common/banner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { notification } from 'antd'
import PageModal from './PageModal'
import { FormikProps } from 'formik'
import PageAddModal from './PageAddModal'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { WebType } from './PageSettingsCommon'
import PageDraggavleTable from './PageDraggavleTable'

const PageSettings = () => {
    const [data, setData] = useState<WebType[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(BANNER_PAGE_NAME[0])
    const [yesModal, setYesModal] = useState(false)
    const [particularRow, setParticularRow] = useState<WebType | undefined>()
    const [addModal, setAddModal] = useState(false)
    const formikRef = useRef<FormikProps<any>>(null)
    const navigate = useNavigate()

    const fetchData = async () => {
        try {
            const response = await axioisInstance.get(`/page/config?page_name=${currentSelectedPage.value}`)
            const responsedata = response.data?.data?.value?.Web || {}
            setData(Object.values(responsedata))
        } catch (error) {
            console.error('Error fetching data:', error)
            setData([])
        }
    }

    useEffect(() => {
        fetchData()
    }, [currentSelectedPage])

    const reorderData = (startIndex: number, endIndex: number) => {
        const newData = [...data]
        const [movedRow] = newData.splice(startIndex, 1)
        newData.splice(endIndex, 0, movedRow)
        setData(newData)
    }

    const handleDragEnd = (result: DropResult) => {
        const { source, destination } = result
        if (destination) reorderData(source.index, destination.index)
    }

    const getDataType = (data: any): { key: string; value: string } => {
        if (data?.barcodes) return { key: 'Barcode', value: data.barcodes }
        if (data?.posts) return { key: 'Posts', value: data.posts }
        if (data?.brands) return { key: 'Brands', value: data.brands }
        if (data?.handles) return { key: 'Handles', value: data.handles }
        return { key: '', value: '' }
    }

    const updateRowData = (updatedRow: WebType) => {
        setData((prev) => prev.map((item) => (item === particularRow ? updatedRow : item)))
    }

    const handleRemoveRow = (row: WebType) => {
        setData((prev) => prev.filter((item) => item !== row))
    }

    const handlePageUpdate = async () => {
        const webData = data.reduce(
            (acc, item, index) => {
                const { mobile_background_array, ...rest } = item
                acc[index + 1] = {
                    ...rest,
                    mobile_background_image: item.mobile_background_image || '',
                }
                return acc
            },
            {} as Record<number, WebType>,
        )

        const body = {
            page_name: currentSelectedPage.value,
            value: { Web: webData },
        }

        try {
            const response = await axioisInstance.post(`/page/config`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Page updated successfully.',
            })
        } catch (error) {
            console.error('Error updating page:', error)
            notification.error({
                message: 'Failure',
                description: 'Page update failed.',
            })
        }
    }

    const columns: ColumnDef<WebType>[] = useMemo(
        () => [
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button
                        onClick={() => {
                            setYesModal(true)
                            setParticularRow(row.original)
                        }}
                        className="border-none bg-none"
                    >
                        <FaEdit className="text-xl text-blue-600" />
                    </button>
                ),
            },
            { header: 'Section Heading', accessorKey: 'section_heading' },
            { header: 'Component Type', accessorKey: 'component_type' },
            {
                header: 'Background Image',
                accessorKey: 'background_config.background_image',
                cell: (info) => <img src={info.getValue() as string} alt="" className="object-contain bg-black" />,
            },
            {
                header: 'Mobile Background Image',
                accessorKey: 'background_config.mobile_background_image',
                cell: (info) => <img src={info.getValue() as string} alt="" className="object-contain bg-black" />,
            },
            { header: 'Header Text', accessorKey: 'header_config.text' },
            { header: 'Footer Text', accessorKey: 'footer_config.text' },
            { header: 'Sub Header Text', accessorKey: 'sub_header_config.text' },
            { header: 'Data Type', accessorKey: 'data_type.type' },
            {
                header: 'Section',
                accessorKey: 'is_section_clickable',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            { header: 'Section Filter', accessorKey: 'section_filters' },
            {
                header: 'Data Type Values',
                accessorFn: (row) => getDataType(row.data_type),
                cell: (info) => {
                    const { key, value } = info.getValue() as { key: string; value: string }
                    return (
                        <div className="w-[180px] text-overflow:ellipsis">
                            {key}-{value}
                        </div>
                    )
                },
            },
            {
                header: 'Delete',
                accessorKey: '',
                cell: ({ row }) => (
                    <button onClick={() => handleRemoveRow(row.original)} className="border-none bg-none">
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                ),
            },
        ],
        [data],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleSelectPage = (value: string) => {
        const selectedPage = BANNER_PAGE_NAME.find((page) => page.value === value)
        if (selectedPage) setCurrentSelectedPage(selectedPage)
    }

    return (
        <div>
            <div className="flex flex-col gap-2 xl:flex-row xl:justify-between items-center">
                <div className="buttons flex gap-3 mb-7">
                    <div className="bg-gray-200 px-2 rounded-lg font-bold text-[15px]">
                        <Dropdown
                            className="border bg-gray-200 text-black text-lg font-semibold"
                            title={currentSelectedPage.name}
                            onSelect={handleSelectPage}
                        >
                            {BANNER_PAGE_NAME.map((item) => (
                                <DropdownItem key={item.value} eventKey={item.value}>
                                    {item.name}
                                </DropdownItem>
                            ))}
                        </Dropdown>
                    </div>
                    <Button variant="new" size="md" onClick={handlePageUpdate}>
                        UPDATE PAGE SETTINGS
                    </Button>
                </div>
                <Button variant="new" size="md" onClick={() => setAddModal(true)}>
                    ADD PAGE SETTINGS
                </Button>
            </div>

            {yesModal && (
                <PageModal
                    formikRef={formikRef}
                    isModalOpen={yesModal}
                    setIsModalOpen={setYesModal}
                    handleCancel={() => setYesModal(false)}
                    handleOk={() => {
                        formikRef.current?.submitForm()
                        setYesModal(false)
                    }}
                    particularRow={particularRow}
                    setParticularRow={(row) => {
                        setParticularRow(row)
                        updateRowData(row)
                    }}
                />
            )}

            {addModal && (
                <PageAddModal
                    formikRef={formikRef}
                    isModalOpen={addModal}
                    setIsModalOpen={setAddModal}
                    handleCancel={() => setAddModal(false)}
                    handleOk={() => {
                        formikRef.current?.submitForm()
                        setAddModal(false)
                    }}
                    data={data}
                    setData={setData}
                />
            )}

            <PageDraggavleTable table={table} handleDragEnd={handleDragEnd} />
        </div>
    )
}

export default PageSettings
