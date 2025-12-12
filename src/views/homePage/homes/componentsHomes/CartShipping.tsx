import CommonAccordion from '@/common/CommonAccordion'
import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { FaMapMarkerAlt, FaDirections, FaMap, FaFileInvoice, FaHome, FaExclamationTriangle } from 'react-icons/fa'
import { MdLocationOn } from 'react-icons/md'

const CartShipping = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const cartItems = customerData?.cart

    return (
        <div className="">
            <CommonAccordion
                header={
                    <div className="flex items-center gap-3 ">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <MdLocationOn className="text-2xl text-blue-600" />
                        </div>
                        <h5 className="text-xl font-bold text-gray-800">Address Details</h5>
                    </div>
                }
            >
                {cartItems ? (
                    <Card className="h-full shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                        <div className="p-6">
                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaHome className="text-blue-500" />
                                        <h6 className="text-lg font-semibold text-gray-700">Shipping Address</h6>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                                        <div className="flex items-start gap-3">
                                            <FaMapMarkerAlt className="text-gray-400 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium text-gray-500">Address</span>
                                                <span className="text-gray-800 font-semibold">{cartItems?.address_name}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <FaDirections className="text-gray-400 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium text-gray-500">Directions</span>
                                                <span className="text-gray-700">
                                                    {cartItems?.directions || (
                                                        <span className="text-gray-400 italic">No directions provided</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <FaMap className="text-gray-400 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium text-gray-500">Area</span>
                                                <span className="text-gray-800 font-semibold">{cartItems?.area}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider with icon */}
                                <div className="relative flex items-center justify-center">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <div className="px-4">
                                        <div className="p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-full">
                                            <MdLocationOn className="text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                {/* Billing Address Section */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaFileInvoice className="text-green-500" />
                                        <h6 className="text-lg font-semibold text-gray-700">Billing Address</h6>
                                    </div>

                                    <div className="bg-green-50 rounded-xl p-5">
                                        <div className="flex items-start gap-3">
                                            <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
                                            <div className="flex-1">
                                                <span className="block text-sm font-medium text-green-600">Billing Address</span>
                                                <span className="text-gray-800 font-semibold">
                                                    {cartItems?.billing_address || (
                                                        <span className="text-gray-500 italic">Same as shipping address</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
                        <div className="p-6 bg-amber-50 rounded-2xl mb-6">
                            <FaExclamationTriangle className="text-5xl text-amber-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-3">No Address Details Available</h3>
                        <p className="text-gray-500 max-w-md">
                            Shipping and billing details have not been added yet. Please add your address information to proceed with the
                            order.
                        </p>
                        <button className="mt-8 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg">
                            Add Address Details
                        </button>
                    </div>
                )}
            </CommonAccordion>
        </div>
    )
}

export default CartShipping
