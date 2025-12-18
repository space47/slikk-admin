import { Button, Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { setStoreIds } from '@/store/slices/storeSelect/storeSelect.slice'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useState } from 'react'

const StoreSelect = () => {
    const dispatch = useAppDispatch()
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const [storeIdStore, setStoreIdStore] = useState<number[] | null>(null)
    const { store_ids } = useAppSelector((state) => state.storeSelect)
    const List = storeIdStore !== null ? storeIdStore : store_ids

    return (
        <div className="flex flex-col gap-10 w-full ">
            <Select
                isClearable
                isMulti
                className="w-full"
                options={storeList}
                placeholder="Select Store"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id?.toString()}
                value={storeList.filter((store) => List?.includes(store.id))}
                onChange={(selectedOptions) => {
                    setStoreIdStore(selectedOptions ? selectedOptions.map((opt) => opt.id) : [])
                }}
            />

            <div className="flex justify-end">
                <Button variant="blue" onClick={() => dispatch(setStoreIds(storeIdStore ?? []))}>
                    Apply
                </Button>
            </div>
        </div>
    )
}

export default StoreSelect
