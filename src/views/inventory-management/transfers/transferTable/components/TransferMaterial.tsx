/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react'
import EasyTable from '@/common/EasyTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { Button, Spinner } from '@/components/ui'
import { MdCancel } from 'react-icons/md'
import { Modal, notification } from 'antd'
import MoreDataTable from './MoreDataTable'
import { FaCamera } from 'react-icons/fa'
import { RiCameraOffFill } from 'react-icons/ri'
import SkuBarcodeScanner from './SkuBarcodeScanner'
import ImageMODAL from '@/common/ImageModal'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

const TransferModule = () => {
    const [skuWiseData, setSkuWiseData] = useState<any[]>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [locationInput, setLocationInput] = useState('')
    const [clearStorageModal, setClearStorageModal] = useState(false)
    const [downloadModal, setDownloadModal] = useState(false)
    const [saveAsInput, setSaveAsInput] = useState('')
    const [moreData, setMoreData] = useState(false)
    const [dataForName, setDataForName] = useState('')
    const [isCamera, setIsCamera] = useState(false)
    const [qrResult, setQrResult] = useState<any>()
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any>([])
    const [loader, setLoader] = useState(false)
    const companyList = useAppSelector<SINGLE_COMPANY_DATA[]>((state) => state.company.company)

    useEffect(() => {
        const storedData = localStorage.getItem('skuSearchResults')
        if (storedData) {
            setSkuWiseData(JSON.parse(storedData))
        }
    }, [])

    const handleProductFetch = async () => {
        if (dataForName !== '') return
        if (!locationInput) {
            notification.error({ message: 'Location is required' })
            return
        }
        const searchTypes = [
            { type: 'barcode_exact', value: globalFilter?.trim() },
            { type: 'sku_exact', value: globalFilter?.trim() },
        ]
        if (dataForName) {
            searchTypes.push({ type: 'name', value: dataForName })
        }

        let product = null
        for (const search of searchTypes) {
            setLoader(true)
            try {
                const response = await axioisInstance.get(`/merchant/products`, {
                    params: {
                        [search.type]: search.value,
                    },
                })

                const result = response?.data?.data?.results?.[0]

                if (result?.sku) {
                    product = result
                    break
                }
            } catch (error) {
                console.error(`Error searching by ${search.type}:`, error)
                continue
            } finally {
                setLoader(false)
            }
        }
        if (product?.sku) {
            console.log('product is', product?.image?.split(',')[0])
            handleAddOrUpdateRow(product.sku, product?.brand, product?.image?.split(','), product?.company)
        } else {
            console.error('No product found, adding entry with globalFilter.')
            handleAddOrUpdateRow(globalFilter, '', '', '')
        }

        setQrResult('')
        setGlobalFilter('')
    }

    const handleActionClick = async (value: any) => {
        setDataForName(value)

        try {
            const response = await axioisInstance.get(`/merchant/products?barcode=${value}`)
            const product = response?.data?.data?.results?.[0]

            if (product?.sku) {
                handleAddOrUpdateRow(product.sku, product?.brand, product?.image?.split(','), product?.company)
            } else {
                console.error('No product found, adding entry with globalFilter.')
                handleAddOrUpdateRow(globalFilter, '', '', '')
                if (isCamera) {
                    handleAddOrUpdateRow(qrResult, '', '', '')
                }
            }
        } catch (error) {
            console.error(error)
            handleAddOrUpdateRow(globalFilter, '', '', '')
            if (isCamera) {
                handleAddOrUpdateRow(qrResult, '', '', '')
            }
        } finally {
            setDataForName('')
            setMoreData(false)
        }
    }

    const handleAddOrUpdateRow = (sku: string, brand: string, image: string, company: string | number) => {
        const companyFromApi = companyList?.find((item) => item?.id === company)

        if (!sku) return
        const existingRowIndex = skuWiseData.findIndex((item) => item.sku?.trim() === sku?.trim())

        if (existingRowIndex !== -1) {
            const updatedData = skuWiseData.filter((item) => item.sku?.trim() !== sku?.trim())
            const existingRow = skuWiseData[existingRowIndex]
            const updatedRow = {
                ...existingRow,
                brand: brand || existingRow.brand,
                image: image ?? existingRow.image ?? 'N/A',
                company: companyFromApi?.name || existingRow.company || 'N/A',
                quantity_returned: (existingRow.quantity_returned || 0) + 1,
                location: existingRow.location.includes(locationInput) ? existingRow.location : `${existingRow.location}/${locationInput}`,
            }

            setSkuWiseData([updatedRow, ...updatedData])
            localStorage.setItem('skuSearchResults', JSON.stringify([updatedRow, ...updatedData]))
        } else {
            const newRow = {
                sku,
                brand: brand || '',
                quantity_returned: 1,
                image: image ?? 'N/A',
                company: companyFromApi?.name || 'N/A',
                location: locationInput,
            }
            const updatedData = [newRow, ...skuWiseData]
            setSkuWiseData(updatedData)
            localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
        }
    }

    const handleDeleteRow = (sku: string) => {
        const updatedData = skuWiseData.filter((item) => item.sku !== sku)
        setSkuWiseData(updatedData)
        localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
    }

    const columns = useMemo(
        () => [
            { header: 'SKU', accessorKey: 'sku' },
            { header: 'Brand', accessorKey: 'brand' },
            { header: 'Company', accessorKey: 'company' },
            {
                header: 'Image',
                accessorKey: 'image',
                cell: ({ row }: { row: any }) => {
                    return row.original?.image?.length > 0 ? (
                        <img
                            src={row.original?.image[0]}
                            alt={row.original.sku}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                            onClick={() => handleOpenModal(row.original.image)}
                        />
                    ) : (
                        <span className="text-gray-500">No Image</span>
                    )
                },
            },

            {
                header: 'Quantity',
                accessorKey: 'quantity_returned',
                cell: ({ row }: { row: any }) => (
                    <div className="flex items-center gap-2">
                        <button
                            className=" text-green-500 text-xl font-bold"
                            onClick={() => {
                                const updatedData = skuWiseData.map((item) =>
                                    item.sku === row.original.sku
                                        ? { ...item, quantity_returned: (item.quantity_returned || 0) + 1 }
                                        : item,
                                )
                                setSkuWiseData(updatedData)
                                localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
                            }}
                        >
                            +
                        </button>
                        <span>{row.original.quantity_returned}</span>
                        <button
                            className="text-red-500 text-2xl font-bold"
                            onClick={() => {
                                const updatedData = skuWiseData.map((item) =>
                                    item.sku === row.original.sku
                                        ? { ...item, quantity_returned: Math.max((item.quantity_returned || 0) - 1, 0) }
                                        : item,
                                )
                                setSkuWiseData(updatedData)
                                localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
                            }}
                        >
                            -
                        </button>
                    </div>
                ),
            },
            {
                header: 'Location',
                accessorKey: 'location',
                cell: ({ row }: { row: any }) => (
                    <div className="flex items-center gap-2">
                        <span>{row.original.location}</span>
                        <button
                            className="text-red-500 text-xl font-bold"
                            onClick={() => {
                                const updatedData = skuWiseData.map((item) =>
                                    item.sku === row.original.sku
                                        ? {
                                              ...item,
                                              location: item.location ? item.location.split('/').slice(0, -1).join('/') : '',
                                          }
                                        : item,
                                )
                                setSkuWiseData(updatedData)
                                localStorage.setItem('skuSearchResults', JSON.stringify(updatedData))
                            }}
                        >
                            -
                        </button>
                    </div>
                ),
            },
            {
                header: '-',
                accessorKey: '',
                cell: ({ row }: { row: any }) => (
                    <button className="text-red-500 text-2xl" onClick={() => handleDeleteRow(row.original.sku)}>
                        <MdCancel />
                    </button>
                ),
            },
        ],
        [skuWiseData],
    )

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const clearStorage = () => {
        setClearStorageModal(true)
    }

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleProductFetch()
        }
    }

    useEffect(() => {
        if (qrResult) {
            const handleCamera = async () => {
                let qrParam = ''
                if (qrResult) {
                    qrParam = `sku_exact=${encodeURIComponent(qrResult)}`
                }
                console.log('only if (qrResult)', qrResult)
                try {
                    const response = await axioisInstance.get(`/merchant/products?${qrParam}`)
                    const product = response?.data?.data?.results?.[0]

                    if (product?.sku) {
                        console.log('here in sku', product?.sku)
                        handleAddOrUpdateRow(product.sku, product?.brand, product?.image, product?.company)
                    } else {
                        console.log('here in else', qrResult)
                        handleAddOrUpdateRow(qrResult, '', '', '')
                    }
                    setIsCamera(false)
                    window.scrollBy({ top: 300, behavior: 'smooth' })
                } catch (error) {
                    handleAddOrUpdateRow(qrResult, '', '', '')
                }
                setIsCamera(false)
                setQrResult('')
                setGlobalFilter('')
            }
            handleCamera()
        }
    }, [qrResult])

    const downloadCSV = () => {
        if (saveAsInput === '') {
            notification.error({
                message: 'SAVE AS FIELD IS EMPTY',
            })
            return
        }
        const headers = columns.map((col) => col.header).join(',')
        const rows = skuWiseData.map((row) =>
            columns
                .map((col) => {
                    if (!col.accessorKey) return ''
                    const accessorKeys = col.accessorKey.split('.')
                    let value: any = row
                    for (const key of accessorKeys) {
                        value = value?.[key]
                        if (value === undefined) break
                    }
                    return `"${value ?? ''}"`
                })
                .join(','),
        )
        const csvContent = [headers, ...rows].join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${saveAsInput}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        setDownloadModal(false)
    }

    const handleClearStorage = () => {
        localStorage.removeItem('skuSearchResults')
        setClearStorageModal(false)
        setSkuWiseData([])
        notification.success({
            message: ' successfully cleared all the data',
        })
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Inventory Scanner</h1>

                <div className="flex gap-3">
                    <Button
                        variant="reject"
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl shadow-sm"
                        onClick={clearStorage}
                    >
                        Clear
                    </Button>

                    <Button
                        variant="accept"
                        className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-xl shadow-sm"
                        onClick={() => setDownloadModal(true)}
                    >
                        Download
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-5">
                {isCamera && (
                    <div className="rounded-xl overflow-hidden border">
                        <SkuBarcodeScanner onDetected={setQrResult} setIsCamera={setIsCamera} />
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-end">
                    <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Location</label>
                        <input
                            value={locationInput}
                            placeholder="Enter location"
                            className="w-full border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            onChange={(e) => setLocationInput(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 items-center">
                        <input
                            value={globalFilter}
                            placeholder="Search SKU / Name / Barcode"
                            className="flex-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                        />

                        <button
                            className={`p-3 rounded-xl shadow-sm transition ${
                                isCamera ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                            onClick={() => {
                                setIsCamera((prev) => !prev)
                                setQrResult('')
                            }}
                        >
                            {isCamera ? <RiCameraOffFill className="text-lg" /> : <FaCamera className="text-lg" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* QR Result */}
            {qrResult && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-xl">
                    Scanned: <span className="font-semibold">{qrResult}</span>
                </div>
            )}

            {/* More Data Section */}
            {moreData && (
                <div className="bg-white rounded-2xl shadow-sm p-5">
                    <MoreDataTable nameInput={globalFilter} handleActionClick={handleActionClick} />
                </div>
            )}

            {/* Table Section */}

            <div>
                {loader && (
                    <div className="flex justify-center items-center mt-5 mb-6">
                        <Spinner size={30} />
                    </div>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-700">Inventory Data</h2>

                    <div className="text-md font-medium text-gray-600">
                        Total Quantity:
                        <span className="ml-2 text-green-600 font-bold">
                            {skuWiseData?.map((item) => item?.quantity_returned).reduce((acc, curr) => acc + curr, 0)}
                        </span>
                    </div>
                </div>

                <EasyTable mainData={skuWiseData} columns={columns} />
            </div>

            {/* Clear Modal */}
            <Modal
                title="Clear Data"
                open={clearStorageModal}
                okText="Proceed"
                okButtonProps={{
                    style: { backgroundColor: 'red', borderColor: 'red' },
                }}
                onOk={handleClearStorage}
                onCancel={() => setClearStorageModal(false)}
            >
                <p className="text-red-500 text-lg font-semibold">Are you sure you want to clear all table data?</p>
            </Modal>

            {/* Image Modal */}
            <ImageMODAL dialogIsOpen={showImageModal} setIsOpen={setShowImageModal} image={particularRowImage || []} />

            {/* Download Modal */}
            <Modal title="Save File As" open={downloadModal} onOk={downloadCSV} onCancel={() => setDownloadModal(false)}>
                <input
                    value={saveAsInput}
                    placeholder="Enter file name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                    onChange={(e) => setSaveAsInput(e.target.value)}
                />
            </Modal>
        </div>
    )
}

export default TransferModule
