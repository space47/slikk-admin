import {
    HiOutlineChartSquareBar,
    HiOutlineUserGroup,
    HiOutlineTrendingUp,
    HiOutlineUserCircle,
    HiOutlineBookOpen,
    HiOutlineCurrencyDollar,
    HiOutlineShieldCheck,
    HiOutlineColorSwatch,
    HiOutlineChatAlt,
    HiOutlineDesktopComputer,
    HiOutlinePaperAirplane,
    HiOutlineChartPie,
    HiOutlineUserAdd,
    HiOutlineKey,
    HiOutlineBan,
    HiOutlineHand,
    HiOutlineDocumentText,
    HiOutlineTemplate,
    HiOutlineLockClosed,
    HiOutlineDocumentDuplicate,
    HiOutlineViewGridAdd,
    HiOutlineShare,
    HiOutlineVariable,
    HiOutlineCode,
    HiOutlineUsers,
} from 'react-icons/hi'
import { BiCategory, BiSolidOffer } from 'react-icons/bi'
import { LiaUserTagSolid } from 'react-icons/lia'
import { MdOutlineInventory, MdDisplaySettings, MdBusinessCenter, MdMessage } from 'react-icons/md'
import { CgOrganisation } from 'react-icons/cg'
import { BsCameraReels } from 'react-icons/bs'
import { TbTruckDelivery } from 'react-icons/tb'
import { RiBillLine } from 'react-icons/ri'
import { PiKeyReturn, PiKeyReturnLight } from 'react-icons/pi'
import { HiOutlineBanknotes } from 'react-icons/hi2'
import { IoAnalyticsSharp, IoHomeOutline } from 'react-icons/io5'
import { FcDataConfiguration } from 'react-icons/fc'

export type NavigationIcons = Record<string, JSX.Element>

const navigationIcon: NavigationIcons = {
    apps: <HiOutlineViewGridAdd />,
    project: <HiOutlineChartSquareBar />,
    crm: <HiOutlineUserGroup />,
    sales: <HiOutlineTrendingUp />,
    org: <CgOrganisation />,
    reels: <BsCameraReels />,
    offers: <BiSolidOffer />,
    config: <FcDataConfiguration />,
    users: <HiOutlineUsers />,
    bill: <RiBillLine />,
    note: <HiOutlineBanknotes />,
    return: <PiKeyReturn />,
    home: <IoHomeOutline />,
    business: <MdBusinessCenter />,
    delivery: <TbTruckDelivery />,
    appsettings: <MdDisplaySettings />,
    category: <BiCategory />,
    analytics: <IoAnalyticsSharp />,
    communication: <MdMessage />,
    inventory: <MdOutlineInventory />,
    brand: <LiaUserTagSolid />,
    crypto: <HiOutlineCurrencyDollar />,
    knowledgeBase: <HiOutlineBookOpen />,
    account: <HiOutlineUserCircle />,
    uiComponents: <HiOutlineTemplate />,
    common: <HiOutlineColorSwatch />,
    feedback: <HiOutlineChatAlt />,
    dataDisplay: <HiOutlineDesktopComputer />,
    forms: <HiOutlineDocumentText />,
    navigation: <HiOutlinePaperAirplane />,
    graph: <HiOutlineChartPie />,
    authentication: <HiOutlineLockClosed />,
    signIn: <HiOutlineShieldCheck />,
    signUp: <HiOutlineUserAdd />,
    forgotPassword: <HiOutlineLockClosed />,
    resetPassword: <HiOutlineKey />,
    pages: <HiOutlineDocumentDuplicate />,
    welcome: <HiOutlineHand />,
    accessDenied: <HiOutlineBan />,
    guide: <HiOutlineBookOpen />,
    documentation: <HiOutlineDocumentText />,
    sharedComponentDoc: <HiOutlineShare />,
    utilsDoc: <HiOutlineVariable />,
    changeLog: <HiOutlineCode />,
}

export default navigationIcon
