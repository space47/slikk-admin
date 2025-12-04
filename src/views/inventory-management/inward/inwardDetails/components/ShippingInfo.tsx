import Card from '@/components/ui/Card'

type ShippingInfoProps = {
    origin_address: string
    company: number
}

const ShippingInfo = ({ origin_address }: ShippingInfoProps) => {
    return (
        <Card className="mb-4">
            <h5 className="mb-4 text-[18px]">Sender Detail:</h5>
            <hr className="mb-4" />
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-start flex-col gap-4">
                    <div className=" flex flex-col">
                        <div className="text-[16px] font-bold mb-4 flex gap-6">
                            Address: <span className="font-normal">{origin_address}</span>
                        </div>
                        <hr className="mb-4" />
                        <h4 className="text-[15px]">Sent By</h4> <br />
                        <div className="text-[15px] font-bold mb-4 flex gap-7">
                            Name: <span className="font-normal">#Name</span>
                        </div>
                        <div className="text-[15px] font-bold mb-4 flex gap-7">
                            Mobile: <span className="font-normal">#Mobile</span>
                        </div>
                        <div className="text-[15px] font-bold mb-4 flex gap-7">
                            Email: <span className="font-normal">#Email</span>
                        </div>
                        <hr className="" />
                    </div>
                </div>
            </div>
            <div className="flex justify-center items-center text-[16px]">#Brand Name</div>
        </Card>
    )
}

export default ShippingInfo
