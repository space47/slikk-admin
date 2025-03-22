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
    }, [selectedCompany])

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
        <div className="p-8 bg-gradient-to-br from-[#fffbf5] to-[#f5faff] rounded-3xl shadow-2xl space-y-12 text-base sm:text-lg tracking-wide">
            {/* Seller Details Section */}
            <div>
                <h2 className="text-3xl font-extrabold mb-4 border-b-4 border-indigo-400 pb-3 text-indigo-700 uppercase">Seller Details</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {sellerDetailsArray.slice(0, 7).map((detail, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-indigo-100 p-3 rounded-xl shadow-sm hover:scale-105 transition"
                        >
                            <strong className="font-bold text-indigo-700">{detail.label}:</strong>
                            <span className="text-gray-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Charges & Margins Section */}
            <div>
                <h2 className="text-3xl font-extrabold mb-4 border-b-4 border-green-400 pb-3 text-green-700 uppercase">
                    Charges & Margins
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {chargesArray.map((detail, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-green-100 p-3 rounded-xl shadow-sm hover:scale-105 transition"
                        >
                            <strong className="font-bold text-green-700">{detail.label}:</strong>
                            <span className="text-gray-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* POC Details Section */}
            <div>
                <h2 className="text-3xl font-extrabold mb-4 border-b-4 border-blue-400 pb-3 text-blue-700 uppercase">POC Details</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {pocDetailsArray.map((detail, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-blue-100 p-3 rounded-xl shadow-sm hover:scale-105 transition"
                        >
                            <strong className="font-bold text-blue-700">{detail.label}:</strong>
                            <span className="text-gray-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bank Details Section */}
            <div>
                <h2 className="text-3xl font-extrabold mb-4 border-b-4 border-purple-400 pb-3 text-purple-700 uppercase">Bank Details</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                    {bankDetailsArray.map((detail, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 bg-purple-100 p-3 rounded-xl shadow-sm hover:scale-105 transition"
                        >
                            <strong className="font-bold text-purple-700">{detail.label}:</strong>
                            <span className="text-gray-800">{detail.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BrandInfo
