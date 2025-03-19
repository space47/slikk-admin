export const handleCouponSelect = (
    value: string,
    CouponTypeArray: {
        label: string
        value: string
    }[],
    setCurrentCouponSelect: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>,
) => {
    const selected = CouponTypeArray.find((item) => item.value === value)
    if (selected) {
        setCurrentCouponSelect(selected)
    }
}
export const handleDiscountTypeSelect = (
    value: string,
    CouponDiscountTypeArray: {
        label: string
        value: string
    }[],
    setCurrentDiscountTypeSelect: React.Dispatch<React.SetStateAction<Record<string, string> | undefined>>,
) => {
    const selected = CouponDiscountTypeArray.find((item) => item.value === value)
    if (selected) {
        setCurrentDiscountTypeSelect(selected)
    }
}
