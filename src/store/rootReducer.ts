import { combineReducers, CombinedState, AnyAction, Reducer } from 'redux'
import auth, { AuthState } from './slices/auth'
import base, { BaseState } from './slices/base'
import locale, { LocaleState } from './slices/locale/localeSlice'
import theme, { ThemeState } from './slices/theme/themeSlice'
import RtkQueryService from '@/services/RtkQueryService'
import { AuthState as Authorization } from '@/@types/types'
import { authReducer } from '@/store/reducers/authReducers'
import { companyReducer } from './reducers/company.reducer'
import { divisionReducer } from './reducers/divison.reducer'
import { categoryReducer } from './reducers/category.reducer'
import { subCategoryReducer } from './reducers/subcategory.reducer'
import { productTypeReducer } from './reducers/productType.reducer'
import { brandsReducer } from './reducers/brands.reducer'
import { filtersReducer } from './reducers/filters.reducer'
import returnOrdersReducer from './slices/returnOrderDetails/returnOrderDetails'
import orderListReducer from './slices/orderList/OrderList'
import { ReturnOrderState } from './types/returnDetails.types'
import couponReducer from './slices/couponSlice/couponSlice'

export type RootState = CombinedState<{
    authorization: CombinedState<Authorization>
    auth: CombinedState<AuthState>
    base: CombinedState<BaseState>
    locale: LocaleState
    theme: ThemeState
    returnOrders: ReturnOrderState
    /* eslint-disable @typescript-eslint/no-explicit-any */
    [RtkQueryService.reducerPath]: any
}>

export interface AsyncReducers {
    [key: string]: Reducer<any, AnyAction>
}

const staticReducers = {
    auth,
    base,
    locale,
    theme,
    authorization: authReducer,
    company: companyReducer,
    division: divisionReducer,
    category: categoryReducer,
    subCategory: subCategoryReducer,
    product_type: productTypeReducer,
    brands: brandsReducer,
    filters: filtersReducer,
    returnOrders: returnOrdersReducer,
    order: orderListReducer,
    coupon: couponReducer,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer
}

const rootReducer =
    (asyncReducers?: AsyncReducers) =>
    (state: RootState, action: AnyAction) => {
        const combinedReducer = combineReducers({
            ...staticReducers,
            ...asyncReducers
        })
        return combinedReducer(state, action)
    }

export default rootReducer
