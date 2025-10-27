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
import { groupReducer } from './reducers/group.reducer'
import { filtersReducer } from './reducers/filters.reducer'
import returnOrdersReducer from './slices/returnOrderDetails/returnOrderDetails'
import orderListReducer from './slices/orderList/OrderList'
import { ReturnOrderState } from './types/returnDetails.types'
import couponReducer from './slices/couponSlice/couponSlice'
import returnOverallDetailsReducer from './slices/returnOverallDetails/returnOverallDetails'
import userAnalyticsReducer from './slices/userAnalytics/userAnalytics.slice'
import remitanceReducer from './slices/remitanceSlice/Remitance.slice'
import notificationReducer from './slices/notificationSlice/notificationSlice'
import urlShortnerReducer from './slices/urlShortner/urlShortner.slice'
import monthlyReportReducer from './slices/monthlyReport/monthlyReport.slice'
import taskDataReducer from './slices/taskData/taskData.slice'
import { remitanceApi } from './query/remitance.query'
import userSummaryReducer from './slices/orderUserSummary/UserSummary.slice'
import queryNameReducer from './slices/queryName/queryName.slice'
import loyaltyReducer from './slices/slikkLoyalty/loyalty.slice'
import companyStoreReducer from './slices/companyStoreSlice/companyStore.slice'
import departmentReducer from './slices/departmentSlice/Department.slice'
import riderDataReducer from './slices/riderSlice/rider.slice'
import newOrderReducer from './slices/neworderLists/newOrderList.slice'
import riderDetailReducer from './slices/riderDetails/riderDetails.slice'
import eventNamesReducer from './slices/eventNameSlice/eventName.slice'
import eventSeriesReducer from './slices/eventSeriesSlice/eventSeriesSlice'
import couponSeriesReducer from './slices/couponSeriesSlice/couponSeries'
import datePickerReducer from './slices/datepickersSice/datePicker.slice'
import returnOrderDataReducer from './slices/returnOrder/returnOrder.slice'
import shipmentDetailsReducer from './slices/shipemntsSlice/shipments.slice'
import riderAttendanceReportReducer from './slices/riderSlice/riderAttendanceReport.slice'
import pickerReducer from './slices/pickerSlice/picker.slice'
import pageSettingsReducer from './slices/pageSettingsSlice/pageSettingsSlice'
import pageNamesReducer from './slices/pageSettingsSlice/pageNames.slice'
import productReducer from './slices/productData/productData.slice'
import pageSettingsMainReducer from './slices/mainPageSettings/mainPageSettingsSlice'
import qualityCheckReducer from './slices/qualityCheckSlice/qualityCheckList.slice'
import productLockReducer from './slices/productData/productLock.slice'
import offersReducer from './slices/offerSlice/offerSlice'
import indentReducer from './slices/indentSlice/indentSlice'
import OfferQueryService from '@/services/OfferQueryService'
import storeSelectReducer from './slices/storeSelect/storeSelect.slice'
import rtvSlice from './slices/rtv/rtv.slice'

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
    group: groupReducer,
    filters: filtersReducer,
    returnOrders: returnOrdersReducer,
    order: orderListReducer,
    coupon: couponReducer,
    retrunOverallOrders: returnOverallDetailsReducer,
    userAnalytics: userAnalyticsReducer,
    remitance: remitanceReducer,
    notification: notificationReducer,
    urlShortner: urlShortnerReducer,
    monthlyReport: monthlyReportReducer,
    taskData: taskDataReducer,
    userSummary: userSummaryReducer,
    queryName: queryNameReducer,
    companyStore: companyStoreReducer,
    loyalty: loyaltyReducer,
    departmentsData: departmentReducer,
    riderData: riderDataReducer,
    newOrderList: newOrderReducer,
    riderDetails: riderDetailReducer,
    eventNames: eventNamesReducer,
    couponSeries: couponSeriesReducer,
    returnOrderData: returnOrderDataReducer,
    eventSeries: eventSeriesReducer,
    datePicker: datePickerReducer,
    picker: pickerReducer,
    shipmentDetails: shipmentDetailsReducer,
    riderAttendanceReport: riderAttendanceReportReducer,
    pageSettings: pageSettingsReducer,
    pageNames: pageNamesReducer,
    product: productReducer,
    pageSettingsMain: pageSettingsMainReducer,
    qualityCheck: qualityCheckReducer,
    productLock: productLockReducer,
    offers: offersReducer,
    indent: indentReducer,
    storeSelect: storeSelectReducer,
    [rtvSlice.name]: rtvSlice.reducer,
    [remitanceApi.reducerPath]: remitanceApi.reducer,
    [RtkQueryService.reducerPath]: RtkQueryService.reducer,
    [OfferQueryService.reducerPath]: OfferQueryService.reducer,
}

const rootReducer = (asyncReducers?: AsyncReducers) => (state: RootState, action: AnyAction) => {
    const combinedReducer = combineReducers({
        ...staticReducers,
        ...asyncReducers,
    })
    return combinedReducer(state, action)
}

export default rootReducer
