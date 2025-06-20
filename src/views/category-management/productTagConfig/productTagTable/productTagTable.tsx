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

const ProductTagTable = () => {
    const [isEditModal, setIsEditModal] = useState(false)
    const [particularRow, setParticularRow] = useState<TagsDataTypes>()
    const [isAddModal, setIsAddModal] = useState<boolean>()
    const [inputFilter, setInputFilter] = useState<string>('')

    const queryParams = useMemo(() => {
        let domainName = ''
        if (inputFilter) {
            domainName = `domain=${encodeURIComponent(inputFilter)}`
        }
        return `/product-field-configuration?${domainName}`
    }, [inputFilter])

    const { data: productData, setData: setProductData } = useFetchApi<TagsDataTypes>({ url: queryParams, typeOfData: 'Object' })

    const updateRowData = (updatedRow: TagsDataTypes, particularRow: TagsDataTypes | undefined) => {
        setProductData((prev) => prev.map((item) => (item === particularRow ? updatedRow : item)))
    }
    const columns = useProductTagColumns({ setIsEditModal, setParticularRow })
    const ObjectData = Object.fromEntries(productData.map((item) => [item?.tag_name, item])) as { [key: string]: TagsDataTypes }

    const handleUpdateTags = async () => {
        const body = { product_fields_configuration: ObjectData }
        try {
            const response = await axioisInstance.post(`/product-field-configuration`, body)
            notification.success({ message: response?.data?.message || 'Tags updated successfully.' })
        } catch (error) {
            console.error('Error updating tags:', error)
            if (error instanceof AxiosError) {
                notification.error({ message: error?.message || 'Tags update failed.' })
            }
        }
    }

    return (
        <div className="p-3 shadow-xl rounded-xl">
            <div className="flex justify-between mb-5">
                <div>
                    <Button variant="new" onClick={handleUpdateTags}>
                        Update Tags Config
                    </Button>
                </div>
                <div>
                    <Button variant="new" onClick={() => setIsAddModal(true)}>
                        Add Tags
                    </Button>
                </div>
            </div>

            <div className="mb-10 xl:w-1/4 ">
                <Input
                    value={inputFilter}
                    placeholder="Enter Domain Name"
                    className="rounded-xl"
                    onChange={(e) => setInputFilter(e.target.value)}
                />
            </div>
            <div>
                <EasyTable overflow noPage mainData={productData} columns={columns} />
            </div>
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
