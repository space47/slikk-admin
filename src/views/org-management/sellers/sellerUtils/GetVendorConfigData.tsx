import { useAppSelector } from '@/store'
import { VendorStateType } from '@/store/slices/vendorsSlice/vendors.slice'

export const GetVendorConfigData = () => {
    const { configValues } = useAppSelector<VendorStateType>((state) => state.vendor)

    const financeNumbers = configValues?.value?.finance_team?.map((item) => ({
        label: item.mobile,
        value: item.mobile,
    }))
    const financeEmail = configValues?.value?.finance_team?.map((item) => ({
        label: item.email,
        value: item.email,
    }))
    const financeName =
        configValues?.value?.finance_team?.length &&
        configValues?.value?.finance_team?.map((item) => ({
            label: item.name,
            value: item.name,
        }))

    return { financeNumbers, financeEmail, financeName }
}
