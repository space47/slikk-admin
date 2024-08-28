import appsNavigationConfig from './apps.navigation.config';
import vendorNavigationConfig from './vendor.navigation';
// import uiComponentNavigationConfig from './ui-components.navigation.config'
// import pagesNavigationConfig from './pages.navigation.config'
// import authNavigationConfig from './auth.navigation.config'
// import docNavigationConfig from './doc.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

console.log("cHECK THIS", import.meta.env.VITE_DASHBOARD_TYPE);

const navigationConfig: NavigationTree[] = import.meta.env.VITE_DASHBOARD_TYPE == "brand" ? [
    ...vendorNavigationConfig
] :  [
    ...appsNavigationConfig,
    // ...uiComponentNavigationConfig,
    // ...pagesNavigationConfig,
    // ...authNavigationConfig,
    // ...docNavigationConfig,
]

export default navigationConfig
