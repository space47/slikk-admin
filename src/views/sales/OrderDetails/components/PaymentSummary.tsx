import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import moment from 'moment'

type PaymentInfoProps = {
    label?: string
    value?: string | number
    isLast?: boolean
}

type PaymentSummaryProps = {
    tax: string | number
    delivery: string
    amount: string
    data?: {
        amount: number
        mode: string
        transaction_time: string
    }
}

const PaymentInfo = ({ label, value, isLast }: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${
                !isLast ? ' mb-3' : ''
            }`}
        >
            <span>{label}</span>
            <span className="font-semibold">
                <NumericFormat
                    displayType="text"
                    value={(Math.round((value as number) * 100) / 100).toFixed(
                        2,
                    )}
                    prefix={'Rs.'}
                    thousandSeparator={true}
                />
            </span>
        </li>
    )
}
const PaymentType = ({ label, value, isLast }: PaymentInfoProps) => {
    return (
        <li
            className={`flex items-center justify-between${
                !isLast ? ' mb-3' : ''
            }`}
        >
            <span>{label}</span>
            <span className="font-semibold">
                <div>{value}</div>
            </span>
        </li>
    )
}

const PaymentSummary = ({
    data,
    tax,
    delivery,
    amount,
}: PaymentSummaryProps) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4">Payment Summary</h5>
            <ul>
                <div className="flex justify-between mb-1">
                    Amount <span className="font-semibold">Rs.{amount}</span>
                </div>
                <PaymentType label="Mode" value={data?.mode} />
                {/* <PaymentType label="Delivery Charge" value={delivery} /> */}
                <div className="flex justify-between mb-2">
                    Delivery Charge{' '}
                    <span className="font-semibold">Rs.{delivery}</span>
                </div>
                <PaymentType
                    label="Time"
                    value={moment(data?.transaction_time).format(
                        'MM/DD/YYYY hh:mm:ss a',
                    )}
                />
                <PaymentInfo label="Tax" value={tax} />
                <hr className="mb-3" />
                <PaymentInfo isLast label="Total" value={data?.amount} />
            </ul>
        </Card>
    )
}

export default PaymentSummary
