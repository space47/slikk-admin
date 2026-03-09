/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from '@/store'
import { VendorStateType } from '@/store/slices/vendorsSlice/vendors.slice'

interface Props {
    values: any
}

const SellerInternal = ({ values }: Props) => {
    const { configValues } = useAppSelector<VendorStateType>((state) => state.vendor)

    const internalData =
        values?.segment?.split(',')?.reduce((acc: Record<string, any>, item: string) => {
            acc[item] = configValues?.value?.category_team[item?.toUpperCase()] || []
            return acc
        }, {}) || {}

    return (
        <div>
            <h4>POC Internal Details</h4>
            <p>Provide essential details about vendor entity. All field marked with * are mandatory</p>

            <div className="mt-10 space-y-6">
                {Object.entries(internalData).map(([category, people]: any) => (
                    <div key={category} className="border rounded-xl p-4 bg-gray-50 shadow-sm">
                        <h5 className="text-lg font-semibold text-gray-800 mb-3">{category}</h5>
                        {people?.length > 0 ? (
                            <div className="text-sm text-gray-700 space-y-2">
                                <p>
                                    <span className="font-medium">Names:</span> {people.map((p: any) => p.name).join(', ')}
                                </p>

                                <p>
                                    <span className="font-medium">Numbers:</span> {people.map((p: any) => p.mobile).join(', ')}
                                </p>

                                <p>
                                    <span className="font-medium">Emails:</span> {people.map((p: any) => p.email).join(', ')}
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400">No team members available</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SellerInternal
