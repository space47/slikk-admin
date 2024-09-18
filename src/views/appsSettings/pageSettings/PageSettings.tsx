/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState, useRef } from 'react'
import Table from '@/components/ui/Table'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { MdDragIndicator } from 'react-icons/md'

import { StrictModeDroppable } from '@/components/shared'

import type { ColumnDef } from '@tanstack/react-table'
import type { DropResult } from 'react-beautiful-dnd'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Dropdown, Button } from '@/components/ui'
import { BANNER_PAGE_NAME } from '@/common/banner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { notification } from 'antd'
// import { AnyCnameRecord } from 'dns'
import PageModal from './PageModal'
import { FormikProps } from 'formik'
import PageAddModal from './PageAddModal'
import { FaEdit, FaTrash } from 'react-icons/fa'

const { Tr, Th, Td, THead, TBody } = Table

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
    mobile_background_image: string
}

const PageSettings = () => {
    const [data, setData] = useState<WebType[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(BANNER_PAGE_NAME[0])
    const [yesModal, setYesModal] = useState(false)
    const [particularRow, setParticularRow] = useState()
    const formikRef = useRef<FormikProps<any>>(null)
    const [addModal, setAddModal] = useState(false)

    const fetchData = async () => {
        console.log('starting api')
        try {
            axioisInstance
                .get(`/page/config?page_name=${currentSelectedPage.value}`)
                .then((response) => {
                    const responsedata = response.data.data.value.Web
                    setData(Object.values(responsedata))
                    console.log('ending api call', responsedata)
                })
                .catch((error) => {
                    console.log(error)
                    setData([])
                })
        } catch (error) {
            console.log(error)
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
        console.log('resultDrag', result)
        const { source, destination } = result
        if (!destination) return
        reorderData(source.index, destination.index)
    }

    const getDataType = (data: DataType): { key: string; value: string } => {
        if (data.barcodes) {
            return { key: 'Barcode', value: data.barcodes }
        } else if (data.posts) {
            return { key: 'Posts', value: data.posts }
        } else if (data.brands) {
            return { key: 'Brands', value: data.brands }
        } else if (data.handles) {
            return { key: 'Handles', value: data.handles }
        }
        return { key: '', value: '' }
    }

    const handleCancel = () => {
        setYesModal(false)
    }
    const handleOk = () => {
        formikRef.current?.submitForm()
        setYesModal(false)
        console.log('pppppppppppppppppp', particularRow)
    }

    useEffect(() => {
        if (particularRow) {
            console.log('Updated particularRow:', particularRow)
        }
    }, [particularRow])

    const handleADDCancel = () => {
        setAddModal(false)
    }

    const handleADDOk = () => {
        formikRef.current?.submitForm()
        setAddModal(false)
        console.log('pppppppppppppppppp', particularRow)
    }

    const handleActionClick = (row: any) => {
        setYesModal(true)
        setParticularRow(row)
        console.log('ssssss', particularRow)
    }

    const handleAddPageClick = () => {
        setAddModal(true)
        // setParticularRow(row)
    }

    const newRowData = (data: any) => {
        setData((prev) => prev.map((item) => (item === particularRow ? data : item)))
        console.log('object------------', data)
    }
    const handleRemoveButton = (row: WebType) => {
        setData((prev) => prev.filter((item) => item !== row))
    }

    useEffect(() => {
        console.log('Updated particularRow:', particularRow)
    }, [particularRow])

    const columns: ColumnDef<WebType>[] = useMemo(
        () => [
            {
                id: 'dragger',
                header: '',
                accessorKey: 'dragger',
                cell: (props) => (
                    <span {...(props as any).dragHandleProps}>
                        <MdDragIndicator />
                    </span>
                ),
            },
            {
                header: 'Section Heading',
                accessorKey: 'section_heading',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Component Type',
                accessorKey: 'component_type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Background Image',
                accessorKey: 'background_image',
                cell: (info) => <img src={info.getValue()} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Mobile Background Image',
                accessorKey: 'mobile_background_image',
                cell: (info) => <img src={info.getValue()} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Header Icon',
                accessorKey: 'header_config.icon',
                cell: (info) => <img src={info.getValue()} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Header Text',
                accessorKey: 'header_config.text',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Header Image',
                accessorKey: 'header_config.image',
                cell: (info) => <img src={info.getValue()} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Header Style',
                accessorKey: 'header_config.style',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Header Position',
                accessorKey: 'header_config.position',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Footer Icon',
                accessorKey: 'footer_config.icon',
                cell: (info) => <img src={info.getValue()} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Footer Text',
                accessorKey: 'footer_config.text',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Footer Image',
                accessorKey: 'footer_config.image',
                cell: (info) => <img src={info.getValue() as string} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Footer Style',
                accessorKey: 'footer_config.style',
                cell: (info) => info.getValue(),
            },

            {
                header: 'Footer Position',
                accessorKey: 'footer_config.position',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sub Header Icon',
                accessorKey: 'sub_header_config.icon',
                cell: (info) => <img src={info.getValue()} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Sub Header Text',
                accessorKey: 'sub_header_config.text',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sub Header Image',
                accessorKey: 'sub_header_config.image',
                cell: (info) => <img src={info.getValue()} alt="" className=" object-contain bg-black" />,
            },
            {
                header: 'Sub Header Style',
                accessorKey: 'sub_header_config.style',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Sub Header Position',
                accessorKey: 'sub_header_config.position',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Data Type',
                accessorKey: 'data_type.type',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Section',
                accessorKey: 'is_section_clickable',
                cell: (info) => (info.getValue() ? 'Yes' : 'No'),
            },
            {
                header: 'Section Filter',
                accessorKey: 'section_filters',
                cell: (info) => info.getValue(),
            },
            {
                header: 'Data Type Values',
                accessorFn: (row: WebType) => getDataType(row.data_type),
                cell: (info) => {
                    const { key, value } = info.getValue() as {
                        key: string
                        value: string
                    }
                    return (
                        <div className="w-[180px] text-overflow:ellipsis">
                            {key}-{value}
                        </div>
                    )
                },
            },
            {
                header: 'Edit',
                accessorKey: '',
                cell: ({ row }) => (
                    <button onClick={() => handleActionClick(row.original)} className="border-none bg-none">
                        <FaEdit className="text-xl" />
                    </button>
                ),
            },
            {
                header: 'Delete',
                accessorKey: '',
                cell: ({ row }) => (
                    <button onClick={() => handleRemoveButton(row.original)} className="border-none bg-none">
                        <FaTrash className="text-xl text-red-500" />
                    </button>
                ),
            },
        ],
        [],
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const handleSelect = (a: any, b: any) => {
        console.log('data.....................', a, b)
        setCurrentSelectedPage({
            value: a,
            name: BANNER_PAGE_NAME.find((p) => p.value == a)?.name || '',
        })
    }

    const handleButton = async () => {
        const webData = data.reduce((acc, item, index) => {
            const { mobile_background_array, ...allData } = item
            acc[index + 1] = {
                ...allData,
                mobile_background_image: item.mobile_background_image || '',
            }
            return acc
        }, {})

        console.log('webbbbbbbbbbbbb', webData)

        const body = {
            page_name: `${currentSelectedPage.value}`,
            value: {
                Web: webData,
            },
        }

        console.log('boooooooooooooooo', body)

        try {
            const response = await axioisInstance.post(`page/config`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Page Updated successfully',
            })
        } catch (error) {
            console.log(error)
            notification.error({
                message: 'Failure',
                description: 'Page Failure',
            })
        }
    }
    console.log('PPPPPPPPPPPPPP', particularRow)

    return (
        <div>
            <div className=" flex justify-between">
                <div className="buttons flex gap-3 mb-7 ">
                    <div className="drop border  bg-gray-200 text-black text-lg font-semibold ">
                        <Dropdown className=" text-xl text-black " title={currentSelectedPage.name} onSelect={handleSelect}>
                            {BANNER_PAGE_NAME?.map((item, key) => {
                                return (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.name}</span>
                                    </DropdownItem>
                                )
                            })}
                        </Dropdown>
                    </div>
                    <Button variant="new" size="md" onClick={handleButton}>
                        UPDATE PAGE SETTINGS
                    </Button>
                </div>

                <div className="add">
                    <Button variant="new" size="md" onClick={handleAddPageClick}>
                        ADD PAGE SETTINGS
                    </Button>
                </div>
            </div>
            {yesModal && (
                <PageModal
                    formikRef={formikRef}
                    isModalOpen={yesModal}
                    setIsModalOpen={setYesModal}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                    particularRow={particularRow}
                    setParticularRow={(row) => {
                        setParticularRow(row)
                        newRowData(row)
                    }}
                />
            )}

            {addModal && (
                <PageAddModal
                    formikRef={formikRef}
                    isModalOpen={addModal}
                    setIsModalOpen={setAddModal}
                    handleCancel={handleADDCancel}
                    handleOk={handleADDOk}
                    data={data}
                    setData={setData}
                />
            )}

            <Table className="w-full">
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => {
                        console.log('object', headerGroup)
                        return (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Th key={header.id} colSpan={header.colSpan}>
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </Th>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </THead>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <StrictModeDroppable droppableId="table-body">
                        {(provided) => (
                            <TBody ref={provided.innerRef} {...provided.droppableProps}>
                                {table.getRowModel().rows.map((row) => {
                                    return (
                                        <Draggable key={row.id} draggableId={row.id} index={row.index}>
                                            {(provided, snapshot) => {
                                                const { style } = provided.draggableProps
                                                return (
                                                    <Tr
                                                        ref={provided.innerRef}
                                                        className={snapshot.isDragging ? 'table' : ''}
                                                        style={style}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        {row.getVisibleCells().map((cell) => {
                                                            return <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                                                        })}
                                                    </Tr>
                                                )
                                            }}
                                        </Draggable>
                                    )
                                })}
                                {provided.placeholder}
                            </TBody>
                        )}
                    </StrictModeDroppable>
                </DragDropContext>
            </Table>
        </div>
    )
}

export default PageSettings
