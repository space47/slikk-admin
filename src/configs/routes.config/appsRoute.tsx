import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'apps.homePage',
        path: `${APP_PREFIX_PATH}/homePage`,
        component: lazy(() => import('@/views/homePage/homes/Home')),
        authority: [ADMIN, USER],
    },
    {
        key: 'apps.homePage',
        path: `${APP_PREFIX_PATH}/homePage/fullMap`,
        component: lazy(() => import('@/views/homePage/fullMapComponent/FullMap')),
        authority: [ADMIN, USER],
    },
    {
        key: 'apps.homePage',
        path: `${APP_PREFIX_PATH}/customerAnalytics/:mobile`,
        component: lazy(() => import('@/views/homePage/homes/CustomerAnalytics')),
        authority: [ADMIN, USER],
    },
    //slikk nav category
    {
        key: 'appsCategory.productNew',
        path: `${APP_PREFIX_PATH}/category/division-new`,
        component: lazy(() => import('@/views/category-management/division/DivisionNew')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.division',
        path: `${APP_PREFIX_PATH}/category/division`,
        component: lazy(() => import('@/views/category-management/division/divisiontable/DivisionTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.division',
        path: `${APP_PREFIX_PATH}/category/division/:id`,
        component: lazy(() => import('@/views/category-management/division/divisiontable/DivisionEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.division',
        path: `${APP_PREFIX_PATH}/category/division/addNew`,
        component: lazy(() => import('@/views/category-management/division/divisiontable/DivisionNew')),
        authority: [ADMIN, USER],
    },

    // Category.................................................
    {
        key: 'appsCategory.category',
        path: `${APP_PREFIX_PATH}/category/category`,
        component: lazy(() => import('@/views/category-management/category/categoryTable/CategoryTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.category',
        path: `${APP_PREFIX_PATH}/category/category/:id`,
        component: lazy(() => import('@/views/category-management/category/categoryTable/CategoryEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.category',
        path: `${APP_PREFIX_PATH}/category/category/add`,
        component: lazy(() => import('@/views/category-management/category/categoryTable/CategoryAdd')),
        authority: [ADMIN, USER],
    },

    // ...................................................................................................

    {
        key: 'appsCategory.subCategory',
        path: `${APP_PREFIX_PATH}/category/subCategory/:id`,
        component: lazy(() => import('@/views/category-management/subCategory/subEdit/SubEdit')),
        authority: [ADMIN, USER],
    },

    // ..........Order Management............................................................................................................
    {
        key: 'appsOrderManagement.orderList',
        path: `${APP_PREFIX_PATH}/orders`,
        component: lazy(() => import('@/views/category-management/orderlist/Orderlist')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.orderList',
        path: `${APP_PREFIX_PATH}/orders/completed`,
        component: lazy(() => import('@/views/category-management/orderlist/statusWisedetails/StatusOrderList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.orderDetails',
        path: `${APP_PREFIX_PATH}/orders/:invoice_id`,
        component: lazy(() => import('@/views/sales/OrderDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.returnOrderList',
        path: `${APP_PREFIX_PATH}/returnOrders`,
        component: lazy(() => import('@/views/sales/returnOrders/ReturnOrders')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.returnOrderList',
        path: `${APP_PREFIX_PATH}/returnOrders/:return_order_id`,
        component: lazy(() => import('@/views/sales/returnOrders/returnOrderDetails/ReturnOrderDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.deliveryOrders',
        path: `${APP_PREFIX_PATH}/deliveryOrders`,
        component: lazy(() => import('@/views/sales/DeliveryOrders/DeliveryOrders')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.reverseDelivery',
        path: `${APP_PREFIX_PATH}/reverseDelivery`,
        component: lazy(() => import('@/views/sales/reverseDelivery/ReverseDelivery')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.skuOrderHistory',
        path: `${APP_PREFIX_PATH}/skuOrderHistory`,
        component: lazy(() => import('@/views/sales/skuOrderHistory/SkuOrderHistory')),
        authority: [ADMIN, USER],
    },

    // SELLERS................................................................................................................

    {
        key: 'appsOrgManagement.sellers',
        path: `${APP_PREFIX_PATH}/sellers`,
        component: lazy(
            () => import('@/views/org-management/sellers/Seller'), //p1
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.sellers',
        path: `${APP_PREFIX_PATH}/sellers/addnew`,
        component: lazy(() => import('@/views/org-management/sellers/addSeller/AddSeller')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.sellers',
        path: `${APP_PREFIX_PATH}/sellers/:id`,
        component: lazy(() => import('@/views/org-management/sellers/editSeller/EditSeller')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.stores',
        path: `${APP_PREFIX_PATH}/stores`,
        component: lazy(() => import('@/views/org-management/stores/Stores')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.stores',
        path: `${APP_PREFIX_PATH}/stores/addNew`,
        component: lazy(() => import('@/views/org-management/stores/addStore/AddStore')), //p2
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.stores',
        path: `${APP_PREFIX_PATH}/stores/:id`,
        component: lazy(() => import('@/views/org-management/stores/editStore/EditStore')), //p2
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.users',
        path: `${APP_PREFIX_PATH}/users`,
        component: lazy(() => import('@/views/org-management/users/Users')), //p3
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.users',
        path: `${APP_PREFIX_PATH}/users/addNew`,
        component: lazy(() => import('@/views/org-management/users/addUsers/AddUser')), //p3
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.users',
        path: `${APP_PREFIX_PATH}/users/edit/:mobile`,
        component: lazy(() => import('@/views/org-management/users/editUsers/EditUser')), //p3
        authority: [ADMIN, USER],
    },

    //   Brand dashBoared.........................................................................................

    {
        key: 'appsVendorManagement.users',
        path: `${APP_PREFIX_PATH}/vendor/users`,
        component: lazy(() => import('@/views/brandDashboard/brandUser/User')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.sales',
        path: `${APP_PREFIX_PATH}/vendor/sales`,
        component: lazy(() => import('@/views/brandDashboard/salesOverview/SalesOverView')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.brandInfo',
        path: `${APP_PREFIX_PATH}/vendor/details`,
        component: lazy(() => import('@/views/brandDashboard/brandInfo/BrandInfo')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.brandAccounting',
        path: `${APP_PREFIX_PATH}/vendor/accounts`,
        component: lazy(() => import('@/views/brandDashboard/brandAccount/brandAccounting')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.users',
        path: `${APP_PREFIX_PATH}/vendor/users/addNew`,
        component: lazy(() => import('@/views/brandDashboard/brandUser/userAdd/UserAdd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.users',
        path: `${APP_PREFIX_PATH}/vendor/users/:mobile`,
        component: lazy(() => import('@/views/brandDashboard/brandUser/branUserEdit/BrandUserEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.productFeedback',
        path: `${APP_PREFIX_PATH}/category/productFeedback`,
        component: lazy(() => import('@/views/category-management/productFeedback/ProductFeedback')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.uploader',
        path: `${APP_PREFIX_PATH}/category/uploader`,
        component: lazy(() => import('@/views/category-management/uploader/Uploader')),
        authority: [ADMIN, USER],
    },

    // ......................................
    {
        key: 'appsVendorManagement.catalog',
        path: `${APP_PREFIX_PATH}/vendor/catalog`,
        component: lazy(() => import('@/views/brandDashboard/brandCatalogOverview/brandcatalog')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsVendorManagement.stockOverview',
        path: `${APP_PREFIX_PATH}/vendor/stock`,
        component: lazy(() => import('@/views/brandDashboard/brandStockOverview/BrandStock')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.returns',
        path: `${APP_PREFIX_PATH}/vendor/returns`,
        component: lazy(() => import('@/views/brandDashboard/brandReturns/BrandReturns')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.orders',
        path: `${APP_PREFIX_PATH}/vendor/orders`, //orders
        component: lazy(() => import('@/views/brandDashboard/brandOrder/BrandOrder')),
        authority: [ADMIN, USER],
    },
    // ......................................
    {
        key: 'appsVendorManagement.catalog',
        path: `${APP_PREFIX_PATH}/vendor/catalog`,
        component: lazy(() => import('@/views/brandDashboard/brandCatalogOverview/brandcatalog')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsVendorManagement.stockOverview',
        path: `${APP_PREFIX_PATH}/vendor/stock`,
        component: lazy(() => import('@/views/brandDashboard/brandStockOverview/BrandStock')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.returns',
        path: `${APP_PREFIX_PATH}/vendor/returns`,
        component: lazy(() => import('@/views/brandDashboard/brandReturns/BrandReturns')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.orders',
        path: `${APP_PREFIX_PATH}/vendor/orders`, //orders
        component: lazy(() => import('@/views/brandDashboard/brandOrder/BrandOrder')),
        authority: [ADMIN, USER],
    },

    // .......................................................................................................................
    {
        key: 'appsCategory.uploadCatalog',
        path: `${APP_PREFIX_PATH}/catalog/upload`,
        component: lazy(() => import('@/views/category-management/catalog/BulkUpload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.products',
        path: `${APP_PREFIX_PATH}/catalog/products`,
        component: lazy(() => import('@/views/category-management/catalog/Products')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.products',
        path: `${APP_PREFIX_PATH}/catalog/products/addNew`,
        component: lazy(() => import('@/views/category-management/catalog/Addnew')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.products',
        path: `${APP_PREFIX_PATH}/catalog/products/:barcode`,
        component: lazy(() => import('@/views/category-management/catalog/EditProduct')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.subCategory',
        path: `${APP_PREFIX_PATH}/category/subCategory`,
        component: lazy(() => import('@/views/category-management/subCategory/Subcategory')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.productType',
        path: `${APP_PREFIX_PATH}/category/productType/:id`,
        component: lazy(() => import('@/views/category-management/productType/ProductEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.productType',
        path: `${APP_PREFIX_PATH}/category/productType/addNew`,
        component: lazy(() => import('@/views/category-management/productType/ProductTypeNew')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.subCategory',
        path: `${APP_PREFIX_PATH}/category/subCategory/addNew`,
        component: lazy(() => import('@/views/category-management/subCategory/subNew/SubNew')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.productType',
        path: `${APP_PREFIX_PATH}/category/productType`,
        component: lazy(() => import('@/views/category-management/productType/ProductType')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.brand',
        path: `${APP_PREFIX_PATH}/category/brand`,
        component: lazy(() => import('@/views/category-management/brand/Brand')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.brand',
        path: `${APP_PREFIX_PATH}/category/brand/:id`,
        component: lazy(() => import('@/views/category-management/brand/BrandEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwards',
        path: `${APP_PREFIX_PATH}/goods/received`,
        component: lazy(() => import('@/views/inventory-management/inward/inward')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwards',
        path: `${APP_PREFIX_PATH}/goods/received/form`,
        component: lazy(() => import('@/views/inventory-management/inward/inwardNew')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwards',
        path: `${APP_PREFIX_PATH}/goods/received/edit/:grn`,
        component: lazy(() => import('@/views/inventory-management/inward/inwardEdit/InwardEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwards',
        path: `${APP_PREFIX_PATH}/goods/received/sync/:id`,
        component: lazy(() => import('@/views/inventory-management/inward/inwardSync/InwardSync')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwardsDetails',
        path: `${APP_PREFIX_PATH}/goods/received/:company/:document_number`,
        component: lazy(() => import('@/views/inventory-management/inward/inwardDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.quality_check',
        path: `${APP_PREFIX_PATH}/goods/qualitycheck`,
        component: lazy(() => import('@/views/inventory-management/quality-check/QCbulkupload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.quality_checkList',
        path: `${APP_PREFIX_PATH}/goods/qualitycheckList`,
        component: lazy(() => import('@/views/inventory-management/qualityCheckList/QCListTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.stock_overview',
        path: `${APP_PREFIX_PATH}/stockOverview`,
        component: lazy(() => import('@/views/inventory-management/stock-overview/StockOverview')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsInventoryManagement.updateInventory',
        path: `${APP_PREFIX_PATH}/updateInventory`,
        component: lazy(() => import('@/views/inventory-management/stock-overview/updateInventory/UpdateInventory')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsCategory.categoryNew',
        path: `${APP_PREFIX_PATH}/category/category-new`,
        component: lazy(() => import('@/views/category-management/category/CategoryNew')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Category',
        },
    },
    {
        key: 'appsCategory.category',
        path: `${APP_PREFIX_PATH}/category/category`,
        component: lazy(() => import('@/views/category-management/category/CategoryList')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Category',
        },
    },

    {
        key: 'appsCategory.category',
        path: `${APP_PREFIX_PATH}/category/Uploader`,
        component: lazy(() => import('@/views/category-management/uploader/Uploader')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Category',
        },
    },

    {
        key: 'appscreatorPost.postApproval',
        path: `${APP_PREFIX_PATH}/postApproval`,
        component: lazy(() => import('@/views/creatorPost/CreatorPost')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appscreatorPost.postApproval',
        path: `${APP_PREFIX_PATH}/postApproval/pending/:id`,
        component: lazy(() => import('@/views/creatorPost/pending/pendingDetails/PendingDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appscreatorPost.postApproval',
        path: `${APP_PREFIX_PATH}/postApproval/approved/:id`,
        component: lazy(() => import('@/views/creatorPost/accepted/acceptedDetails/AcceptedDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appscreatorPost.postApproval',
        path: `${APP_PREFIX_PATH}/postApproval/reject/:id`,
        component: lazy(() => import('@/views/creatorPost/rejected/rejectDetails/RejectDetails')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appscreatorPost.uploadPost',
        path: `${APP_PREFIX_PATH}/uploadPost`,
        component: lazy(() => import('@/views/creatorPost/uploadPost/UploadPost')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appscreatorPost.uploadPost',
        path: `${APP_PREFIX_PATH}/uploadPost/createPost`,
        component: lazy(() => import('@/views/creatorPost/uploadPost/createPost/CreatePost')),
        authority: [ADMIN, USER],
    },

    //slikk nav category

    {
        key: 'sProject.dashboard',
        path: `${APP_PREFIX_PATH}/project/dashboard`,
        component: lazy(() => import('@/views/project/ProjectDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsProject.projectList',
        path: `${APP_PREFIX_PATH}/project/project-list`,
        component: lazy(() => import('@/views/project/ProjectList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsProject.scrumBoard',
        path: `${APP_PREFIX_PATH}/project/scrum-board`,
        component: lazy(() => import('@/views/project/ScrumBoard')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'appsProject.issue',
        path: `${APP_PREFIX_PATH}/project/issue`,
        component: lazy(() => import('@/views/project/Issue')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.dashboard',
        path: `${APP_PREFIX_PATH}/crm/dashboard`,
        component: lazy(() => import('@/views/crm/CrmDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.calendar',
        path: `${APP_PREFIX_PATH}/crm/calendar`,
        component: lazy(() => import('@/views/crm/Calendar')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrm.customers',
        path: `${APP_PREFIX_PATH}/crm/customers`,
        component: lazy(() => import('@/views/crm/Customers')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Customers',
        },
    },
    {
        key: 'appsCrm.customerDetails',
        path: `${APP_PREFIX_PATH}/crm/customer-details`,
        component: lazy(() => import('@/views/crm/CustomerDetail')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Customer Details',
            headerContainer: true,
        },
    },
    {
        key: 'appsCrm.mail',
        path: `${APP_PREFIX_PATH}/crm/mail`,
        component: lazy(() => import('@/views/crm/Mail')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'appsCrm.mail',
        path: `${APP_PREFIX_PATH}/crm/mail/:category`,
        component: lazy(() => import('@/views/crm/Mail')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
            footer: false,
        },
    },
    {
        key: 'appsSales.dashboard',
        path: `${APP_PREFIX_PATH}/sales/dashboard`,
        component: lazy(() => import('@/views/sales/SalesDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsSales.productList',
        path: `${APP_PREFIX_PATH}/sales/product-list`,
        component: lazy(() => import('@/views/sales/ProductList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsSales.productEdit',
        path: `${APP_PREFIX_PATH}/sales/product-edit/:productId`,
        component: lazy(() => import('@/views/sales/ProductEdit')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Edit Product',
        },
    },
    {
        key: 'appsSales.productNew',
        path: `${APP_PREFIX_PATH}/sales/product-new`,
        component: lazy(() => import('@/views/sales/ProductNew')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Product',
        },
    },
    {
        key: 'appsSales.orderList',
        path: `${APP_PREFIX_PATH}/sales/order-list`,
        component: lazy(() => import('@/views/sales/OrderList')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsCrypto.dashboard',
        path: `${APP_PREFIX_PATH}/crypto/dashboard`,
        component: lazy(() => import('@/views/crypto/CryptoDashboard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCrypto.portfolio',
        path: `${APP_PREFIX_PATH}/crypto/portfolio`,
        component: lazy(() => import('@/views/crypto/Portfolio')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Portfolio',
        },
    },
    {
        key: 'appsCrypto.market',
        path: `${APP_PREFIX_PATH}/crypto/market`,
        component: lazy(() => import('@/views/crypto/Market')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Market',
        },
    },
    {
        key: 'appsCrypto.wallets',
        path: `${APP_PREFIX_PATH}/crypto/wallets`,
        component: lazy(() => import('@/views/crypto/Wallets')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Wallets',
        },
    },
    {
        key: 'appsknowledgeBase.helpCenter',
        path: `${APP_PREFIX_PATH}/knowledge-base/help-center`,
        component: lazy(() => import('@/views/knowledge-base/HelpCenter')),
        authority: [ADMIN, USER],
        meta: {
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'appsknowledgeBase.article',
        path: `${APP_PREFIX_PATH}/knowledge-base/article`,
        component: lazy(() => import('@/views/knowledge-base/Article')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsknowledgeBase.manageArticles',
        path: `${APP_PREFIX_PATH}/knowledge-base/manage-articles`,
        component: lazy(() => import('@/views/knowledge-base/ManageArticles')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Manage Articles',
            extraHeader: lazy(() => import('@/views/knowledge-base/ManageArticles/components/PanelHeader')),
            headerContainer: true,
        },
    },
    {
        key: 'appsknowledgeBase.editArticle',
        path: `${APP_PREFIX_PATH}/knowledge-base/edit-article`,
        component: lazy(() => import('@/views/knowledge-base/EditArticle')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.settings',
        path: `${APP_PREFIX_PATH}/account/settings/:tab`,
        component: lazy(() => import('@/views/account/Settings')),
        authority: [ADMIN, USER],
        meta: {
            header: 'Settings',
            headerContainer: true,
        },
    },
    {
        key: 'appsAccount.invoice',
        path: `${APP_PREFIX_PATH}/account/invoice/:id`,
        component: lazy(() => import('@/views/account/Invoice')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.activityLog',
        path: `${APP_PREFIX_PATH}/account/activity-log`,
        component: lazy(() => import('@/views/account/ActivityLog')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAccount.kycForm',
        path: `${APP_PREFIX_PATH}/account/kyc-form`,
        component: lazy(() => import('@/views/account/KycForm')),
        authority: [ADMIN, USER],
    },

    // ...............................APP SETTINGS...................................................

    {
        key: 'appsAppSettings.coupons',
        path: `${APP_PREFIX_PATH}/appSettings/coupons`,
        component: lazy(() => import('@/views/appsSettings/coupons/AppCoupons')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.coupons',
        path: `${APP_PREFIX_PATH}/appSettings/coupons/addNew`,
        component: lazy(() => import('@/views/appsSettings/coupons/Add/AddCoupons')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.coupons',
        path: `${APP_PREFIX_PATH}/appSettings/coupons/:coupon_code`,
        component: lazy(() => import('@/views/appsSettings/coupons/Edit/EditCoupon')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.banners',
        path: `${APP_PREFIX_PATH}/appSettings/banners`,
        component: lazy(() => import('@/views/appsSettings/banners/AppBanners')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.banners',
        path: `${APP_PREFIX_PATH}/appSettings/banners/addNew`,
        component: lazy(() => import('@/views/appsSettings/banners/addBanners/AddBanners')),
        authority: [ADMIN, USER],
        meta: {
            layout: 'simple',
            pageContainerType: 'gutterless',
        },
    },
    {
        key: 'appsAppSettings.banners',
        path: `${APP_PREFIX_PATH}/appSettings/banners/newBanner`,
        component: lazy(() => import('@/views/appsSettings/banners/addBanners/addComponents/NewBanner')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.banners',
        path: `${APP_PREFIX_PATH}/appSettings/banners/:id`,
        component: lazy(() => import('@/views/appsSettings/banners/editBanner/EditBanner')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsAppSettings.pageSettings',
        path: `${APP_PREFIX_PATH}/appSettings/pageSettings`,
        component: lazy(() => import('@/views/appsSettings/pageSettings/PageSettings')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsAppSettings.policies',
        path: `${APP_PREFIX_PATH}/appSettings/policies`,
        component: lazy(() => import('@/views/appsSettings/policies/Policies')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsAppSettings.seoSettings',
        path: `${APP_PREFIX_PATH}/appSettings/seoSettings`,
        component: lazy(() => import('@/views/appsSettings/seoSettings/SeoSettings')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.notification',
        path: `${APP_PREFIX_PATH}/appSettings/addNotification`,
        component: lazy(() => import('@/views/sales/Notification/createNotification/AddNotification')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.notification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/notification`,
        component: lazy(() => import('@/views/sales/Notification/getNotification/NotificationTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.groups',
        path: `${APP_PREFIX_PATH}/appsCommuncication/groups`,
        component: lazy(() => import('@/views/sales/groupNotification/getGroup/GetGroupNotification')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.groups',
        path: `${APP_PREFIX_PATH}/appsCommuncication/addGroups`,
        component: lazy(() => import('@/views/sales/groupNotification/addGroup/AddGroup')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.groups',
        path: `${APP_PREFIX_PATH}/appsCommuncication/editGroups/:groupId`,
        component: lazy(() => import('@/views/sales/groupNotification/editGroup/EditGroup')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsCommuncication.sendNotification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/sendNotification`,
        component: lazy(() => import('@/views/sales/groupNotification/sendNotification/GetNotificationStats')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.sendNotification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/sendNotification/addNew`,
        component: lazy(() => import('@/views/sales/groupNotification/sendNotification/SendNotification')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.urlShortner',
        path: `${APP_PREFIX_PATH}/appsCommuncication/urlShortner`,
        component: lazy(() => import('@/views/sales/urlShortner/GetUrlShortner')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.urlShortner',
        path: `${APP_PREFIX_PATH}/appsCommuncication/urlShortner/:shortCode`,
        component: lazy(() => import('@/views/sales/urlShortner/EditUrlShortner')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsCommuncication.urlShortner',
        path: `${APP_PREFIX_PATH}/appsCommuncication/urlShortner/addNew`,
        component: lazy(() => import('@/views/sales/urlShortner/AddUrlShortner')),
        authority: [ADMIN, USER],
    },

    // Tracking
    {
        key: 'appstryAndBuy.taskTracking',
        path: `${APP_PREFIX_PATH}/tryAndBuy/taskTracking`,
        component: lazy(() => import('@/views/slikkLogistics/taskTracking/TaskTracking')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.taskTracking',
        path: `${APP_PREFIX_PATH}/tryAndBuy/taskTracking/:task_id`,
        component: lazy(() => import('@/views/slikkLogistics/taskTracking/trackingTaskComponents/TaskDetails')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appstryAndBuy.riderTracking',
        path: `${APP_PREFIX_PATH}/tryAndBuy/riderTracking`,
        component: lazy(() => import('@/views/slikkLogistics/riderTracking/RiderTracking')),
        authority: [ADMIN, USER],
        // meta: {
        //     layout: 'simple',
        //     pageContainerType: 'gutterless',
        // },
    },
    {
        key: 'appstryAndBuy.reverseTrip',
        path: `${APP_PREFIX_PATH}/reverseTrip`,
        component: lazy(() => import('@/views/slikkLogistics/reverseTrip/ReverseTrip')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.reverseTrip',
        path: `${APP_PREFIX_PATH}/reverseTrip/:tripId`,
        component: lazy(() => import('@/views/slikkLogistics/reverseTrip/componentsTrip/ReverseTripDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.reverseTrip',
        path: `${APP_PREFIX_PATH}/reverseTrip/update/:tripId`,
        component: lazy(() => import('@/views/slikkLogistics/reverseTrip/createReverseTrip/UpdateTrip')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.reverseTrip',
        path: `${APP_PREFIX_PATH}/CreateReverseTrip`,
        component: lazy(() => import('@/views/slikkLogistics/reverseTrip/createReverseTrip/CreateReverseTrip')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riderTracking',
        path: `${APP_PREFIX_PATH}/tryAndBuy/riderTracking/:task_id`,
        component: lazy(() => import('@/views/slikkLogistics/riderTracking/riderDetails/RiderDetails')),
        authority: [ADMIN, USER],
    },

    // ,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
    {
        key: 'appsAnalytics.orders',
        path: `${APP_PREFIX_PATH}/analytics/orders`,
        component: lazy(() => import('@/views/analytics/overview/AnalyticsOverview')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAnalytics.returns',
        path: `${APP_PREFIX_PATH}/analytics/returns`,
        component: lazy(() => import('@/views/analytics/returns/Returns')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAnalytics.userAnalytics',
        path: `${APP_PREFIX_PATH}/analytics/userAnalytics`,
        component: lazy(() => import('@/views/analytics/userAnalytics/UserAnalytics')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAnalytics.remitance',
        path: `${APP_PREFIX_PATH}/analytics/remitance`,
        component: lazy(() => import('@/views/analytics/remitance/Remitance')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAnalytics.reports',
        path: `${APP_PREFIX_PATH}/analytics/reports`,
        component: lazy(() => import('@/views/analytics/analyticsReports/AnalyticsReports')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAnalytics.monthlyReport',
        path: `${APP_PREFIX_PATH}/analytics/monthlyReport`,
        component: lazy(() => import('@/views/analytics/monthlyReport/MonthlyReport')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsConfiguration.configurations',
        path: `${APP_PREFIX_PATH}/configurations`,
        component: lazy(() => import('@/views/configurationsSlikk/configg/ConfigurationPage')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.configurations',
        path: `${APP_PREFIX_PATH}/configurations/edit/:id`,
        component: lazy(() => import('@/views/configurationsSlikk/configg/componentsConfigg/EditConfigurations')),
        authority: [ADMIN, USER],
    },
]

export default appsRoute
