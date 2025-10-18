/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Pagination from '@/components/ui/Pagination'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { IoMdDownload } from 'react-icons/io'
import ImageMODAL from '@/common/ImageModal'
import { FaFacebook, FaFilter } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import { useAppDispatch, useAppSelector } from '@/store'
import DialogConfirm from '@/common/DialogConfirm'
import { Dropdown, Input } from '@/components/ui'
import { ProductTypes, ProductFilterArray } from './ProductCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Option, pageSizeOptions } from './CommonType'
import { useProductColumns } from './productutils/ProductColumns'
import { handleDownload, handleFacebookSync, handleGenerateSiteMap, handleRandomize } from './productutils/productApiCalls'
import ProductViewModal from './ProductViewModal'
import { productService } from '@/store/services/productService'
import {
    productRequiredType,
    setProductData,
    setCurrentSelectedPage,
    setPage,
    setPageSize,
    setTypeFetch,
    setGlobalFilter,
    setCount,
} from '@/store/slices/productData/productData.slice'
import LoadingSpinner from '@/common/LoadingSpinner'
import AddFrameModal from './AddFrameModal'
import FilterProductCommon from '@/common/FilterProductCommon'

const Products = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [rowData, setRowData] = useState<ProductTypes>()
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any>([])
    const [brandList, setBrandList] = useState([])
    const [showFacebookDialog, setShowFacebookDialog] = useState(false)
    const [showRandomizeDialog, setShowRandomizeDialog] = useState(false)
    const [showAddFrameDialog, setShowAddFrameDialog] = useState(false)
    const [showDrawer, setShowDrawer] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)

    const { productData, count, currentSelectedPage, page, pageSize, typeFetch, globalFilter } = useAppSelector<productRequiredType>(
        (state) => state.product,
    )

    const { data, isSuccess, isLoading } = productService.useProductDataQuery(
        {
            page,
            pageSize,
            typeFetch,
            globalFilter,
            currentSelectedPage,
        },
        { refetchOnMountOrArgChange: true },
    )

    useEffect(() => {
        if (isSuccess) {
            dispatch(setProductData(data?.data?.results || []))
            dispatch(setCount(data?.data?.count || 0))
        }
    }, [dispatch, isSuccess, data])

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const handleViewProducts = (row: ProductTypes) => {
        setRowData(row)
        setShowViewModal(true)
    }

    const handleProductSelect = (value: any) => {
        const selected = ProductFilterArray.find((item) => item.value === value)
        if (selected) {
            dispatch(setCurrentSelectedPage(selected))
        }
    }

    const columns = useProductColumns({ handleOpenModal, handleViewProducts })
    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-4 w-full shadow-xl rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <div className="flex-1 flex gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                            <div className="relative flex-1">
                                <Input
                                    type="search"
                                    name="search"
                                    placeholder="Search products..."
                                    value={globalFilter}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                    onChange={(e) => {
                                        dispatch(setPage(1))
                                        dispatch(setGlobalFilter(e.target.value))
                                    }}
                                />
                            </div>

                            <div className="bg-gray-100 dark:bg-gray-700 rounded-md">
                                <Dropdown
                                    className="text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-700 font-medium px-3 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                    title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                    onSelect={(val) => handleProductSelect(val)}
                                >
                                    {ProductFilterArray?.map((item, key) => (
                                        <DropdownItem key={key} eventKey={item.value}>
                                            <span>{item.label}</span>
                                        </DropdownItem>
                                    ))}
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full lg:w-auto">
                    <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                        <Button
                            variant="new"
                            onClick={() => setShowAddFrameDialog(true)}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-medium transition-colors"
                        >
                            <span>Add/Remove Frame</span>
                        </Button>

                        <button
                            className="flex items-center gap-2 px-3 py-2 hover:bg-purple-600 rounded-lg text-white bg-purple-700 font-medium transition-colors"
                            onClick={() => setShowRandomizeDialog(true)}
                        >
                            <span>Randomize</span>
                        </button>

                        <button
                            className="flex items-center gap-2 px-3 py-2 hover:bg-yellow-500 rounded-lg text-white bg-yellow-600 font-medium transition-colors"
                            onClick={() => handleGenerateSiteMap()}
                        >
                            <span>SiteMap</span>
                        </button>
                        <button
                            className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-blue-600 rounded-lg text-white bg-blue-700 font-medium transition-colors"
                            onClick={() => setShowFacebookDialog(true)}
                        >
                            <span>Sync</span> <FaFacebook className="text-lg" />
                        </button>

                        <button
                            className="hidden lg:flex items-center gap-2 px-3 py-2 hover:bg-green-400 rounded-lg text-white bg-green-500 font-medium transition-colors"
                            onClick={() => handleDownload(currentSelectedPage, globalFilter!, typeFetch)}
                        >
                            <IoMdDownload className="text-lg" /> Export
                        </button>

                        <Button
                            variant="new"
                            className="hidden lg:flex items-center gap-2 px-3 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                            onClick={() => setShowDrawer(true)}
                        >
                            <FaFilter className="text-md" /> Filter
                        </Button>
                        <div className="flex lg:hidden gap-2">
                            <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-blue-600 rounded-lg text-white bg-blue-700 font-medium transition-colors"
                                onClick={() => setShowFacebookDialog(true)}
                            >
                                <FaFacebook className="text-lg" />
                            </button>

                            <button
                                className="flex items-center gap-2 px-3 py-2 hover:bg-green-400 rounded-lg text-white bg-green-500 font-medium transition-colors"
                                onClick={() => handleDownload(currentSelectedPage, globalFilter!, typeFetch)}
                            >
                                <IoMdDownload className="text-lg" />
                            </button>

                            <Button
                                variant="new"
                                className="flex items-center gap-2 px-3 py-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                                onClick={() => setShowDrawer(true)}
                            >
                                <FaFilter className="text-md" />
                            </Button>
                        </div>
                        <Button
                            variant="new"
                            className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-black hover:bg-gray-800 font-medium transition-colors w-full lg:w-auto"
                            onClick={() => navigate('/app/catalog/products/addNew')}
                        >
                            <span>Add Product</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <EasyTable mainData={productData} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
                <Pagination pageSize={pageSize} currentPage={page} total={count} onChange={(page) => dispatch(setPage(page))} />
                <div className="min-w-[130px]">
                    <Select<Option>
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOptions.find((option) => option.value === pageSize)}
                        options={pageSizeOptions}
                        onChange={(option) => {
                            dispatch(setPage(1))
                            dispatch(setPageSize(Number(option?.value)))
                        }}
                        className="text-sm"
                    />
                </div>
            </div>
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}

            {showDrawer && (
                <FilterProductCommon
                    isRedux={true}
                    brandList={brandList}
                    setBrandList={setBrandList}
                    setShowDrawer={setShowDrawer}
                    showDrawer={showDrawer}
                    setTypeFetch={setTypeFetch}
                    typeFetch={typeFetch}
                />
            )}

            {showFacebookDialog && (
                <DialogConfirm
                    IsConfirm
                    IsOpen={showFacebookDialog}
                    setIsOpen={setShowFacebookDialog}
                    headingName="SYNC TO FACEBOOK"
                    onDialogOk={() => handleFacebookSync(setShowFacebookDialog)}
                />
            )}

            {showRandomizeDialog && (
                <DialogConfirm
                    IsConfirm
                    IsOpen={showRandomizeDialog}
                    setIsOpen={setShowRandomizeDialog}
                    headingName="Randomize Product Listing"
                    onDialogOk={() => handleRandomize(setShowRandomizeDialog)}
                />
            )}

            {showViewModal && <ProductViewModal row={rowData as ProductTypes} isOpen={showViewModal} setIsOpen={setShowViewModal} />}
            {showAddFrameDialog && <AddFrameModal isOpen={showAddFrameDialog} setIsOpen={setShowAddFrameDialog} />}
        </div>
    )
}

export default Products
