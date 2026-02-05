import React from 'react'

interface Props {
    label: string
    value: string | number
    icon: React.ReactNode
    color: string
}

const StoreStatCard = ({ label, value, icon, color }: Props) => (
    <div className="bg-white rounded-xl p-4 shadow flex items-center justify-between">
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`text-3xl text-${color}-500 opacity-80`}>{icon}</div>
    </div>
)

export default StoreStatCard
