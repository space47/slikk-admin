import Dropdown from '@/components/ui/Dropdown'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import useAuth from '@/utils/hooks/useAuth'
import { useAppDispatch, useAppSelector } from '@/store'
import { HiOutlineUser, HiOutlineCog, HiOutlineLogout } from 'react-icons/hi'
import type { CommonProps } from '@/@types/common'
import { useEffect, useState } from 'react'
import { Modal } from 'antd'

import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { FaMobile, FaPhone, FaPhoneAlt, FaRegUserCircle } from 'react-icons/fa'
import { IoIosMail } from 'react-icons/io'

type DropdownList = {
    label: string
    icon: JSX.Element
}

const dropdownItemList: DropdownList[] = [
    {
        label: 'Profile',

        icon: <HiOutlineUser />,
    },
    // {
    //     label: 'Account Setting',
    //     path: '/app/account/settings/profile',
    //     icon: <HiOutlineCog />
    // },
    // {
    //     label: 'Activity Log',
    //     path: '/app/account/activity-log',
    //     icon: <FiActivity />
    // }
]

const _UserDropdown = ({ className }: CommonProps) => {
    const { mobile, name } = useAppSelector((state) => state.authorization)
    // const [profileData, setProfileData] = useState<>({})

    const selectedCompany = useAppSelector<USER_PROFILE_DATA>(
        (store) => store.company,
    )

    console.log('NAAAAAAME', selectedCompany.first_name)
    const [openModal, setOpenModal] = useState(false)

    const { signOut } = useAuth()

    const handleOpenModal = () => {
        setOpenModal(true)
    }
    const hanldeClose = () => {
        setOpenModal(false)
        console.log('clicked')
    }

    const handleOk = () => {
        setOpenModal(false)
    }

    return (
        <div className="cursor-pointer flex flex-row text-xl items-center">
            <HiOutlineUser />
            <Dropdown
                menuStyle={{ minWidth: 240 }}
                renderTitle={selectedCompany.first_name}
                placement="bottom-end"
            >
                <Dropdown.Item variant="header">
                    <div className="py-2 px-3 flex items-center gap-2">
                        <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100">
                                {mobile}
                            </div>
                            <div className="text-xs">{name}</div>
                        </div>
                    </div>
                </Dropdown.Item>
                <Dropdown.Item variant="divider" />
                {dropdownItemList.map((item) => (
                    <Dropdown.Item
                        key={item.label}
                        eventKey={item.label}
                        className="mb-1 px-0"
                    >
                        <div
                            className="flex h-full w-full px-2"
                            onClick={handleOpenModal}
                        >
                            <span className="flex gap-2 items-center w-full">
                                <span className="text-xl opacity-50">
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </span>
                        </div>
                    </Dropdown.Item>
                ))}
                <Dropdown.Item variant="divider" />
                <Dropdown.Item
                    eventKey="Sign Out"
                    className="gap-2"
                    onClick={signOut}
                >
                    <span className="text-xl opacity-50">
                        <HiOutlineLogout />
                    </span>
                    <span>Sign Out</span>
                </Dropdown.Item>
            </Dropdown>

            {openModal && (
                <Modal
                    open={openModal}
                    footer={null}
                    onCancel={hanldeClose}
                    width={800}
                    className="max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl"
                >
                    <div className="p-8 bg-white rounded-lg">
                        <div className="flex items-center gap-6">
                            <div className="w-[100px] h-[100px]">
                                <img
                                    src="/img/avatars/userAvatar.png"
                                    alt="User Avatar"
                                    className="w-full h-full object-cover rounded-full shadow-md"
                                />
                            </div>
                            <div className="flex flex-col gap-3 text-lg">
                                <span className="font-semibold text-gray-900 text-xl">
                                    {selectedCompany.first_name}{' '}
                                    {selectedCompany.last_name}
                                </span>
                                <span className="text-gray-600 font-medium flex items-center gap-2">
                                    <IoIosMail className="text-gray-500" />{' '}
                                    {selectedCompany.email}
                                </span>
                                <span className="text-gray-600 font-medium flex items-center gap-2">
                                    <FaPhoneAlt className="text-gray-500" />{' '}
                                    {selectedCompany.mobile}
                                </span>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    )
}

const UserDropdown = withHeaderItem(_UserDropdown)

export default UserDropdown
