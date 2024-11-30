import React, { useState } from 'react'
import InventoryBulkUpload from './InventoryBulkUpload'
import UpdateInventoryTable from './InventoryUpdateTable'
import UpdateCartItems from './UpdateCartItems'

const UpdateInventory = () => {
    const [tabSelect, setTabSelect] = useState('update_inventory')

    const handleSelectTab = (value: string) => {
        setTabSelect(value)
    }
    return (
        <div className="flex flex-col gap-10">
            <div className="flex gap-10 justify-start">
                <div
                    className={`flex  cursor-pointer ${tabSelect === 'update_inventory' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('update_inventory')}
                >
                    <span className="text-xl font-bold">Update Inventory</span>
                </div>
                <div
                    className={`flex   cursor-pointer  ${tabSelect === 'update_cart' ? ' border-b-4 border-black' : ''}`}
                    onClick={() => handleSelectTab('update_cart')}
                >
                    <span className="text-xl font-bold">Update Cart</span>
                </div>
            </div>
            {tabSelect === 'update_inventory' && (
                <>
                    <div>
                        <InventoryBulkUpload />
                    </div>
                    <div>
                        <UpdateInventoryTable />
                    </div>
                </>
            )}

            {tabSelect === 'update_cart' && (
                <>
                    <UpdateCartItems />
                </>
            )}
        </div>
    )
}

export default UpdateInventory
