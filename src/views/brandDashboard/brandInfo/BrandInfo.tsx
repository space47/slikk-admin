import React, { useEffect, useState } from 'react'
import { SELLERDETAILTYPES } from './brandinfoCommon'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { useAppSelector } from '@/store'
import { SINGLE_COMPANY_DATA } from '@/store/types/company.types'

const BrandInfo = () => {
    const [sellerDetails, setSellerDetails] = useState<SELLERDETAILTYPES>({})

    const selectedCompany = useAppSelector<SINGLE_COMPANY_DATA>((store) => store.company.currCompany)

    const fetchSellerDetails = async () => {
        try {
            const response = await axioisInstance.get(`/merchant/company?company_id=${selectedCompany.id}`)
            const data = response.data.data
            setSellerDetails(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchSellerDetails()
    }, [])

    const sellerDetailsArray = [
        { label: 'Registered Name', value: sellerDetails.registered_name },
        { label: 'Name', value: sellerDetails.name },
        { label: 'GSTIN', value: sellerDetails.gstin },
        { label: 'Address', value: sellerDetails.address },
        { label: 'Mobile', value: sellerDetails.contact_number },
        {
            label: 'Alternate Mobile',
            value: sellerDetails.alternate_contact_number,
        },
        { label: 'Segment', value: sellerDetails.segment },
    ]

    const chargesArray = [
        {
            label: 'Revenue Share Percent',
            value: `${sellerDetails.revenue_share}%`,
        },
        {
            label: 'Handling Charges Per SKU',
            value: sellerDetails.handling_charges_per_order,
        },
        {
            label: 'Warehouse Charges Per SKU',
            value: sellerDetails.warehouse_charge_per_sku,
        },
        {
            label: 'Damage Charges Per SKU',
            value: sellerDetails.damages_per_sku,
        },
        {
            label: 'Removal Fee Per SKU',
            value: sellerDetails.removal_fee_per_sku,
        },
    ]

    const pocDetailsArray = [
        { label: 'POC Name', value: sellerDetails.poc },
        { label: 'POC Email', value: sellerDetails.poc_email },
    ]

    const bankDetailsArray = [
        { label: 'Account Number', value: sellerDetails.account_number },
        {
            label: 'Account Holder Name',
            value: sellerDetails.account_holder_name,
        },
        { label: 'Bank Name', value: sellerDetails.bank_name },
        { label: 'CIN', value: sellerDetails.cin },
        { label: 'IFSC', value: sellerDetails.ifsc },
    ]

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg space-y-10 text-lg">
            <div>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-3">Seller Details</h2>
                <div className="flex flex-wrap gap-12 font-semibold">
                    <div className="space-y-3 xl:grid xl:grid-cols-2">
                        {sellerDetailsArray.slice(0, 7).map((detail, index) => (
                            <div key={index} className="flex flex-row gap-3 xl:items-center">
                                <strong className="font-medium text-gray-700 w-[100px]">{detail.label}:</strong>
                                <span className="text-gray-600 xl:w-[700px]">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-3">Charges & Margins</h2>
                <div className="flex flex-wrap gap-12 font-semibold">
                    <div className="space-y-3">
                        {chargesArray.map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4">
                                <strong className="font-medium text-gray-700">{detail.label}:</strong>
                                <span className="text-gray-600">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-3">POC Details</h2>
                <div className="grid grid-cols-2 gap-6 font-semibold">
                    <div className="space-y-3">
                        {pocDetailsArray.map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4">
                                <strong className="font-medium text-gray-700">{detail.label}:</strong>
                                <span className="text-gray-600">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div>
                <h2 className="text-xl font-bold mb-4 border-b-2 border-gray-200 pb-3">Bank Details</h2>
                <div className="flex flex-wrap gap-12 font-semibold">
                    <div className="space-y-3">
                        {bankDetailsArray.slice(0, 3).map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4">
                                <strong className="font-medium text-gray-700">{detail.label}:</strong>
                                <span className="text-gray-600">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-3 ">
                        {bankDetailsArray.slice(3).map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4">
                                <strong className="font-medium text-gray-700">{detail.label}:</strong>
                                <span className="text-gray-600">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrandInfo
