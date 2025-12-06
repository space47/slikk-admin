import { TagsDataTypes } from '@/store/types/productTags.types'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import React, { useMemo, useState } from 'react'
import { useProductTagColumns } from '../productTagUtils/useProductTagColumns'
import EasyTable from '@/common/EasyTable'
import ProductTagEditModal from '../productTagEdit/PageEditModal'
import { Button, Input } from '@/components/ui'
import ProductTagAddModal from '../productTagAdd/ProductTagAddModal'
import { notification } from 'antd'
import { AxiosError } from 'axios'
import { useFetchApi } from '@/commonHooks/useFetchApi'
import { useDebounceInput } from '@/commonHooks/useDebounceInput'
import { FiSearch, FiPlus, FiRefreshCw, FiFilter, FiTag, FiDatabase } from 'react-icons/fi'
import { MdOutlineUpdate } from 'react-icons/md'

const ProductTagTable = () => {
    const [isEditModal, setIsEditModal] = useState(false)
    const [particularRow, setParticularRow] = useState<TagsDataTypes>()
    const [isAddModal, setIsAddModal] = useState<boolean>()
    const [inputFilter, setInputFilter] = useState<string>('')
    const [isLoading, setIsLoading] = useState(false)
    const { debounceFilter } = useDebounceInput({ globalFilter: inputFilter, delay: 500 })

    const queryParams = useMemo(() => {
        let domainName = ''
        if (debounceFilter) {
            domainName = `domain=${encodeURIComponent(debounceFilter)}`
        }
        return `/product-field-configuration?${domainName}`
    }, [debounceFilter])

    const { data: productData, setData: setProductData } = useFetchApi<TagsDataTypes>({
        url: queryParams,
        typeOfData: 'Object',
    })

    const updateRowData = (updatedRow: TagsDataTypes, particularRow: TagsDataTypes | undefined) => {
        setProductData((prev) => prev.map((item) => (item === particularRow ? updatedRow : item)))
    }

    const columns = useProductTagColumns({ setIsEditModal, setParticularRow })
    const ObjectData = Object.fromEntries(productData.map((item) => [item?.tag_name, item])) as { [key: string]: TagsDataTypes }

    const handleUpdateTags = async () => {
        setIsLoading(true)
        const body = { product_fields_configuration: ObjectData }
        try {
            const response = await axioisInstance.post(`/product-field-configuration`, body)
            notification.success({
                message: 'Success',
                description: response?.data?.message || 'Tags updated successfully.',
                placement: 'topRight',
            })
        } catch (error) {
            console.error('Error updating tags:', error)
            if (error instanceof AxiosError) {
                notification.error({
                    message: 'Update Failed',
                    description: error?.message || 'Failed to update tags configuration.',
                    placement: 'topRight',
                })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl border border-gray-100">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md">
                        <FiTag className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Product Tags</h1>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                            <FiDatabase className="w-3 h-3" />
                            {productData.length} tags configured
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap gap-3">
                    <Button
                        variant="accept"
                        onClick={handleUpdateTags}
                        disabled={isLoading}
                        className="group flex items-center gap-2 bg-gradient-to-shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        {isLoading ? (
                            <FiRefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <MdOutlineUpdate className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                                <span>Update Tags</span>
                            </>
                        )}
                    </Button>

                    <Button
                        variant="blue"
                        onClick={() => setIsAddModal(true)}
                        className="group flex items-center gap-2   shadow-lg hover:shadow-xl transition-all duration-300"
                        icon={<FiPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    >
                        <span>Add New Tag</span>
                    </Button>
                </div>
            </div>

            <div className="mb-8 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1 max-w-lg">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                value={inputFilter}
                                placeholder="Search by domain name..."
                                className="pl-10 pr-4 py-3 w-full rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 shadow-sm"
                                onChange={(e) => setInputFilter(e.target.value)}
                            />
                            {debounceFilter && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <FiFilter className="w-3 h-3" />
                                        Filtered Value
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">{productData.length} items</span>
                        {debounceFilter && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium flex items-center gap-1">
                                <FiFilter className="w-3 h-3" />
                                Active filter
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-gray-700">
                        <FiDatabase className="w-4 h-4" />
                        <span className="font-medium">Tag Configuration List</span>
                    </div>
                </div>
                <EasyTable overflow noPage mainData={productData} columns={columns} />
            </div>

            {/* Modals */}
            {isEditModal && (
                <ProductTagEditModal
                    isOpen={isEditModal}
                    particularRow={particularRow}
                    setIsOpen={setIsEditModal}
                    setParticularRow={(row) => {
                        setParticularRow(row)
                        updateRowData(row, particularRow)
                    }}
                />
            )}

            {isAddModal && (
                <ProductTagAddModal isOpen={isAddModal} setIsOpen={setIsAddModal} tagData={productData} setTagData={setProductData} />
            )}
        </div>
    )
}

export default ProductTagTable
