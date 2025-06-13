import { cloneElement } from 'react'
import Avatar from '@/components/ui/Avatar'
import type { CommonProps } from '@/@types/common'

interface SideProps extends CommonProps {
    content?: React.ReactNode
}

const Side = ({ children, content, ...rest }: SideProps) => {
    return (
        <div className="grid lg:grid-cols-3 h-full ">
            <div
                style={{
                    backgroundImage: `url('/img/others/slikkbg.jpeg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    objectFit: 'cover',
                }}
                className="hidden xl:flex bg-no-repeat bg-cover py-6 px-16 flex-col justify-between"
            ></div>
            <div className="col-span-2 flex flex-col justify-center items-center bg-white dark:bg-gray-800">
                <div className="xl:min-w-[450px] px-8">
                    <div className="flex justify-center items-center mb-6 xl:hidden">
                        <Avatar size={80} shape="circle" src="/img/logo/logo-light-streamline.png" />
                    </div>
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
