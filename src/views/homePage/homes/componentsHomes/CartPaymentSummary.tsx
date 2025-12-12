import { Card } from '@/components/ui'
import { useAppSelector } from '@/store'
import { OrderSummaryTYPE } from '@/store/types/orderUserSummary.types'
import { GiCash } from 'react-icons/gi'
import { FaCreditCard, FaTruck, FaTag, FaCrown, FaCoins, FaReceipt, FaCalendarAlt, FaMoneyBillWave, FaRupeeSign } from 'react-icons/fa'
import { MdPayment } from 'react-icons/md'

import moment from 'moment'
import React from 'react'
import { NumericFormat } from 'react-number-format'
import CommonAccordion from '@/common/CommonAccordion'

const CartPaymentSummary = () => {
    const { customerData } = useAppSelector<OrderSummaryTYPE>((state) => state.userSummary)
    const cartItems = customerData?.cart

    return (
        <div className="">
            <CommonAccordion
                header={
                    <div className="flex justify-between items-center  border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-md">
                                <MdPayment className="text-2xl text-white" />
                            </div>
                            <div>
                                <h5 className="text-xl font-bold text-gray-800">Payment Summary</h5>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-gray-800">
                                <NumericFormat
                                    displayType="text"
                                    value={cartItems?.amount}
                                    prefix="Rs. "
                                    thousandSeparator={true}
                                    decimalScale={2}
                                />
                            </div>
                            <span className="text-sm text-green-600 font-medium">Total Amount</span>
                        </div>
                    </div>
                }
            >
                {cartItems ? (
                    <Card className="mb-4 h-full shadow-lg rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300">
                        <div className="p-6">
                            {/* Header */}

                            {/* Payment Details List */}
                            <div className="space-y-4">
                                {/* Delivery Charge */}
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <FaTruck className="text-blue-600" />
                                        <span className="text-gray-700">Delivery Charge</span>
                                    </div>
                                    <span className="font-bold text-gray-800">
                                        <NumericFormat
                                            displayType="text"
                                            value={cartItems?.delivery}
                                            prefix="Rs. "
                                            thousandSeparator={true}
                                            decimalScale={2}
                                        />
                                    </span>
                                </div>

                                {/* Discounts Section */}
                                <div className="space-y-3">
                                    {/* Coupon Discount */}
                                    {cartItems?.coupon_discount !== 0 && (
                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FaTag className="text-green-600" />
                                                <span className="text-gray-700">Coupon Discount</span>
                                            </div>
                                            <span className="font-bold text-green-600">
                                                -
                                                <NumericFormat
                                                    displayType="text"
                                                    value={cartItems?.coupon_discount}
                                                    prefix="Rs. "
                                                    thousandSeparator={true}
                                                    decimalScale={2}
                                                />
                                            </span>
                                        </div>
                                    )}

                                    {/* Loyalty Discount */}
                                    {cartItems?.loyalty_tier_discount !== 0 && (
                                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FaCrown className="text-purple-600" />
                                                <span className="text-gray-700">Loyalty Discount</span>
                                            </div>
                                            <span className="font-bold text-purple-600">
                                                -
                                                <NumericFormat
                                                    displayType="text"
                                                    value={cartItems?.loyalty_tier_discount}
                                                    prefix="Rs. "
                                                    thousandSeparator={true}
                                                    decimalScale={2}
                                                />
                                            </span>
                                        </div>
                                    )}

                                    {/* Points Discount */}
                                    {cartItems?.points_discount !== '0.00' && (
                                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-xl hover:bg-amber-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <FaCoins className="text-amber-600" />
                                                <span className="text-gray-700">Points Discount</span>
                                            </div>
                                            <span className="font-bold text-amber-600">
                                                -
                                                <NumericFormat
                                                    displayType="text"
                                                    value={cartItems?.points_discount}
                                                    prefix="Rs. "
                                                    thousandSeparator={true}
                                                    decimalScale={2}
                                                />
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Order Time */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaCalendarAlt className="text-gray-500" />
                                        <span className="text-gray-700">Order Time</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                        {moment(cartItems?.create_date).format('MM/DD/YYYY hh:mm:ss A')}
                                    </span>
                                </div>

                                {/* Tax */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <FaReceipt className="text-gray-500" />
                                        <span className="text-gray-700">Tax</span>
                                    </div>
                                    <span className="font-semibold text-gray-800">
                                        <NumericFormat
                                            displayType="text"
                                            value={cartItems?.tax}
                                            prefix="Rs. "
                                            thousandSeparator={true}
                                            decimalScale={2}
                                        />
                                    </span>
                                </div>

                                {/* Other Charges */}
                                {cartItems?.other_charges_data && Object.entries(cartItems.other_charges_data).length > 0 && (
                                    <div className="space-y-2">
                                        <h6 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Other Charges</h6>
                                        {Object.entries(cartItems.other_charges_data).map(([label, value]) => (
                                            <div
                                                key={label}
                                                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <GiCash className="text-gray-500" />
                                                    <span className="text-gray-700">{label}</span>
                                                </div>
                                                <span className="font-semibold text-gray-800">
                                                    <NumericFormat
                                                        displayType="text"
                                                        value={(Math.round((value as number) * 100) / 100).toFixed(2)}
                                                        prefix="Rs. "
                                                        thousandSeparator={true}
                                                    />
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Divider */}
                                <div className="relative my-4">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 bg-white text-gray-500">
                                            <FaMoneyBillWave className="text-gray-400" />
                                        </span>
                                    </div>
                                </div>

                                {/* Total Amount - Highlighted */}
                                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                                    <div className="flex items-center gap-3">
                                        <FaRupeeSign className="text-2xl text-blue-600" />
                                        <span className="text-lg font-bold text-gray-800">Total Amount</span>
                                    </div>
                                    <span className="text-2xl font-bold text-gray-800">
                                        <NumericFormat
                                            displayType="text"
                                            value={cartItems?.amount}
                                            prefix="Rs. "
                                            thousandSeparator={true}
                                            decimalScale={2}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 min-h-[200px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <FaCreditCard className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-500 mb-2">No Payment Information</h3>
                        <p className="text-sm text-gray-400 text-center">Complete your order to view payment summary</p>
                    </div>
                )}
            </CommonAccordion>
        </div>
    )
}

export default CartPaymentSummary
