import React from 'react'
import InventoryBulkUpload from './InventoryBulkUpload'
import UpdateInventoryTable from './InventoryUpdateTable'

const UpdateInventory = () => {
    return (
        <div className="flex flex-col gap-3">
            Update Inventory:
            <div>
                <InventoryBulkUpload />
            </div>
            <div>
                <UpdateInventoryTable />
            </div>
        </div>
    )
}

export default UpdateInventory
