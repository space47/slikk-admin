type BannerField = {
    type: string
    defVal: string | number | boolean
    placeHolder: string
    label: string
}

type BannerFields = {
    [key: string]: BannerField
}

export const ADD_BANNER_BASIC_FIELDS: BannerFields = {
    name: {
        label: 'Name',
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Name',
    },
    position: {
        label: 'Position',
        type: 'number',
        defVal: '',
        placeHolder: 'Enter position',
    },
    footer: {
        label: 'Footer',
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Footer',
    },
    coupon_code: {
        label: 'Coupon_Code',
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Coupon',
    },
    max_price: {
        label: 'Max Price',
        type: 'number',
        defVal: 0,
        placeHolder: 'Enter Max Price',
    },
    min_price: {
        label: 'Min Price',
        type: 'number',
        defVal: 0,
        placeHolder: 'Enter Min Price',
    },
    maxoff: {
        label: 'Max off %',
        type: 'number',
        defVal: 0,
        placeHolder: 'Enter Max off %',
    },
    minoff: {
        label: 'Min off %',
        type: 'number',
        defVal: 0,
        placeHolder: 'Enter Min off %',
    },

    redirection_url: {
        label: 'Url',
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Redirection URL',
    },
    web_redirection_url: {
        label: 'Web Redirection Url',
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Redirection URL',
    },
    mobile_redirection_url: {
        label: 'Mobile Redirection Url',
        type: 'text',
        defVal: '',
        placeHolder: 'Enter Redirection URL',
    },
    // from_date: {
    //     label: 'From',
    //     type: 'date',
    //     defVal: '',
    //     placeHolder: 'Enter From Date',
    // },
    // to_date: {
    //     label: 'To',
    //     type: 'date',
    //     defVal: '',
    //     placeHolder: 'Enter To Date',
    // },
    is_clickable: {
        label: '',
        type: 'checkbox',
        defVal: true,
        placeHolder: 'is_clickable',
    },
}
