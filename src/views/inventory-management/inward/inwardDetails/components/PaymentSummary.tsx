import Card from '@/components/ui/Card'
import { NumericFormat } from 'react-number-format'
import moment from 'moment'

type PaymentSummaryProps = {
    received_address: string
    received_by: {
        email: string
        mobile: string
        name: string
    }
}

const PaymentSummary = ({
    received_address,
    received_by
}: PaymentSummaryProps) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4 text-[18px]">Recepient Detail:</h5>
            <hr className="mb-4" />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-start flex-col gap-4">
                    {/* <h3 className="text-md font-semibold">{data?.partner}</h3> */}

                    <div className=" flex flex-col">
                        <div className="text-[16px] font-bold mb-4 flex gap-6">
                            Address:{' '}
                            <span className="font-normal">
                                {received_address}
                            </span>
                        </div>
                        <hr className="mb-4" />
                        <h4 className="text-[15px]">Received By</h4> <br />
                        <div className="text-[15px] font-bold mb-4 flex gap-7">
                            Name:{' '}
                            <span className="font-normal">
                                {received_by?.name}
                            </span>
                        </div>
                        <div className="text-[15px] font-bold mb-4 flex gap-7">
                            Mobile:{' '}
                            <span className="font-normal">
                                {received_by?.mobile}
                            </span>
                        </div>
                        <div className="text-[15px] font-bold mb-4 flex gap-7">
                            Email:{' '}
                            <span className="font-normal">
                                {received_by?.email}
                            </span>
                        </div>
                        <hr className="" />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center text-[16px]">
                @Sliksync Technologies Pvt. Ltd.
            </div>
        </Card>
    )
}

export default PaymentSummary
