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
        <div className="p-8 bg-gradient-to-r from-white to-gray-50 rounded-2xl shadow-xl space-y-10 text-lg">
            {/* Seller Details Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 border-b-4 border-indigo-300 pb-3 text-indigo-700">Seller Details</h2>
                <div className="flex flex-wrap gap-8 font-semibold">
                    <div className="space-y-4 xl:grid xl:grid-cols-2">
                        {sellerDetailsArray.slice(0, 7).map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4 xl:items-center">
                                <strong className="font-bold text-indigo-600 w-[120px]">{detail.label}:</strong>
                                <span className="text-gray-700  p-2 rounded-md xl:w-[700px]">
                                    <span className="bg-indigo-50 ">{detail.value}</span>
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Charges & Margins Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 border-b-4 border-green-300 pb-3 text-green-700">Charges & Margins</h2>
                <div className="flex flex-wrap gap-8 font-semibold">
                    <div className="space-y-4">
                        {chargesArray.map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4 items-center">
                                <strong className="font-bold text-green-600">{detail.label}:</strong>
                                <span className="text-gray-700 bg-green-50 p-2 rounded-md">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* POC Details Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 border-b-4 border-blue-300 pb-3 text-blue-700">POC Details</h2>
                <div className="grid grid-cols-2 gap-6 font-semibold">
                    <div className="space-y-4">
                        {pocDetailsArray.map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4 items-center">
                                <strong className="font-bold text-blue-600">{detail.label}:</strong>
                                <span className="text-gray-700 bg-blue-50 p-2 rounded-md">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bank Details Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4 border-b-4 border-purple-300 pb-3 text-purple-700">Bank Details</h2>
                <div className="flex flex-wrap gap-8 font-semibold">
                    <div className="space-y-4">
                        {bankDetailsArray.slice(0, 3).map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4 items-center">
                                <strong className="font-bold text-purple-600">{detail.label}:</strong>
                                <span className="text-gray-700 bg-purple-50 p-2 rounded-md">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4">
                        {bankDetailsArray.slice(3).map((detail, index) => (
                            <div key={index} className="flex flex-row gap-4 items-center">
                                <strong className="font-bold text-purple-600">{detail.label}:</strong>
                                <span className="text-gray-700 bg-purple-50 p-2 rounded-md">{detail.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BrandInfo
