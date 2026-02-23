/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import moment from 'moment'
import { Order } from '@/store/types/newOrderTypes'
import { EOrderStatus } from '../orderList.common'

type PaymentInfoProps = {
    label: string
    value: string | number
    isLast?: boolean
    isNumber?: boolean
    otherValue?: string
}

type PaymentSummaryProps = {
    handleMarkAsPaid: () => Promise<void>
    handlePODAction: () => Promise<void>
    mainData: Order
}

export const PaymentInfo = ({ label, value, isLast, isNumber, otherValue }: PaymentInfoProps) => {
    return (
        <li className={`flex items-center justify-between${!isLast ? ' mb-3' : ''}`}>
            <span>{label}</span>
            <span className="font-semibold">
                {isNumber ? (
                    <NumericFormat
                        displayType="text"
                        value={(Math.round((value as number) * 100) / 100).toFixed(2)}
                        prefix={'Rs.'}
                        thousandSeparator={true}
                    />
                ) : (
                    <>
                        <span className="font-semibold">
                            Rs.{value} {otherValue && <span className="text-blue-600">({otherValue})</span>}
                        </span>
                    </>
                )}
            </span>
        </li>
    )
}
export const PaymentType = ({ label, value, isLast }: PaymentInfoProps) => {
    return (
        <li className={`flex items-center justify-between${!isLast ? ' mb-3' : ''}`}>
            <span>{label}</span>
            <span className="font-semibold">
                <div>{value}</div>
            </span>
        </li>
    )
}

const PaymentSummary = ({
    handleMarkAsPaid,

    handlePODAction,
    mainData,
}: PaymentSummaryProps) => {
    return (
        <Card className="mb-4">
            <div className="flex justify-between items-center xl:items-baseline">
                <h5 className="mb-4">Payment Summary</h5>
                <div>
                    {mainData?.payment?.status === EOrderStatus.paid ? (
                        <p className="bg-gray-500 px-5 rounded-[22px] flex items-center justify-center text-white text-lg">PAID</p>
                    ) : mainData?.payment?.status === EOrderStatus.pod_paid ? (
                        <p className="bg-gray-500 px-5 rounded-[22px] flex items-center justify-center text-white text-lg">POD PAID</p>
                    ) : (mainData?.payment?.status === EOrderStatus.pod_created || mainData?.payment?.status === EOrderStatus.failed) &&
                      mainData?.payment?.mode === EOrderStatus.pod &&
                      mainData?.status === EOrderStatus.completed ? (
                        <button
                            className="bg-green-500 px-5 rounded-[22px] flex items-center justify-center text-white text-lg"
                            onClick={handlePODAction}
                        >
                            Mark Pod Paid
                        </button>
                    ) : (
                        <button
                            className="bg-blue-500 xl:px-5 px-1 xl:rounded-[22px] rounded-[10px] flex items-center justify-center text-white xl:text-lg text-[13px]"
                            onClick={handleMarkAsPaid}
                        >
                            Check Payment Status
                        </button>
                    )}
                </div>
            </div>
            <ul className="mt-5">
                <PaymentInfo label="Amount" value={mainData?.amount} />
                <PaymentType label="Mode" value={mainData?.payment?.mode} />

                {!!parseInt(mainData?.delivery as string) && <PaymentInfo label="Delivery Charge" value={mainData?.delivery} />}
                {!!parseInt(mainData?.coupon_code as string) && (
                    <PaymentInfo label="Coupon Discount" value={mainData?.coupon_discount} otherValue={mainData?.coupon_code || ''} />
                )}
                {!!parseInt(mainData?.loyalty_discount) && <PaymentInfo label="Loyalty Discount" value={mainData?.loyalty_discount} />}
                {!!parseInt(mainData?.other_charges) && <PaymentInfo label="Other Charges" value={mainData?.other_charges} />}
                {mainData?.other_discounts && <PaymentInfo isNumber label="Other Charges" value={mainData?.other_discounts} />}
                {!!Object.entries(mainData?.other_charges_data).length &&
                    Object.entries(mainData.other_charges_data).map(([key, value]) => (
                        <div key={key} className="flex justify-between mb-2">
                            {key}
                            <span className="font-semibold">Rs.{'' + value}</span>
                        </div>
                    ))}
                {!!Object.entries(mainData?.other_discounts_data).length &&
                    Object.entries(mainData.other_discounts_data).map(([key, value]) => (
                        <div key={key} className="flex justify-between mb-2">
                            {key}
                            <span className="font-semibold">Rs.{'' + value}</span>
                        </div>
                    ))}

                {!!parseInt(mainData?.points_discount) && <PaymentInfo label="Points Discount" value={mainData?.points_discount} />}
                <PaymentType label="Time" value={moment(mainData?.payment?.transaction_time).format('MM/DD/YYYY hh:mm:ss a')} />
                <PaymentInfo isNumber label="Tax" value={mainData?.tax} />
                <PaymentType label="Id" value={mainData?.order_id} />
                <PaymentType label="Transaction Id" value={mainData?.payment?.gateway_transaction_id || 'N/A'} />
                <hr className="mb-3" />
                <PaymentInfo isLast isNumber label="Total" value={mainData?.payment?.amount} />
            </ul>
        </Card>
    )
}

export default PaymentSummary
