/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui'
import React from 'react'

interface props {
    userToRedeem: any[]
    handleRedeem: () => Promise<void>
}

const UserRedeemCard = ({ userToRedeem, handleRedeem }: props) => {
    return (
        <div>
            <div className="space-y-4">
                {userToRedeem.map((user, index) => (
                    <div key={index} className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl m-4">
                        <div className="p-8">
                            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
                                <span>{user.user.name || 'Not provided'}</span>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center mb-2">
                                    <span className="text-gray-700 font-medium mr-2">Mobile:</span>
                                    <span>{user.user.mobile || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="text-gray-700 font-medium mr-2">Email:</span>
                                    <span>{user.user.email || 'Not provided'}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="text-gray-700 font-medium mr-2">Event Code:</span>
                                    <span>{user.event_code}</span>
                                </div>
                                <div className="flex items-center mb-2">
                                    <span className="text-gray-700 font-medium mr-2">Status:</span>
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                            user.status === 'JOINED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                        }`}
                                    >
                                        {user.status}
                                    </span>
                                </div>
                                <div className="mt-4 border-t pt-4">
                                    <div className="flex items-center mb-2">
                                        <span className="text-gray-700 font-medium mr-2">Terms Accepted:</span>
                                        <span>{user.terms_and_conditions_accepted ? '✅' : '❌'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-700 font-medium mr-2">Other Conditions:</span>
                                        <span>{user.other_conditions_accepted ? '✅' : '❌'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end mb-2">
                            <Button variant="accept" size="sm" onClick={handleRedeem}>
                                Redeem
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserRedeemCard
