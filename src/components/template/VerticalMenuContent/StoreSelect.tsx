import { Select } from '@/components/ui'
import { useAppDispatch, useAppSelector } from '@/store'
import { setStoreIds } from '@/store/slices/storeSelect/storeSelect.slice'
import { USER_PROFILE_DATA } from '@/store/types/company.types'

const StoreSelect = () => {
    const dispatch = useAppDispatch()
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)
    const { store_ids } = useAppSelector((state) => state.storeSelect)

    console.log('store id is', store_ids)

    return (
        <div className="flex flex-col w-full ">
            <Select
                isClearable
                isMulti
                className=" w-full"
                options={storeList}
                placeholder="Select Store"
                getOptionLabel={(option) => option.name}
                getOptionValue={(option) => option.id?.toString()}
                value={storeList.filter((store) => store_ids.includes(store.id))}
                onChange={(selectedOptions) => {
                    dispatch(setStoreIds(selectedOptions?.map((opt) => opt.id) || []))
                }}
            />
        </div>
    )
}

export default StoreSelect
