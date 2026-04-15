import React from 'react'
import { IconType } from 'react-icons/lib'

interface Props {
    icon?: IconType
    label: string
    desc: string
    iconClassName?: string
}

const CommonPageHeader: React.FC<Props> = ({ icon: Icon, label, desc, iconClassName }) => {
    return (
        <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
                {Icon && (
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg text-white text-xl">
                        <Icon className={iconClassName} />
                    </div>
                )}

                <div>
                    <h2 className="font-bold text-gray-900 dark:text-white">{label}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 text-md">{desc}</p>
                </div>
            </div>
        </div>
    )
}

export default CommonPageHeader
