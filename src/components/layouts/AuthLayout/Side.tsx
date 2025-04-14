import { cloneElement } from 'react'
import Avatar from '@/components/ui/Avatar'
import Logo from '@/components/template/Logo'
import { APP_NAME } from '@/constants/app.constant'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 min-h-screen  xl:bg-transparent">
            <div
                className="hidden xl:block h-full"
                style={{
                    backgroundImage: `url('/img/others/slikkbg.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            ></div>
            <div className="block xl:hidden w-full h-64">
                <img src="/img/others/slikkbg.jpeg" alt="slikImg" className="w-full h-full object-cover" />
            </div>
            <div className="xl:col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800 px-6 py-10">
                <div className="w-full max-w-md">
                    {children
                        ? cloneElement(children as React.ReactElement, {
                              ...rest,
                          })
                        : null}
                </div>
            </div>
        </div>
    )
}

export default Side
