import { IconText } from '@/components/shared'
import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'

const CartShipping = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const cartItems = customerData?.cart

    return (
        <div>
            {cartItems ? (
                <Card>
                    <h5 className="mb-4">Address</h5>
                    <hr className="my-5" />
                    <h6 className="mb-4">Shipping Address</h6>
                    <address className="not-italic">
                        <div className="flex gap-2">
                            <span className="font-bold">Address:</span>
                            {cartItems?.address_name}
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold">Directions:</span>
                            {cartItems?.directions}
                        </div>
                        <div className="flex gap-2">
                            <span className="font-bold">Area:</span>
                            {cartItems?.area}
                        </div>
                    </address>
                    <hr className="my-5" />
                    <address className="not-italic">
                        <div className="mb-1 flex gap-2">
                            <span className="font-bold">Billing Address:</span>
                            {cartItems?.billing_address}
                        </div>
                    </address>
                </Card>
            ) : (
                <div className="flex justify-center mt-20 items-center">
                    <br />
                    <br />
                    <div className="flex justify-center flex-wrap font-bold text-xl">NO SHIPPING OR BILLING DETAILS AVAILABLE</div>
                </div>
            )}
        </div>
    )
}

export default CartShipping
