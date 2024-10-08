import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import type { MouseEvent } from 'react'
// import { CREATE_POST } from './commonPost'
import Upload from '@/components/ui/Upload'
import { Dropdown } from '@/components/ui'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import CreatePostTable from '@/views/creatorPost/uploadPost/createPost/CreatePostTable'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import OrderCreateTable from './OrderCreateTable'

interface ReplaceDrawerProps {
    dialogIsOpen: boolean
    onDialogClose: any
    handleSubmit: any
    id: number
    invoice_id: any
}
type ProductTable = {
    sku: string
    barcode: string
    product: string
    image: string[]
    brand: string
}
const DROPDOWNARRAY = [
    { label: 'Name', value: 'name' },
    { label: 'SKU', value: 'sku' },
]

const ReplaceDrawer = ({ dialogIsOpen, onDialogClose, handleSubmit, id, invoice_id }: ReplaceDrawerProps) => {
    const [searchInput, setSearchInput] = useState<string>('')
    const [showTable, setShowTable] = useState(false)
    const [tableData, setTableData] = useState<ProductTable[]>([])
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>()
    const [productData, setProductData] = useState('')
    const [showBelowData, setShowBelowData] = useState(false)
    const [productTableData, setProductTableData] = useState()

    const fetchInput = async () => {
        try {
            if (searchInput) {
                const qname = currentSelectedPage?.value === 'sku' ? 'sku' : 'name'
                const response = await axioisInstance.get(`/search/product?dashboard=true&${qname}=${searchInput}`)
                const data = response.data.results
                setTableData(data)
                console.log(data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchInput()
    }, [searchInput])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value)
        setShowTable(true)
    }
    const handleSelect = (value: any) => {
        const selected = DROPDOWNARRAY.find((item) => item.value === value)
        if (selected) {
            setCurrentSelectedPage(selected)
        }
    }

    const handleActionClick = (value: any) => {
        console.log('Barcode', value.barcode)
        setProductData(value.barcode)
        setShowTable(false)
        setShowBelowData(true)
        setProductTableData(value)
        setSearchInput('')
    }

    const handleAPIforReplace = async () => {
        try {
            const body = {
                action: 'REPLACE_ORDER_ITEM',
                item_id: id,
                replacement_barcode: productData,
            }
            console.log('MAIN BODY', body)
            const response = await axioisInstance.patch(`/merchant/order/${invoice_id}`, body)

            notification.success({
                message: 'SUCCESS',
                description: response.data.message || 'Successfully replaces item',
            })
        } catch (error) {
            console.log(error)
        }
    }

    console.log('OOKOKOOKOK', productTableData)

    return (
        <div>
            <Dialog isOpen={dialogIsOpen} onClose={onDialogClose} onRequestClose={onDialogClose} width={800}>
                <h5 className="mb-4">Replace Order Item Here</h5>
                <div className="flex flex-col gap-4 ">
                    <div className="text-xl">Barcode</div>
                    <div className="flex gap-10">
                        <div className="flex justify-start ">
                            <input
                                type="search"
                                name="search"
                                id=""
                                placeholder="search SKU for product"
                                value={searchInput}
                                className=" w-[250px] rounded-[10px]"
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="bg-gray-200 rounded-[10px] font-bold text-lg ">
                            <Dropdown
                                className=" text-xl text-black bg-gray-200 font-bold "
                                title={currentSelectedPage?.value ? currentSelectedPage.label : 'SELECT'}
                                onSelect={handleSelect}
                            >
                                {DROPDOWNARRAY?.map((item, key) => {
                                    return (
                                        <DropdownItem key={key} eventKey={item.value}>
                                            <span>{item.label}</span>
                                        </DropdownItem>
                                    )
                                })}
                            </Dropdown>
                        </div>
                    </div>

                    <div className=" overflow-scroll scrollbar-hide">
                        {showTable && searchInput && <OrderCreateTable data={tableData} handleActionClick={handleActionClick} />}
                    </div>
                    {showBelowData && (
                        <>
                            <div className="flex gap-1 items-center mt-4 justify-center">
                                <div>
                                    <img
                                        src={productTableData?.image.split(',')[0].trim()}
                                        alt="img"
                                        className="px-4 py-2 border"
                                        style={{ width: '200px', height: '200px' }}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="px-4 py-2 border">
                                        {' '}
                                        <span className="font-bold">SKU:</span> {productTableData?.sku}
                                    </div>
                                    <div className="px-4 py-2 border">
                                        <span className="font-bold">Barcode: </span>
                                        {productTableData?.barcode}
                                    </div>

                                    <div className="px-4 py-2 border">
                                        <span className="font-bold">Brand:</span> {productTableData?.brand}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="mt-10">
                    {/* {productData !== undefined ||
                        (productData !== null && (
                            
                        ))} */}
                    <button className="flex justify-end items-end bg-red-500 text-white px-3 py-2 rounded-md" onClick={handleAPIforReplace}>
                        Replace
                    </button>
                </div>
            </Dialog>
        </div>
    )
}

export default ReplaceDrawer
