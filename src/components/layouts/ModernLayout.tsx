import Header from '@/components/template/Header'
import SidePanel from '@/components/template/SidePanel'
import UserDropdown from '@/components/template/UserDropdown'
import SideNavToggle from '@/components/template/SideNavToggle'
import MobileNav from '@/components/template/MobileNav'
import SideNav from '@/components/template/SideNav'
import View from '@/views'
import Infor from '../template/VerticalMenuContent/Infor'
import store, { useAppSelector } from '@/store'
import { USER_PROFILE_DATA } from '@/store/types/company.types'
import { useMemo } from 'react'

const HeaderActionsStart = () => {
    const storeCodes = store.getState().storeSelect.store_ids
    const storeList = useAppSelector<USER_PROFILE_DATA['store']>((state) => state.company.store)

    const storeName = useMemo(() => {
        return storeList
            ?.filter((item) => storeCodes.includes(item?.id))
            ?.map((item) => item?.code)
            ?.join(', ')
    }, [storeCodes, storeList])

    return (
        <>
            <div className="flex items-center gap-4 lg:gap-6">
                <MobileNav />
                <SideNavToggle />
                <div className="hidden md:block">
                    <Infor />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2 md:gap-3">
                    <span className="text-[18px] sm:text-md font-semibold xl:block hidden  text-gray-600 dark:text-gray-300 whitespace-nowrap">
                        Selected Store:
                    </span>
                    <div className="flex items-center gap-2">
                        <span
                            className={`
                            px-2 py-1 
                            text-xs sm:text-sm md:text-base 
                            font-semibold 
                            bg-blue-50 dark:bg-blue-900/20 
                            text-blue-700 dark:text-blue-300 
                            border border-blue-200 dark:border-blue-700 
                            rounded-lg 
                            truncate max-w-[120px] sm:max-w-[150px] md:max-w-[250px] lg:max-w-none
                            hover:bg-blue-100 dark:hover:bg-blue-900/30 
                            transition-colors duration-200
                        `}
                        >
                            {storeName || 'No store selected'}
                        </span>
                        {storeCodes.length > 0 && (
                            <span
                                className="
                                md:hidden
                                flex items-center justify-center
                                h-5 w-5
                                text-xs font-bold
                                bg-blue-600 text-white
                                rounded-full
                            "
                            >
                                {storeCodes.length}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

const HeaderActionsEnd = () => {
    return (
        <div className="flex items-center  sm:gap-4 ">
            <div className="hidden lg:block">{/* <StoreSelect /> */}</div>
            <SidePanel />
            <UserDropdown hoverable={false} />
        </div>
    )
}

const ModernLayout = () => {
    return (
        <div className="app-layout-modern flex flex-auto flex-col">
            <div className="flex flex-auto min-w-0">
                <SideNav />
                <div className="flex flex-col flex-auto min-h-screen min-w-0 relative w-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                    <Header
                        className="border-b border-gray-200 dark:border-gray-700  sm:px-4 lg:px-6"
                        headerEnd={<HeaderActionsEnd />}
                        headerStart={<HeaderActionsStart />}
                    />
                    <View />
                </div>
            </div>
        </div>
    )
}

export default ModernLayout
