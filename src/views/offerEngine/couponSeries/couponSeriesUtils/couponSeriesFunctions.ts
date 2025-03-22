interface couponSeriesProps {
    value: string
    CouponArray: {
        label: string
        value: string
    }[]
    setSelectedData: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>
}

export const handleSelectCoupons = ({ value, CouponArray, setSelectedData }: couponSeriesProps) => {
    const selected = CouponArray.find((item) => item.value === value)
    if (selected) {
        setSelectedData(selected)
    }
}
