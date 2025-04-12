export const URL_ADDRESS = "/address";
export const URL_ADDRESS_ADD = "/address/add";
export const URL_ADDRESS_EDIT = "/address/edit";

export const URL_LOOKS = "/looks";
export const URL_LOOKS_HANDLE = "/looks/[handle]";
export const URL_LOOKS_HANDLE_POST = "/looks/[handle]/[post_id]";

export const URL_ORDERS = "/orders";
export const URL_ORDERS_INFO = "/orders/[order_info]";
export const URL_ORDERS_RATE = "/orders/[order_info]/rate";

export const URL_CART = "/cart";

export const URL_COLLECTION = "/collection";

export const URL_HOME = "/";

export const URL_LOGIN = "/login";

export const URL_LOYALTY = "/loyalty";
export const URL_LOYALTY_POINTS = "/loyalty/points";

export const URL_OFFERS = "/offers";

export const URL_OPTIONS = "/options";

export const URL_ORDERCONFIRMATION = "/orderconfirmation";

export const URL_PRODUCTS = "/products";

export const URL_PROFILE = "/profile";

export const URL_SIGNUP = "/signup";
export const URL_ABOUT = "/about";
export const URL_RETURN_EXCHANGE = "/returnExchange";
export const URL_SHIPPING = "/shipping";
export const URL_REFUND = "/refund";
export const URL_PRIVACY = "/privacy";
export const URL_TERMS = "/termsandconditions";

export const URL_TRENDS = "/trends";

export const URL_WISHLIST = "/wishlist";

export const URL_BECOME_CREATOR = "/creator";

export const URL_HELP = "/help";
export const URL_Brands = "/brands";
export const URL_BrandList = "/brandlist";

export const URL_REFERRAL = "/referral";

export type SEO_DETAILS = {
  static: boolean;
  public: boolean;
  name: string;
  title: string;
  description: string;
  image: string;
  keywords: string[];
};

export const ALL_PAGES_FULL_DETAILS = {
  [URL_LOGIN]: {
    static: true,
    public: true,
    name: "Login",
    title: "Login",
    description: "Login",
    image: "",
    keywords: "",
  },
  [URL_SIGNUP]: {
    static: true,
    public: true,
    name: "Signup",
    title: "Signup",
    description: "Signup",
    image: "",
    keywords: "",
  },
  [URL_ADDRESS]: {
    static: true,
    public: false,
    name: "Address",
    title: "My Addresses",
    description: "See your addresses",
    image: "",
    keywords: "",
  },
  [URL_ADDRESS_ADD]: {
    static: true,
    public: false,
    name: "Add Address",
    title: "Add an Address",
    description: "See your addresses",
    image: "",
    keywords: "",
  },
  [URL_ADDRESS_EDIT]: {
    static: true,
    public: false,
    name: "Edit Address",
    title: "Edit Your Addresses",
    description: "See your addresses",
    image: "",
    keywords: "",
  },
  [URL_ORDERS]: {
    static: true,
    public: false,
    name: "Orders",
    title: "My Orders",
    description: "See your Orders",
    image: "",
    keywords: "",
  },
  [URL_ORDERS_INFO]: {
    static: false,
    public: false,
    name: null,
    title: null,
    description: null,
    image: "",
    keywords: "",
  },
  [URL_PRODUCTS]: {
    static: false,
    public: true,
    name: null,
    title: null,
    description: null,
    image: "",
    keywords: "",
  },
  [URL_CART]: {
    static: true,
    public: false,
    name: "My Bag",
    title: "Cart | Slikk",
    description: "Checkout Items in your bag",
    image: "",
    keywords: "",
  },
  [URL_REFERRAL]: {
    static: true,
    public: false,
    name: "Refer Friends and Earn",
    title: "Refer Friends and Earn",
    description: "Refer Friends and Earn",
    image: "",
    keywords: "",
  },
  [URL_OPTIONS]: {
    static: true,
    public: false,
    name: "My Profile",
    title: "My Profile",
    description: "My Profile",
    image: "",
    keywords: "",
  },
  [URL_PROFILE]: {
    static: true,
    public: false,
    name: "My Profile",
    title: "My Profile",
    description: "My Profile",
    image: "",
    keywords: "",
  },
  [URL_LOYALTY]: {
    static: true,
    public: false,
    name: "My Loyalty",
    title: "My Loyalty",
    description: "My Loyalty",
    image: "",
    keywords: "",
  },
  [URL_HELP]: {
    static: true,
    public: true,
    name: "Help & Support",
    title: "Help & Support",
    description: "Get Help with you order",
    image: "",
    keywords: "",
  },
  [URL_ABOUT]: {
    static: true,
    public: true,
    name: "About",
    title: "About",
    description: "",
    image: "",
    keywords: "",
  },
  [URL_SHIPPING]: {
    static: true,
    public: true,
    name: "Shipping Policy",
    title: "Shipping Policy",
    description: "",
    image: "",
    keywords: "",
  },
  [URL_RETURN_EXCHANGE]: {
    static: true,
    public: true,
    name: "Return & Exchanges",
    title: "Return & Exchanges",
    description: "",
    image: "",
    keywords: "",
  },
  [URL_REFUND]: {
    static: true,
    public: true,
    name: "Refund Policy",
    title: "Refund Policy",
    description: "",
    image: "",
    keywords: "",
  },
  [URL_PRIVACY]: {
    static: true,
    public: true,
    name: "Privacy Policy",
    title: "Privacy Policy",
    description: "",
    image: "",
    keywords: "",
  },
  [URL_TERMS]: {
    static: true,
    public: true,
    name: "Terms & Conditions",
    title: "Terms & Conditions",
    description: "",
    image: "",
    keywords: "",
  },
  [URL_HOME]: {
    static: true,
    public: true,
    name: "",
    title: "Slikk | Get your fit delivered in under 60mins",
    description:
      "Slikk is a fashion brand that aims to deliver value within seconds and drip within minutes",
    image: "",
    keywords: "",
  },
  [URL_TRENDS]: {
    static: true,
    public: true,
    name: "Trends",
    title: "Slikk | Buy from the latest GenZ trends",
    description:
      "Slikk is a fashion brand that aims to deliver value within seconds and drip within minutes",
    image: "",
    keywords: "",
  },
};

export const WHATSAPP_URL = "https://wa.me/message/BPIWVZGHTOJMA1";
export const CONTACT_EMAIL = "care@slikk.club";
export const CONTACT_MOBILE = "9351037494";
