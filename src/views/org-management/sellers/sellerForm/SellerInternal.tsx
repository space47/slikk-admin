/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormContainer } from '@/components/ui'
import React from 'react'
import CommonSelect from '@/views/appsSettings/pageSettings/CommonSelect'
import { SellerKeys } from '../sellerCommon'
import { useAppSelector } from '@/store'
import { VendorStateType } from '@/store/slices/vendorsSlice/vendors.slice'
import { GetVendorConfigData } from '../sellerUtils/GetVendorConfigData'

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

    const { financeEmail, financeName, financeNumbers } = GetVendorConfigData()

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
            <FormContainer className="mt-8 grid grid-cols-2 gap-2">
                <CommonSelect asterisk label="Finance Name" name={SellerKeys.INT_FINANCE_NAME} options={financeName || []} />
                <CommonSelect asterisk label="Finance Email" name={SellerKeys.INT_FINANCE_EMAIL} options={financeEmail || []} />
                <CommonSelect
                    asterisk
                    label="Finance Contact Number"
                    name={SellerKeys.FINANCE_CONTACT_NUMBER}
                    options={financeNumbers || []}
                />
            </FormContainer>
        </div>
    )
}

export default SellerInternal
