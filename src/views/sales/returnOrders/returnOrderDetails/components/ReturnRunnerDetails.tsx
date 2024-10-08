import Card from '@/components/ui/Card'
// import Avatar from '@/components/ui/Avatar'
import IconText from '@/components/shared/IconText'
import { HiPhone, HiExternalLink } from 'react-icons/hi'
import { useAppSelector } from '@/store'
import { ReturnOrderState } from '@/store/types/returnDetails.types'
import { Avatar } from '@/components/ui'

const ReturnRunnerDetails = () => {
    const returnOrder = useAppSelector<ReturnOrderState>((state) => state.returnOrders)
    const returnProducts = returnOrder?.returnOrders?.return_order_delivery

    const return_Delivery = returnProducts?.map((item) => item.awb_code)
    console.log('OKOK', return_Delivery)

    return (
        <Card className="card">
            <h5 className="mb-4">Runner Details</h5>
            <div className="group flex flex-col gap-2">
                <div className="flex items-center">
                    <div className="ltr:ml-2 rtl:mr-2">
                        <span className="text-xl font-bold flex gap-1">{returnProducts?.at(-1)?.partner}</span>
                    </div>
                </div>
                <div className="time">
                    <span className="font-bold">AWB: {returnProducts?.at(-1)?.awb_code}</span>
                </div>
            </div>
        </Card>
    )
}

export default ReturnRunnerDetails
