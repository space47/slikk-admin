import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant'
import type { Routes } from '@/@types/routes'

const appsRoute: Routes = [
    {
        key: 'apps.homePage',
        path: `${APP_PREFIX_PATH}/homePage/`,
        component: lazy(() => import('@/views/homePage/homes/Home')),
        authority: [ADMIN, USER],
    },

    // {
    //     key: '',
    //     path: `/access-denied`,
    //     component: lazy(() => import('@/views/pages/AccessDenied/AccessDenied')),
    //     authority: [ADMIN, USER],
    // },
    // {
    //     key: '',
    //     path: `/internal-error`,
    //     component: lazy(() => import('@/views/pages/InternalServerError/InternalError')),
    //     authority: [ADMIN, USER],
    // },
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
        path: `${APP_PREFIX_PATH}/orders/`,
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
        path: `${APP_PREFIX_PATH}/returnOrders/`,
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
        path: `${APP_PREFIX_PATH}/deliveryOrders/`,
        component: lazy(() => import('@/views/sales/DeliveryOrders/DeliveryOrders')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.exchangeOrders',
        path: `${APP_PREFIX_PATH}/exchangeOrders/`,
        component: lazy(() => import('@/views/sales/ExchangeOrders/ExchangeOrders')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOrderManagement.reverseDelivery',
        path: `${APP_PREFIX_PATH}/reverseDelivery/`,
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
        key: 'appsOrgManagement.sellers',
        path: `${APP_PREFIX_PATH}/sellers/details/:id`,
        component: lazy(() => import('@/views/org-management/sellers/sellerDetail/SellerDetails')),
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
        key: 'appsOrgManagement.accessManagement',
        path: `${APP_PREFIX_PATH}/accessManagement/addNew`,
        component: lazy(() => import('@/views/org-management/accessManagement/createAccessManagement/CreateGroups')), //p3
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
    {
        key: 'appsOrgManagement.accessManagement',
        path: `${APP_PREFIX_PATH}/accessManagement`,
        component: lazy(() => import('@/views/org-management/accessManagement/getAccessManagentt/GetAccessManagement')), //p3
        authority: [ADMIN, USER],
    },

    //   Brand dashBoared.........................................................................................

    {
        key: 'appsVendorManagement.shipments',
        path: `${APP_PREFIX_PATH}/vendor/shipments`,
        component: lazy(() => import('@/views/brandDashboard/brandShipments/brandShipmentsTable/BrandShipmentsTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.shipments',
        path: `${APP_PREFIX_PATH}/vendor/shipments/update/:id`,
        component: lazy(() => import('@/views/brandDashboard/brandShipments/brandShipmentsEdit/BrandShipmentsEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: '',
        path: `${APP_PREFIX_PATH}/vendor/shipments/details/:id`,
        component: lazy(() => import('@/views/brandDashboard/brandShipments/brandShipmentDetails/BrandShipmentDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsVendorManagement.shipments',
        path: `${APP_PREFIX_PATH}/vendor/shipments/add`,
        component: lazy(() => import('@/views/brandDashboard/brandShipments/brandShipmentsAdd/BrandShipmentsAdd')),
        authority: [ADMIN, USER],
    },
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
        key: 'appsCategory.productLock',
        path: `${APP_PREFIX_PATH}/category/productLock`,
        component: lazy(() => import('@/views/category-management/productLock/productLockTable/ProductLockTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.productLock',
        path: `${APP_PREFIX_PATH}/category/productLock/add`,
        component: lazy(() => import('@/views/category-management/productLock/productLockAdd/ProductLockAdd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.productLock',
        path: `${APP_PREFIX_PATH}/category/productLock/Edit/:id`,
        component: lazy(() => import('@/views/category-management/productLock/productLockEdit/ProductLockEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.uploader',
        path: `${APP_PREFIX_PATH}/category/uploader`,
        component: lazy(() => import('@/views/category-management/uploader/Uploader')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.scrapper',
        path: `${APP_PREFIX_PATH}/category/scrapper`,
        component: lazy(() => import('@/views/category-management/scrapper/Scrapper')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCategory.filters',
        path: `${APP_PREFIX_PATH}/category/filters`,
        component: lazy(() => import('@/views/category-management/filterList/FilterTable')),
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
        key: 'appsCategory.products',
        path: `${APP_PREFIX_PATH}/catalog/addCopy/:barcode`,
        component: lazy(() => import('@/views/category-management/catalog/CopyAndAdd')),
        authority: [ADMIN, USER],
    },
    // Tags
    {
        key: 'appsCategory.productTags',
        path: `${APP_PREFIX_PATH}/catalog/productTags`,
        component: lazy(() => import('@/views/category-management/productTagConfig/productTagTable/productTagTable')),
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
        path: `${APP_PREFIX_PATH}/goods/received/`,
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
        key: 'appsInventoryManagement.material',
        path: `${APP_PREFIX_PATH}/material`,
        component: lazy(() => import('@/views/inventory-management/transfers/transferTable/components/TransferMaterial')),
        authority: [ADMIN, USER],
    },
    // GDN
    {
        key: 'appsInventoryManagement.gdn',
        path: `${APP_PREFIX_PATH}/goods/gdn`,
        component: lazy(() => import('@/views/inventory-management/gdn/gdnTable/GdnTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.gdn',
        path: `${APP_PREFIX_PATH}/goods/gdnDetails/:document_number/:id`,
        component: lazy(() => import('@/views/inventory-management/gdn/gdnTable/components/GdnDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.gdn',
        path: `${APP_PREFIX_PATH}/goods/gdn/addNew`,
        component: lazy(() => import('@/views/inventory-management/gdn/createGdn/CreateGdn')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.gdn',
        path: `${APP_PREFIX_PATH}/goods/gdn/:document_number`,
        component: lazy(() => import('@/views/inventory-management/gdn/editGdn/EditGdn')),
        authority: [ADMIN, USER],
    },

    //Transfers
    {
        key: 'appsInventoryManagement.transfer',
        path: `${APP_PREFIX_PATH}/goods/transfer`,
        component: lazy(() => import('@/views/inventory-management/transfers/transferTable/TransferTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.transfer',
        path: `${APP_PREFIX_PATH}/goods/transfer/:document_number`,
        component: lazy(() => import('@/views/inventory-management/transfers/transferTable/components/TransferDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.transfer',
        path: `${APP_PREFIX_PATH}/goods/transfer/addNew`,
        component: lazy(() => import('@/views/inventory-management/transfers/addTransfer/AddTransfers')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.transfer',
        path: `${APP_PREFIX_PATH}/goods/transfer/edit/:document_number`,
        component: lazy(() => import('@/views/inventory-management/transfers/editTransfer/EditTransfers')),
        authority: [ADMIN, USER],
    },

    //

    {
        key: 'appsInventoryManagement.quality_check',
        path: `${APP_PREFIX_PATH}/goods/qualitycheck/`,
        component: lazy(() => import('@/views/inventory-management/quality-check/QCbulkupload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.gdn_quality_check',
        path: `${APP_PREFIX_PATH}/goods/gdn_qualitycheck/`,
        component: lazy(() => import('@/views/inventory-management/gdnQc/GDNQCbulkupload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.transfer_quality_check',
        path: `${APP_PREFIX_PATH}/goods/transfer_qualitycheck/`,
        component: lazy(() => import('@/views/inventory-management/transferQC/TransferQCbulkupload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.indent',
        path: `${APP_PREFIX_PATH}/goods/indent`,
        component: lazy(() => import('@/views/inventory-management/indent/indentOverview/IndentTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.indent',
        path: `${APP_PREFIX_PATH}/goods/indentDetails/:id`,
        component: lazy(() => import('@/views/inventory-management/indent/indentOverview/indentComponents/IndentDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.indentUpload',
        path: `${APP_PREFIX_PATH}/goods/indentUpload/`,
        component: lazy(() => import('@/views/inventory-management/indent/indentUploader/IndentBulkUpload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.rtvUpload',
        path: `${APP_PREFIX_PATH}/goods/rtvUpload`,
        component: lazy(() => import('@/views/inventory-management/RTV/rtvUploader/RtvBulkUpload')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.rtv',
        path: `${APP_PREFIX_PATH}/goods/rtv`,
        component: lazy(() => import('@/views/inventory-management/RTV/rtvOverView/RtvTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.rtvDetails',
        path: `${APP_PREFIX_PATH}/goods/rtvDetails/:rtv_number`,
        component: lazy(() => import('@/views/inventory-management/RTV/rtvOverView/rtvComponents/RtvDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.rtvDetails',
        path: `${APP_PREFIX_PATH}/goods/rtv/add`,
        component: lazy(() => import('@/views/inventory-management/RTV/rtvOverView/addRtv/AddRtv')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.rtvDetails',
        path: `${APP_PREFIX_PATH}/goods/rtv/edit/:id`,
        component: lazy(() => import('@/views/inventory-management/RTV/rtvOverView/editRtv/EditRtv')),
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
        path: `${APP_PREFIX_PATH}/stockOverview/`,
        component: lazy(() => import('@/views/inventory-management/stock-overview/StockOverview')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.inventoryLocation',
        path: `${APP_PREFIX_PATH}/inventoryLocation`,
        component: lazy(() => import('@/views/inventory-management/inventory/inventoryTable/InventoryTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsInventoryManagement.printer',
        path: `${APP_PREFIX_PATH}/printer/`,
        component: lazy(() => import('@/views/inventory-management/inward/printerModuls/PrinterModule')),
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
        key: 'appsAppSettings.offers',
        path: `${APP_PREFIX_PATH}/appSettings/offers`,
        component: lazy(() => import('@/views/offerEngine/offers/offersTable/OffersTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.offers',
        path: `${APP_PREFIX_PATH}/appSettings/offers/add`,
        component: lazy(() => import('@/views/offerEngine/offers/offersAdd/OffersAdd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.offers',
        path: `${APP_PREFIX_PATH}/appSettings/offers/:id`,
        component: lazy(() => import('@/views/offerEngine/offers/offersEdit/OffersEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.coupons',
        path: `${APP_PREFIX_PATH}/appSettings/coupons`,
        component: lazy(() => import('@/views/appsSettings/coupons/AppCoupons')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.couponsSeries',
        path: `${APP_PREFIX_PATH}/appSettings/couponsSeries`,
        component: lazy(() => import('@/views/offerEngine/couponSeries/couponSeriesTable/CouponSeriesTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.coupons',
        path: `${APP_PREFIX_PATH}/appSettings/coupons/addNew`,
        component: lazy(() => import('@/views/appsSettings/coupons/Add/AddCoupons')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.couponsSeries',
        path: `${APP_PREFIX_PATH}/appSettings/couponsSeries/addNew`,
        component: lazy(() => import('@/views/offerEngine/couponSeries/couponSeriesAdd/CouponSeriesAdd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.couponsSeries',
        path: `${APP_PREFIX_PATH}/appSettings/couponsGenerate/generateCoupons`,
        component: lazy(() => import('@/views/offerEngine/couponsGenerate/addCoupons/GenerateCoupons')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.coupons',
        path: `${APP_PREFIX_PATH}/appSettings/coupons/:coupon_code`,
        component: lazy(() => import('@/views/appsSettings/coupons/Edit/EditCoupon')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.couponsSeries',
        path: `${APP_PREFIX_PATH}/appSettings/couponsSeries/:id`,
        component: lazy(() => import('@/views/offerEngine/couponSeries/couponSeriesEdit/CouponSeriesEdit')),
        authority: [ADMIN, USER],
    },
    // Event Series
    {
        key: 'appsAppSettings.eventSeries',
        path: `${APP_PREFIX_PATH}/appSettings/eventSeries`,
        component: lazy(() => import('@/views/offerEngine/eventSeries/eventList/EventList')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.eventSeries',
        path: `${APP_PREFIX_PATH}/appSettings/eventSeries/addEvent`,
        component: lazy(() => import('@/views/offerEngine/eventSeries/addEvents/AddEvents')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.eventSeries',
        path: `${APP_PREFIX_PATH}/appSettings/eventSeries/:id`,
        component: lazy(() => import('@/views/offerEngine/eventSeries/editEvents/EditEvents')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.eventSeries',
        path: `${APP_PREFIX_PATH}/appSettings/eventSeries/details/:id`,
        component: lazy(() => import('@/views/offerEngine/eventSeries/eventList/eventDetails/EventListDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.banners',
        path: `${APP_PREFIX_PATH}/appSettings/banners/`,
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
        path: `${APP_PREFIX_PATH}/appSettings/pageSettings/`,
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
        key: 'appsAppSettings.careers',
        path: `${APP_PREFIX_PATH}/appSettings/careers`,
        component: lazy(() => import('@/views/appsSettings/careers/careerDetails/CareerDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.careers',
        path: `${APP_PREFIX_PATH}/appSettings/careers/edit/:job_id`,
        component: lazy(() => import('@/views/appsSettings/careers/editCareers/EditCareers')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.careers',
        path: `${APP_PREFIX_PATH}/appSettings/careers/applicants/:job_id`,
        component: lazy(() => import('@/views/appsSettings/careers/applicantsDetails/ApplicantDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.careers',
        path: `${APP_PREFIX_PATH}/appSettings/careers/addNew`,
        component: lazy(() => import('@/views/appsSettings/careers/addCareers/AddCareers')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsAppSettings.seoSettings',
        path: `${APP_PREFIX_PATH}/appSettings/seoSettings`,
        component: lazy(() => import('@/views/appsSettings/seoSettings/SeoSettings')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.seoSettings',
        path: `${APP_PREFIX_PATH}/appSettings/seoSettings/addNew`,
        component: lazy(() => import('@/views/appsSettings/seoSettings/createSeoSettings/CreateSeoSettings')),
        authority: [ADMIN, USER],
    },
    // new Page Settings
    {
        key: 'appsAppSettings.pageSubPage',
        path: `${APP_PREFIX_PATH}/appSettings/pageSubPage`,
        component: lazy(() => import('@/views/appsSettings/pageSubPage/PageSubPage')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.pageSubPage',
        path: `${APP_PREFIX_PATH}/appSettings/pageSubPage/editSubPage/:id`,
        component: lazy(() => import('@/views/appsSettings/pageSubPage/EditSubPage')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.newPageSettings',
        path: `${APP_PREFIX_PATH}/appSettings/newPageSettings`,
        component: lazy(() => import('@/views/appsSettings/newPageSettings/newPageSettingsTable/NewPageSettingsTables')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.newPageSettings',
        path: `${APP_PREFIX_PATH}/appSettings/sections/:id`,
        component: lazy(() => import('@/views/appsSettings/newPageSettings/newPageSettingsTable/SectionsTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.newPageSettings',
        path: `${APP_PREFIX_PATH}/appSettings/newPageSettings/addNew`,
        component: lazy(() => import('@/views/appsSettings/newPageSettings/addNewPageSettings/AddPageSettings')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.newPageSettings',
        path: `${APP_PREFIX_PATH}/appSettings/newPageSettings/edit/:section_id`,
        component: lazy(() => import('@/views/appsSettings/newPageSettings/editNewPageSettings/EditPageSettings')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.newPageSettings',
        path: `${APP_PREFIX_PATH}/appSettings/newPageSettings/assignSection`,
        component: lazy(() => import('@/views/appsSettings/newPageSettings/assignPageToSection/AssignPageSection')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAppSettings.newPageSettings',
        path: `${APP_PREFIX_PATH}/appSettings/newPageSettings/assignSection/:section_id`,
        component: lazy(() => import('@/views/appsSettings/newPageSettings/assignPageToSection/EditAssignedPage')),
        authority: [ADMIN, USER],
    },
    //
    {
        key: 'appsCommuncication.notification',
        path: `${APP_PREFIX_PATH}/appSettings/addNotification`,
        component: lazy(() => import('@/views/sales/Notification/createNotification/AddNotification')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsCommuncication.manageTemplates',
        path: `${APP_PREFIX_PATH}/appsCommuncication/templates`,
        component: lazy(() => import('@/views/sales/manageTemplates/ManageTemplates')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.manageTemplates',
        path: `${APP_PREFIX_PATH}/appsCommuncication/templates/addNew`,
        component: lazy(() => import('@/views/sales/manageTemplates/AddTemplates/AddTemplates')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.manageTemplates',
        path: `${APP_PREFIX_PATH}/appsCommuncication/templates/:name`,
        component: lazy(() => import('@/views/sales/manageTemplates/editTemplates/EditTemplates')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.whatsAppMessage',
        path: `${APP_PREFIX_PATH}/appsCommuncication/whatsAppMessage`,
        component: lazy(() => import('@/views/sales/WhatsAppMessage/SendWhatsAppMessage')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.events',
        path: `${APP_PREFIX_PATH}/appsCommuncication/events`,
        component: lazy(() => import('@/views/sales/eventAnalytics/eventTable/EventTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.events',
        path: `${APP_PREFIX_PATH}/appsCommuncication/eventsAdd`,
        component: lazy(() => import('@/views/sales/eventAnalytics/eventAdd/EventAdd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.events',
        path: `${APP_PREFIX_PATH}/appsCommuncication/events/:id`,
        component: lazy(() => import('@/views/sales/eventAnalytics/eventEdit/EventEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.events',
        path: `${APP_PREFIX_PATH}/appsCommuncication/eventsAdd`,
        component: lazy(() => import('@/views/sales/eventAnalytics/eventAdd/EventAdd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.notification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/eventUsers/:id`,
        component: lazy(() => import('@/views/newGroups/notificationUtils/EventUsersTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.cohorts',
        path: `${APP_PREFIX_PATH}/appsCommuncication/cohorts/:id`,
        component: lazy(() => import('@/views/newGroups/editNewGroups/EditNewGroups')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.notification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/events/:id`,
        component: lazy(() => import('@/views/sales/eventAnalytics/eventEdit/EventEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.notification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/notification`,
        component: lazy(() => import('@/views/sales/Notification/getNotification/NotificationTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.notification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/:id`,
        component: lazy(() => import('@/views/sales/Notification/editNotification/EditNotification')),
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
        key: 'appsCommuncication.cohorts',
        path: `${APP_PREFIX_PATH}/appsCommuncication/cohorts`,
        component: lazy(() => import('@/views/newGroups/notificationGroupsTable/NotificationGroupsTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.cohorts',
        path: `${APP_PREFIX_PATH}/appsCommuncication/cohorts/add`,
        component: lazy(() => import('@/views/newGroups/addNewGroups/NewGroupsAdd')),
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
        path: `${APP_PREFIX_PATH}/appsCommuncication/sendNotification/:id`,
        component: lazy(() => import('@/views/sales/groupNotification/sendNotification/SendTemplateNotifications')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.sendNotification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/sendNotification/addNew`,
        component: lazy(() => import('@/views/sales/groupNotification/sendNotification/SendNotification')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.sendNotification',
        path: `${APP_PREFIX_PATH}/appsCommuncication/sendNotification/edit/:id`,
        component: lazy(() => import('@/views/sales/groupNotification/sendNotification/EditNotifications')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.urlShortner',
        path: `${APP_PREFIX_PATH}/appsCommuncication/urlShortner`,
        component: lazy(() => import('@/views/sales/urlShortner/GetUrlShortner')),
        authority: [ADMIN, USER],
    },
    // {
    //     key: 'appsCommuncication.urlShortner',
    //     path: `${APP_PREFIX_PATH}/appsCommuncication/urlShortner/:shortCode`,
    //     component: lazy(() => import('@/views/sales/urlShortner/EditUrlShortner')),
    //     authority: [ADMIN, USER],
    // },

    {
        key: 'appsCommuncication.urlShortner',
        path: `${APP_PREFIX_PATH}/appsCommuncication/urlShortner/addNew`,
        component: lazy(() => import('@/views/sales/urlShortner/AddUrlShortner')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsCommuncication.urlShortner',
        path: `${APP_PREFIX_PATH}/appsCommuncication/urlShortner/:short_code`,
        component: lazy(() => import('@/views/sales/urlShortner/EditUrlShortner')),
        authority: [ADMIN, USER],
    },

    // Tracking
    {
        key: 'appstryAndBuy.riderZone',
        path: `${APP_PREFIX_PATH}/riderZone`,
        component: lazy(() => import('@/views/slikkLogistics/riderZone/riderZoneTable/RiderZoneTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riderZone',
        path: `${APP_PREFIX_PATH}/riderZone/add`,
        component: lazy(() => import('@/views/slikkLogistics/riderZone/riderZoneAdd/RiderZoneAdd')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riderZone',
        path: `${APP_PREFIX_PATH}/riderZone/:id`,
        component: lazy(() => import('@/views/slikkLogistics/riderZone/riderZoneEdit/RiderZoneEdit')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.taskTracking',
        path: `${APP_PREFIX_PATH}/tryAndBuy/taskTracking`,
        component: lazy(() => import('@/views/slikkLogistics/taskTracking/TaskTracking')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.reverseTracking',
        path: `${APP_PREFIX_PATH}/tryAndBuy/reverseTracking`,
        component: lazy(() => import('@/views/slikkLogistics/taskTracking/ReverseTracking')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.tryAndBuy',
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
        key: 'appstryAndBuy.riders',
        path: `${APP_PREFIX_PATH}/riders`,
        component: lazy(() => import('@/views/slikkLogistics/riderDetails/RiderDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riders',
        path: `${APP_PREFIX_PATH}/riders/attendance/:user_type`,
        component: lazy(() => import('@/views/slikkLogistics/riderDetails/RiderComponents/RiderAttendance')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riders',
        path: `${APP_PREFIX_PATH}/riders/userAttendance/:mobile`,
        component: lazy(() => import('@/views/slikkLogistics/riderDetails/RiderComponents/ParticularRiderAttendance')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riders',
        path: `${APP_PREFIX_PATH}/riders/addNew`,
        component: lazy(() => import('@/views/slikkLogistics/riderDetails/AddRiders/AddRider')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riders',
        path: `${APP_PREFIX_PATH}/riders/addBulk`,
        component: lazy(() => import('@/views/slikkLogistics/riderDetails/AddRiders/BulkAddRiders')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riders',
        path: `${APP_PREFIX_PATH}/riders/:mobile`,
        component: lazy(() => import('@/views/slikkLogistics/riderDetails/RiderComponents/RiderDetailModal')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.riderTracking',
        path: `${APP_PREFIX_PATH}/tryAndBuy/riderTracking/:task_id`,
        component: lazy(() => import('@/views/slikkLogistics/riderTracking/riderDetails/RiderDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: '',
        path: `${APP_PREFIX_PATH}/tryAndBuy/fullTripMap/:trip_id`,
        component: lazy(() => import('@/views/slikkLogistics/reverseTrip/componentsTrip/DetailsComponent/FullTripMap')),
        authority: [ADMIN, USER],
    },
    {
        key: '',
        path: `${APP_PREFIX_PATH}/riderProfile/:mobile`,
        component: lazy(() => import('@/views/slikkLogistics/taskTracking/trackingTaskComponents/RiderProfile')),
        authority: [ADMIN, USER],
    },
    // Picker
    {
        key: 'appstryAndBuy.picker',
        path: `${APP_PREFIX_PATH}/pickerBoard`,
        component: lazy(() => import('@/views/slikkLogistics/picker/pickerBoard/PickerBoard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.picker',
        path: `${APP_PREFIX_PATH}/picker/Leaderboard`,
        component: lazy(() => import('@/views/slikkLogistics/picker/pickerBoard/pickerComponents/LeaderBoard')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.picker',
        path: `${APP_PREFIX_PATH}/pickerDetails/:mobile`,
        component: lazy(() => import('@/views/slikkLogistics/picker/pickerDetails/PickerDetails')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appstryAndBuy.cashCollection',
        path: `${APP_PREFIX_PATH}/cashCollection`,
        component: lazy(() => import('@/views/slikkLogistics/cashCollection/cashCollectionTable/CashCollectionTable')),
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
        key: 'appsAnalytics.masterRemitance',
        path: `${APP_PREFIX_PATH}/analytics/masterRemitance`,
        component: lazy(() => import('@/views/analytics/analyticsReports/AnalyticsReports')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAnalytics.reports',
        path: `${APP_PREFIX_PATH}/analytics/reports`,
        component: lazy(() => import('@/views/analytics/reportsAnalytics/ReportAnalytics')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsAnalytics.monthlyReport',
        path: `${APP_PREFIX_PATH}/analytics/monthlyReport`,
        component: lazy(() => import('@/views/analytics/monthlyReport/MonthlyReport')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsConfiguration.storeConfigurations',
        path: `${APP_PREFIX_PATH}/storeConfigurations`,
        component: lazy(() => import('@/views/configurationsSlikk/storeConfig/storeConfigTable/StoreConfigTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.storeConfigurations',
        path: `${APP_PREFIX_PATH}/storeConfigurations/edit/:id`,
        component: lazy(() => import('@/views/configurationsSlikk/storeConfig/storeConfigEdit/StoreEditConfig')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.storeConfigurations',
        path: `${APP_PREFIX_PATH}/storeConfigurations/add`,
        component: lazy(() => import('@/views/configurationsSlikk/storeConfig/storeConfigAdd/StoreConfigAdd')),
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
    {
        key: 'appsConfiguration.reportConfigurations',
        path: `${APP_PREFIX_PATH}/reportConfigurations`,
        component: lazy(() => import('@/views/configurationsSlikk/reportConfigurations/GetReportConfiguratiions')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.reportConfigurations',
        path: `${APP_PREFIX_PATH}/reportConfigurations/:id`,
        component: lazy(() => import('@/views/configurationsSlikk/reportConfigurations/editQueryReport/EditReportQuery')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.reportConfigurations',
        path: `${APP_PREFIX_PATH}/reportConfigurations/addNew`,
        component: lazy(() => import('@/views/configurationsSlikk/reportConfigurations/addQueryReport/AddReportQuery')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.loyality',
        path: `${APP_PREFIX_PATH}/loyality`,
        component: lazy(() => import('@/views/slikkLoyalty/loyaltyTable/LoyaltyTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.loyality',
        path: `${APP_PREFIX_PATH}/loyality/addNew`,
        component: lazy(() => import('@/views/slikkLoyalty/addLoyalty/AddLoyalty')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.loyality',
        path: `${APP_PREFIX_PATH}/loyality/:name`,
        component: lazy(() => import('@/views/slikkLoyalty/editLoyalty/EditLoyalty')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.scrapper',
        path: `${APP_PREFIX_PATH}/scrapper`,
        component: lazy(() => import('@/views/sales/scrapper/ScrapData')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsConfiguration.tasksAndSchedular',
        path: `${APP_PREFIX_PATH}/tasksAndSchedular`,
        component: lazy(() => import('@/views/configurationsSlikk/taskAndSchedular/TaskAndSchedular')),
        authority: [ADMIN, USER],
    },
    //offers

    {
        key: 'appsOffers.offerAndPromotions',
        path: `${APP_PREFIX_PATH}/offerAndPromotions`,
        component: lazy(() => import('@/views/offerEngine/offerEngineTable/OfferEngineTable')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOffers.offerAndPromotions',
        path: `${APP_PREFIX_PATH}/offerAndPromotions/addNew`,
        component: lazy(() => import('@/views/offerEngine/createOfferEngine/AddOfferEngine')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOffers.offerAndPromotions',
        path: `${APP_PREFIX_PATH}/offerAndPromotions/edit/:code`,
        component: lazy(() => import('@/views/offerEngine/editOfferEngine/EditOfferEngine')),
        authority: [ADMIN, USER],
    },

    {
        key: 'appsOffers.markdownPrices',
        path: `${APP_PREFIX_PATH}/markdownPrices`,
        component: lazy(() => import('@/views/markdownPrices/markdownPricesDatas/MarkdownPrices')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOffers.markdownPrices',
        path: `${APP_PREFIX_PATH}/markdownPrices/addNew`,
        component: lazy(() => import('@/views/markdownPrices/addMarkdownPrices/AddmarkdownPrices')),
        authority: [ADMIN, USER],
    },
    {
        key: 'appsOffers.markdownPrices',
        path: `${APP_PREFIX_PATH}/markdownPrices/edit/:name`,
        component: lazy(() => import('@/views/markdownPrices/editMarkdownProces/EditMarkdownProcess')),
        authority: [ADMIN, USER],
    },
]

export default appsRoute
