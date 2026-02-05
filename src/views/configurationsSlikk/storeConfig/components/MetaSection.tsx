import React from 'react'

interface Props {
    icon: React.ReactNode
    label: string
    value: string
}

const MetaSection = ({ icon, label, value }: Props) => (
    <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
            {icon}
            <span>{label}</span>
        </div>
        <span className="font-medium">{value}</span>
    </div>
)

export default MetaSection
