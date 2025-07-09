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
import ProductFilterNest from './ProductFilter'
import { useAppDispatch, useAppSelector } from '@/store'
import DialogConfirm from '@/common/DialogConfirm'
import { FILTER_STATE } from '@/store/types/filters.types'
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

const Products = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [rowData, setRowData] = useState<ProductTypes>()
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any>([])
    const [divisionList, setDivisionList] = useState<string[]>([])
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [productTypeList, setProductTypeList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [showFacebookDialog, setShowFacebookDialog] = useState(false)
    const [showRandomizeDialog, setShowRandomizeDialog] = useState(false)
    const [selectFilterString, setFilterString] = useState('')
    const [showDrawer, setShowDrawer] = useState(false)
    const [showViewModal, setShowViewModal] = useState(false)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const { productData, count, currentSelectedPage, page, pageSize, typeFetch, globalFilter } = useAppSelector<productRequiredType>(
        (state) => state.product,
    )

    const { data, isSuccess, isLoading } = productService.useProductDataQuery(
        {
            page,
            pageSize,
            typeFetch,
            globalFilter: encodeURIComponent(globalFilter!),
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

    const handleApply = () => {
        let query = ''
        if (brandList?.length > 0 && !selectFilterString) {
            const brandIds = brandList.join(',')
            if (query) query += '&'
            query += `brand=${encodeURIComponent(brandIds)}`
        }
        if (selectFilterString && brandList?.length === 0) {
            console.log('selected filter string', selectFilterString)
            query += `${selectFilterString}`
        }
        if (selectFilterString && brandList?.length > 0) {
            const brandIds = brandList.join(',')
            const data = selectFilterString
                ?.split('=')
                ?.filter((item) => item !== 'brand')
                ?.join('')
            if (selectFilterString.includes('brand')) {
                query += `brand=${encodeURIComponent(brandIds)},${data},`
            } else {
                query += `${selectFilterString}&brand=${encodeURIComponent(brandIds)}`
            }
        }
        dispatch(setTypeFetch(query))
        setShowDrawer(false)
    }

    const columns = useProductColumns({ handleOpenModal, handleViewProducts })
    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="p-4 w-full shadow-xl rounded-xl">
            <div className="flex flex-col md:flex-col xl:flex-row md:items-center justify-center xl:justify-between mb-4 gap-4">
                <div className="w-full md:w-1/3 flex justify-between gap-3">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 px-3 py-2 rounded-lg shadow-md">
                        <Input
                            type="search"
                            name="search"
                            placeholder="Search here..."
                            value={globalFilter}
                            className="w-[150px] xl:w-[250px] rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-1 focus:outline-none focus:ring focus:ring-blue-500"
                            onChange={(e) => {
                                dispatch(setPage(1))
                                dispatch(setGlobalFilter(e.target.value))
                            }}
                        />

                        <div className="bg-gray-100 xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white font-bold">
                            <Dropdown
                                className="text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
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

                <div className="flex flex-col  items-center gap-4 w-full xl:flex-row xl:justify-end ">
                    <div className="flex gap-3">
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2  hover:bg-purple-600 rounded-lg text-white bg-purple-700"
                            onClick={() => setShowRandomizeDialog(true)}
                        >
                            <span className="font-bold">Randomize</span>
                        </button>
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2  hover:bg-yellow-500 rounded-lg text-white bg-yellow-600"
                            onClick={() => handleGenerateSiteMap()}
                        >
                            <span className="font-bold">SiteMap</span>
                        </button>
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2  hover:bg-blue-600 rounded-lg text-white bg-blue-700"
                            onClick={() => setShowFacebookDialog(true)}
                        >
                            <span className="font-bold">Sync</span> <FaFacebook className="text-xl" />
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 xl:flex items-center gap-2  hover:bg-green-400 rounded-lg font-bold"
                            onClick={() => handleDownload(currentSelectedPage, globalFilter!, typeFetch)}
                        >
                            <IoMdDownload className="text-xl" /> Export
                        </button>

                        <Button
                            variant="new"
                            className=" text-white px-4 py-2 hidden items-center gap-2 xl:flex rounded-lg font-bold "
                            onClick={() => setShowDrawer(true)}
                        >
                            <FaFilter className="text-md" /> Filter
                        </Button>
                    </div>

                    <div className="flex gap-3 w-full justify-between md:w-auto">
                        <Button
                            variant="new"
                            className=" text-white flex items-center gap-2 xl:hidden rounded-lg "
                            onClick={() => setShowDrawer(true)}
                        >
                            <FaFilter className="text-md" />
                        </Button>
                        <Button
                            variant="new"
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 w-full md:w-auto text-center font-bold"
                            onClick={() => navigate('/app/catalog/products/addNew')}
                        >
                            Add
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-10">
                <EasyTable mainData={productData} columns={columns} page={page} pageSize={pageSize} />
            </div>
            {
                <div className="flex items-center justify-between mt-4">
                    <Pagination pageSize={pageSize} currentPage={page} total={count} onChange={(page) => dispatch(setPage(page))} />
                    <div style={{ minWidth: 130 }}>
                        <Select<Option>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => {
                                dispatch(setPage(1))
                                dispatch(setPageSize(Number(option?.value)))
                            }}
                        />
                    </div>
                </div>
            }
            {showImageModal && (
                <ImageMODAL
                    dialogIsOpen={showImageModal}
                    setIsOpen={setShowImageModal}
                    image={particularRowImage && particularRowImage?.split(',')}
                />
            )}
            {showDrawer && (
                <ProductFilterNest
                    showDrawer={showDrawer}
                    handleCloseDrawer={() => setShowDrawer(false)}
                    handleApply={handleApply}
                    subCategoryList={subCategoryList}
                    divisionList={divisionList}
                    categroyList={categoryList}
                    brandList={brandList}
                    productTypeList={productTypeList}
                    setBrandList={setBrandList}
                    setCategoryList={setCategoryList}
                    setDivisionList={setDivisionList}
                    setProductTypeList={setProductTypeList}
                    setSubCategoryList={setSubCategoryList}
                    filters={filters}
                    setFilterString={setFilterString}
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
        </div>
    )
}

export default Products
