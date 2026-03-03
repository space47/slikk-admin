/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { useNavigate } from 'react-router-dom'
import { IoMdDownload } from 'react-icons/io'
import ImageMODAL from '@/common/ImageModal'
import { FaFacebook, FaFilter, FaPlus } from 'react-icons/fa'
import EasyTable from '@/common/EasyTable'
import { useAppDispatch, useAppSelector } from '@/store'
import DialogConfirm from '@/common/DialogConfirm'
import { Dropdown, Input, Spinner } from '@/components/ui'
import { ProductTypes, ProductFilterArray } from './ProductCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
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
import AddFrameModal from './AddFrameModal'
import FilterProductCommon from '@/common/FilterProductCommon'
import PageCommon from '@/common/PageCommon'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import ProductTableFilters from './ProductTableFilters'

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
    const [tableDrawer, setTableDrawer] = useState(false)
    const { productData, count, currentSelectedPage, page, pageSize, typeFetch, globalFilter, currentTableSelected } =
        useAppSelector<productRequiredType>((state) => state.product)
    const { debounceFilter } = useDebounceInput({ globalFilter: globalFilter as string, delay: 500 })
    const { data, isSuccess, isLoading, isFetching } = productService.useProductDataQuery(
        {
            page,
            pageSize,
            typeFetch,
            globalFilter: debounceFilter,
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

    const columns = useProductColumns({ handleOpenModal, handleViewProducts, currentTableSelected })

    const renderProductButtons = () => {
        const baseBtnClass = 'flex items-center gap-2 px-3 py-2 rounded-lg text-white font-medium transition-colors'
        const buttonsArray = [
            {
                label: 'Frame',
                onClick: () => setShowAddFrameDialog(true),
                className: `${baseBtnClass} bg-indigo-600 hover:bg-indigo-700`,
            },
            {
                label: 'SiteMap',
                onClick: () => handleGenerateSiteMap(),
                className: `${baseBtnClass} bg-yellow-600 hover:bg-yellow-500`,
            },
            {
                label: 'Sync',
                onClick: () => setShowFacebookDialog(true),
                icon: <FaFacebook className="text-lg" />,
                className: `lg:flex ${baseBtnClass} bg-blue-700 hover:bg-blue-600`,
            },
            {
                label: 'Export',
                onClick: () => handleDownload(currentSelectedPage, globalFilter!, typeFetch),
                icon: <IoMdDownload className="text-lg" />,
                className: `lg:flex ${baseBtnClass} bg-green-500 hover:bg-green-400`,
            },
            {
                label: 'Filter',
                onClick: () => setShowDrawer(true),
                icon: <FaFilter className="text-md" />,
                className: `lg:flex ${baseBtnClass} bg-gray-700 hover:bg-gray-600`,
            },
            {
                label: 'Column Filter',
                onClick: () => setTableDrawer(true),
                icon: <FaFilter className="text-md" />,
                className: `lg:flex ${baseBtnClass} bg-gray-700 hover:bg-gray-600`,
            },
            {
                label: 'Add',
                icon: <FaPlus className="text-md" />,
                onClick: () => navigate('/app/catalog/products/addNew'),
                className: `${baseBtnClass} justify-center bg-black hover:bg-gray-800 w-full lg:w-auto px-4`,
            },
        ]

        return (
            <div className="w-full lg:w-auto">
                <div className="flex flex-wrap gap-2 justify-start lg:justify-end">
                    {buttonsArray.map((item, key) => (
                        <Button key={key} variant="new" size="sm" className={item.className} onClick={item.onClick}>
                            <span className="flex gap-2 items-center">
                                {item.label}
                                {item.icon}
                            </span>
                        </Button>
                    ))}
                </div>
            </div>
        )
    }

    const renderProductInput = () => (
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
    )

    return (
        <div className="p-4 w-full shadow-xl rounded-xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                {renderProductInput()}
                {renderProductButtons()}
            </div>
            {(isLoading || isFetching) && (
                <div className="flex items-center justify-center py-8">
                    <Spinner size={30} />
                </div>
            )}
            <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <EasyTable mainData={productData} columns={columns} page={page} pageSize={pageSize} />
            </div>
            <PageCommon dispatch={dispatch} page={page} pageSize={pageSize} setPage={setPage} setPageSize={setPageSize} totalData={count} />
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}

            <FilterProductCommon
                isRedux={true}
                brandList={brandList}
                setBrandList={setBrandList}
                setShowDrawer={setShowDrawer}
                showDrawer={showDrawer}
                setTypeFetch={setTypeFetch}
                typeFetch={typeFetch}
            />

            <ProductTableFilters setShowDrawer={setTableDrawer} showDrawer={tableDrawer} currentTableSelected={currentTableSelected} />

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
