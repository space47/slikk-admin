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
import { useAppSelector } from '@/store'
import { DIVISION_STATE } from '@/store/types/division.types'
import DialogConfirm from '@/common/DialogConfirm'
import { FILTER_STATE } from '@/store/types/filters.types'
import { Dropdown } from '@/components/ui'
import { ProductTypes, ProductFilterArray } from './ProductCommon'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import { Option, pageSizeOptions } from './CommonType'
import { useProductColumns } from './productutils/ProductColumns'
import { fetchProducts, handleDownload, handleFacebookSync, handleGenerateSiteMap, handleRandomize } from './productutils/productApiCalls'
import { handleApply, handleProductSelect } from './productutils/productFunction'

const Products = () => {
    const navigate = useNavigate()
    const [data, setData] = useState<ProductTypes[]>([])
    const [totalData, setTotalData] = useState(0)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [globalFilter, setGlobalFilter] = useState('')
    const [showImageModal, setShowImageModal] = useState(false)
    const [particularRowImage, setParticularROwImage] = useState<any>([])
    const [divisionList, setDivisionList] = useState<string[]>([])
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])
    const [productTypeList, setProductTypeList] = useState([])
    const [brandList, setBrandList] = useState([])
    const [typeFetch, setTypeFetch] = useState('')
    const [filteredCategories, setFilteredCategories] = useState([])
    const [filteredSubCategories, setFilteredSubCategories] = useState([])
    const [filteredProductTypes, setFilteredProductTypes] = useState([])
    const [showFacebookDialog, setShowFacebookDialog] = useState(false)
    const [showRandomizeDialog, setShowRandomizeDialog] = useState(false)
    const [selectFilterString, setFilterString] = useState('')
    const [showDrawer, setShowDrawer] = useState(false)
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(ProductFilterArray[0])
    const divisions = useAppSelector<DIVISION_STATE>((state) => state.division)
    const filters = useAppSelector<FILTER_STATE>((state) => state.filters)

    const fetchData = async () => {
        const { data, total } = await fetchProducts(page, pageSize, typeFetch, globalFilter, currentSelectedPage)
        setData(data)
        setTotalData(total)
    }

    useEffect(() => {
        fetchData()
    }, [page, pageSize, typeFetch, globalFilter])

    const handleOpenModal = (img: any) => {
        setParticularROwImage(img)
        setShowImageModal(true)
    }

    const columns = useProductColumns({ handleOpenModal })

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-center xl:justify-between mb-4 gap-4">
                <div className="w-full md:w-1/3 flex justify-between gap-3">
                    <div className="flex gap-2">
                        <input
                            type="search"
                            placeholder="Search here"
                            value={globalFilter}
                            className="p-2 w-full md:w-[70%] border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                        <div className="bg-gray-100 xl:text-md text-sm w-auto rounded-md dark:bg-blue-600 dark:text-white font-bold">
                            <Dropdown
                                className="text-black bg-gray-200 font-bold px-4 py-2 rounded-md"
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={(val) => handleProductSelect(val, setCurrentSelectedPage)}
                            >
                                {ProductFilterArray?.map((item, key) => (
                                    <DropdownItem key={key} eventKey={item.value}>
                                        <span>{item.label}</span>
                                    </DropdownItem>
                                ))}
                            </Dropdown>
                        </div>
                    </div>
                    <button
                        className="bg-gray-100 text-black px-4 py-2 flex items-center gap-2 xl:hidden hover:bg-gray-200 rounded-lg"
                        onClick={() => handleDownload(currentSelectedPage, globalFilter, typeFetch)}
                    >
                        <IoMdDownload className="text-xl" />
                    </button>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <div className="flex gap-3">
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-purple-600 rounded-lg text-white bg-purple-700"
                            onClick={() => setShowRandomizeDialog(true)}
                        >
                            <span className="font-bold">Randomize</span>
                        </button>
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-yellow-500 rounded-lg text-white bg-yellow-600"
                            onClick={() => handleGenerateSiteMap()}
                        >
                            <span className="font-bold">SiteMap</span>
                        </button>
                        <button
                            className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-blue-600 rounded-lg text-white bg-blue-700"
                            onClick={() => setShowFacebookDialog(true)}
                        >
                            <span className="font-bold">Sync</span> <FaFacebook className="text-xl" />
                        </button>
                        <button
                            className="bg-green-500 text-white px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-green-400 rounded-lg font-bold"
                            onClick={() => handleDownload(currentSelectedPage, globalFilter, typeFetch)}
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
                        <button
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-700 w-full md:w-auto text-center font-bold"
                            onClick={() => navigate('/app/catalog/products/addNew')}
                        >
                            + Product
                        </button>
                    </div>
                </div>
            </div>

            <EasyTable mainData={data} columns={columns} page={page} pageSize={pageSize} />
            {
                <div className="flex items-center justify-between mt-4">
                    <Pagination pageSize={pageSize} currentPage={page} total={totalData} onChange={(page) => setPage(page)} />
                    <div style={{ minWidth: 130 }}>
                        <Select<Option>
                            size="sm"
                            isSearchable={false}
                            value={pageSizeOptions.find((option) => option.value === pageSize)}
                            options={pageSizeOptions}
                            onChange={(option) => {
                                setPage(1)
                                setPageSize(Number(option?.value))
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
                    handleApply={() => handleApply(brandList, selectFilterString, setShowDrawer, setTypeFetch)}
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
                    setTypeFetch={setTypeFetch}
                    filteredCategories={filteredCategories}
                    filteredProductTypes={filteredProductTypes}
                    filteredSubCategories={filteredSubCategories}
                    setFilteredCategories={setFilteredCategories}
                    setFilteredProductTypes={setFilteredProductTypes}
                    setFilteredSubCategories={setFilteredSubCategories}
                    options={divisions.divisions}
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
        </div>
    )
}

export default Products
