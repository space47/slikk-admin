import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    //slikk nav category
    {
        key: 'appsCategory.productNew',
        path: `${APP_PREFIX_PATH}/category/division-new`,
        component: lazy(
            () => import('@/views/category-management/division/DivisionNew'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Division',
        },
    },
    {
        key: 'appsCategory.division',
        path: `${APP_PREFIX_PATH}/category/division`,
        component: lazy(
            () => import('@/views/category-management/division/DivisionList'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Division',
        },
    },

    // ..........Order Management............................................................................................................
    {
        key: 'appsOrderManagement.orderList',
        path: `${APP_PREFIX_PATH}/orders`,
        component: lazy(
            () => import('@/views/category-management/orderlist/Orderlist'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.orderDetails',
        path: `${APP_PREFIX_PATH}/orders/:invoice_id`,
        component: lazy(() => import('@/views/sales/OrderDetails')),
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
        component: lazy(
            () => import('@/views/org-management/sellers/addSeller/AddSeller'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.stores',
        path: `${APP_PREFIX_PATH}/stores`,
        component: lazy(() => import('@/views/org-management/stores/Stores')), //p2
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrgManagement.users',
        path: `${APP_PREFIX_PATH}/users`,
        component: lazy(() => import('@/views/org-management/users/Users')), //p3
        authority: [ADMIN, USER],
    },

    // .......................................................................................................................
    {
        key: 'appsCategory.uploadCatalog',
        path: `${APP_PREFIX_PATH}/catalog/upload`,
        component: lazy(
            () => import('@/views/category-management/catalog/BulkUpload'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.products',
        path: `${APP_PREFIX_PATH}/catalog/products`,
        component: lazy(
            () => import('@/views/category-management/catalog/Products'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwards',
        path: `${APP_PREFIX_PATH}/goods/received`,
        component: lazy(
            () => import('@/views/inventory-management/inward/inward'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwards',
        path: `${APP_PREFIX_PATH}/goods/received/form`,
        component: lazy(
            () => import('@/views/inventory-management/inward/inwardNew'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inwardsDetails',
        path: `${APP_PREFIX_PATH}/goods/received/:company/:document_number`,
        component: lazy(
            () => import('@/views/inventory-management/inward/inwardDetails'),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.quality_check',
        path: `${APP_PREFIX_PATH}/goods/qualitycheck`,
        component: lazy(
            () =>
                import(
                    '@/views/inventory-management/quality-check/QCbulkupload'
                ),
        ),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.stock_overview',
        path: `${APP_PREFIX_PATH}/stockOverview`,
        component: lazy(
            () =>
                import(
                    '@/views/inventory-management/stock-overview/StockOverview'
                ),
        ),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsCategory.categoryNew',
        path: `${APP_PREFIX_PATH}/category/category-new`,
        component: lazy(
            () => import('@/views/category-management/category/CategoryNew'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Category',
        },
    },
    {
        key: 'appsCategory.category',
        path: `${APP_PREFIX_PATH}/category/category`,
        component: lazy(
            () => import('@/views/category-management/category/CategoryList'),
        ),
        authority: [ADMIN, USER],
        meta: {
            header: 'Add New Category',
        },
    },
    //slikk nav category

    {
        key: 'appsProject.dashboard',
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
            extraHeader: lazy(
                () =>
                    import(
                        '@/views/knowledge-base/ManageArticles/components/PanelHeader'
                    ),
            ),
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
]

export default appsRoute
