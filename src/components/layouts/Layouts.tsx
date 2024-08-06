import { useMemo, lazy, Suspense } from 'react'
import Loading from '@/components/shared/Loading'
import { useAppDispatch, useAppSelector } from '@/store'
import {
    LAYOUT_TYPE_CLASSIC,
    LAYOUT_TYPE_MODERN,
    LAYOUT_TYPE_SIMPLE,
    LAYOUT_TYPE_STACKED_SIDE,
    LAYOUT_TYPE_DECKED,
    LAYOUT_TYPE_BLANK,
} from '@/constants/theme.constant'
import useAuth from '@/utils/hooks/useAuth'
import useDirection from '@/utils/hooks/useDirection'
import useLocale from '@/utils/hooks/useLocale'
import { getUserProfileAPI } from '@/store/action/company.action'
import { Button } from '../ui'
import { logoutAction } from '@/store/action/authAction'
import { getAllDivisionAPI } from '@/store/action/division.action'
import { getAllCategoryAPI } from '@/store/action/category.action'
import { getAllSubCategoryAPI } from '@/store/action/subcategory.action'
import { getAllProductTypeAPI } from '@/store/action/productType.action'

const layouts = {
    [LAYOUT_TYPE_CLASSIC]: lazy(() => import('./ClassicLayout')),
    [LAYOUT_TYPE_MODERN]: lazy(() => import('./ModernLayout')),
    [LAYOUT_TYPE_STACKED_SIDE]: lazy(() => import('./StackedSideLayout')),
    [LAYOUT_TYPE_SIMPLE]: lazy(() => import('./SimpleLayout')),
    [LAYOUT_TYPE_DECKED]: lazy(() => import('./DeckedLayout')),
    [LAYOUT_TYPE_BLANK]: lazy(() => import('./BlankLayout')),
}

const Layout = () => {
    const layoutType = useAppSelector((state) => state.theme.layout.type)

    const { authenticated } = useAuth()

    useDirection()

    useLocale()
    const dispatch = useAppDispatch();
    const company = useAppSelector(state => state.company.currCompany);

    const AppLayout = useMemo(() => {

        dispatch(getAllDivisionAPI());
        dispatch(getAllCategoryAPI());
        dispatch(getAllSubCategoryAPI());
        dispatch(getAllProductTypeAPI());

        if (authenticated) {
            console.log("company", company);
            if(!company?.id){
                dispatch(getUserProfileAPI());
            }
            
            return layouts[layoutType]

        }
        return lazy(() => import('./AuthLayout'))
    }, [layoutType, authenticated])

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            {company && <AppLayout />}
        </Suspense>
    )
}

export default Layout
