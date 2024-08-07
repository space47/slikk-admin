type BannerField = {
    type: string;
    defVal: string | number | boolean;
    placeHolder: string;
};

type BannerFields = {
    [key: string]: BannerField;
};

export const ADD_BANNER_BASIC_FIELDS: BannerFields = {
    "name" : {
        type : "text",
        defVal : "",
        placeHolder : "Enter Name"
    },
    "footer" : {
        type : "text",
        defVal : "",
        placeHolder : "Enter Footer"
    },
    "coupon_code" : {
        type : "text",
        defVal : "",
        placeHolder : "Enter Coupon"
    },
    "max_price" : {
        type : "number",
        defVal : 0,
        placeHolder : "Enter Max Price"
    },
    "min_price" : {
        type : "number",
        defVal : 0,
        placeHolder : "Enter Min Price"
    },
    "redirection_url" : {
        type : "text",
        defVal : "",
        placeHolder : "Enter Redirection URL"
    },
    "from_date" : {
        type : "date",
        defVal : "",
        placeHolder : "Enter From Date"
    },
    "to_date" : {
        type : "date",
        defVal : "",
        placeHolder : "Enter To Date"
    },
    "is_clickable" : {
        type : "checkbox",
        defVal : true,
        placeHolder : "is_clickable"
    }
}