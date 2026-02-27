import { useMemo, useEffect, lazy, Suspense } from 'react'
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

const AuthLayout = lazy(() => import('./AuthLayout'))

const Layout = () => {
    const dispatch = useAppDispatch()

    const layoutType = useAppSelector((state) => state.theme.layout.type)
    const company = useAppSelector((state) => state.company.currCompany)

    const { authenticated } = useAuth()

    useDirection()
    useLocale()

    /* ---------------------------------- */
    /* Fetch static master data on mount  */
    /* ---------------------------------- */
    useEffect(() => {
        if (authenticated) {
            dispatch(getUserProfileAPI())
        }
    }, [authenticated, dispatch])

    useEffect(() => {
        dispatch(getAllDivisionAPI())
        dispatch(getAllCategoryAPI())
        dispatch(getAllSubCategoryAPI())
        dispatch(getAllProductTypeAPI())
    }, [dispatch])

    /* ---------------------------------- */
    /* Fetch profile on every reload      */
    /* ---------------------------------- */

    /* ---------------------------------- */
    /* Layout selection (pure memo)       */
    /* ---------------------------------- */
    const AppLayout = useMemo(() => {
        if (authenticated) {
            return layouts[layoutType]
        }
        return AuthLayout
    }, [layoutType, authenticated])

    return (
        <Suspense
            fallback={
                <div className="flex flex-auto flex-col h-[100vh]">
                    <Loading loading={true} />
                </div>
            }
        >
            {authenticated ? <AppLayout /> : <AuthLayout />}
        </Suspense>
    )
}

export default Layout
