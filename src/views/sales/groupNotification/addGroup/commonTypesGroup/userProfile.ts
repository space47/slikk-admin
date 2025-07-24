export const headingGroup = [
    {
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
        type: 'text',
        className: 'w-full',
    },
    {
        label: 'User ',
        name: 'user',
        placeholder: 'Enter User ',
        type: 'text',
        className: 'w-full',
    },
    // {
    //     label: 'Group_Id',
    //     name: 'group_id',
    //     placeholder: 'Enter Group Id',
    //     type: 'text',
    //     className: 'w-full',
    // },
]

export const userProfileGroup = [
    {
        label: 'Registration',
        start_name: 'registration_start',
        end_name: 'registration_end',
        placeholder: 'Enter registration Date',
        type: 'Date',
        className: 'w-full',
    },
    {
        label: 'Date of Birth',
        start_name: 'dob_start',
        end_name: 'dob_end',
        placeholder: 'Enter Date of Birth',
        type: 'Date',
        className: 'w-full',
    },
]

export const orderGroup = [
    {
        label: 'Create Date',
        start_name: 'start_date',
        end_name: 'end_date',
        start_placeholder: 'start',
        min_placeholder: 'end',
        type: 'Date',
    },
    {
        label: 'Order Value',

        start_name: 'max_value',
        end_name: 'min_value',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'number',
    },
    {
        label: 'Life Time Purchase',
        start_name: 'max_purchase',
        end_name: 'min_purchase',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'text',
    },
    {
        label: 'Order Count',
        start_name: 'max_count',
        end_name: 'min_count',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'number',
    },
]

export const LoyaltyArray = [
    {
        label: 'Points Available',
        start_name: 'max_point_available',
        end_name: 'min_point_available',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'number',
    },
    {
        label: 'Points Earned',
        start_name: 'max_point_earned',
        end_name: 'min_point_earned',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'number',
    },
    {
        label: 'Points Redeemed',
        start_name: 'max_point_redeemed',
        end_name: 'min_point_redeemed',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'number',
    },
]

export const groupLocation = [
    {
        label: 'City',
        name: 'city',
        placeholder: 'Enter city',
        type: 'text',
    },
    {
        label: 'State',
        name: 'state',
        placeholder: 'Enter state',
        type: 'text',
    },
    {
        label: 'Distance',
        name: 'distance',
        placeholder: 'Enter distance',
        type: 'text',
    },
]

export const genderOptions = [
    {
        value: 'M',
        label: 'Men',
    },
    {
        value: 'F',
        label: 'Female',
    },
]
export const DeliveryOptions = [
    { label: 'Express', value: 'EXPRESS' },
    { label: 'Standard', value: 'STANDARD' },
    { label: 'Try&Buy', value: 'TRY_AND_BUY' },
]

export const LoyaltyOptions = [
    { label: 'Explorer', value: 'Explorer' },
    { label: 'TRENDSETTER', value: 'Trendsetter' },
    { label: 'ICON', value: 'Icon' },
]

export const form = (values, csvFile, mobileNumbers) => {
    console.log('here')
    const formData = {
        ...(values.name && { name: values.name }),
        ...(values.user ? { user: values.user } : csvFile ? { user: mobileNumbers.join(',') } : ''),

        rules: {
            cart: [
                ...((values.cart_start && values.cart_end) || values.allOpenCart
                    ? [
                          {
                              type: 'cart',
                              value: {
                                  start_date: values.allOpenCart ? '' : values.cart_start,
                                  end_date: values.allOpenCart ? '' : values.cart_end,
                              },
                          },
                      ]
                    : []),
            ],
            userInfo: [
                ...(values.registration_start && values.registration_end
                    ? [
                          {
                              type: 'registration',
                              value: {
                                  start_date: values.registration_start,
                                  end_date: values.registration_end,
                              },
                          },
                      ]
                    : []),
                ...(values.dob_start && values.dob_end
                    ? [
                          {
                              type: 'dob',
                              value: {
                                  start_date: values.dob_start,
                                  end_date: values.dob_end,
                              },
                          },
                      ]
                    : []),
                ...(values.gender && values.gender.length
                    ? [
                          {
                              type: 'gender',
                              value: values.gender.join(','),
                          },
                      ]
                    : []),
            ],
            order: [
                ...(values.start_date
                    ? [
                          {
                              type: 'order_date',
                              value: {
                                  start_date: values.start_date,
                                  end_date: values.end_date || values.start_date,
                              },
                          },
                      ]
                    : []),
                ...(values.max_value && values.min_value
                    ? [
                          {
                              type: 'order_value',
                              value: {
                                  max_amount: values.max_value,
                                  min_amount: values.min_value,
                              },
                          },
                      ]
                    : []),
                ...(values.max_purchase && values.min_purchase
                    ? [
                          {
                              type: 'life_time_purchase',
                              value: {
                                  max_amount: values.max_purchase,
                                  min_amount: values.min_purchase,
                              },
                          },
                      ]
                    : []),
                ...(values.max_count && values.min_count
                    ? [
                          {
                              type: 'order_count',
                              value: {
                                  max_order_count: values.max_count,
                                  min_order_count: values.min_count,
                              },
                          },
                      ]
                    : []),
                ...(values.order_delivery_type && values.order_delivery_type.length
                    ? [
                          {
                              type: 'order_delivery_type',
                              value: values.order_delivery_type.join(','),
                          },
                      ]
                    : []),
            ],
            loyalty: [
                ...(values.loyalty && values.loyalty.length
                    ? [
                          {
                              type: 'tier',
                              value: values.loyalty.join(','),
                          },
                      ]
                    : []),
                ...(values.max_point_available && values.min_point_available
                    ? [
                          {
                              type: 'points available',
                              value: {
                                  max: values.max_point_available,
                                  min: values.min_point_available,
                              },
                          },
                      ]
                    : []),
                ...(values.max_point_earned && values.min_point_earned
                    ? [
                          {
                              type: 'points earned',
                              value: {
                                  max: values.max_point_earned,
                                  min: values.min_point_earned,
                              },
                          },
                      ]
                    : []),
                ...(values.max_point_redeemed && values.min_point_redeemed
                    ? [
                          {
                              type: 'points redeemed',
                              value: {
                                  max: values.max_point_redeemed,
                                  min: values.min_point_redeemed,
                              },
                          },
                      ]
                    : []),
            ],
            order_item: [
                ...(values.max_basket_size && values.min_basket_size
                    ? [
                          {
                              type: 'basket_size',
                              value: {
                                  max: values.max_basket_size,
                                  min: values.min_basket_size,
                              },
                          },
                      ]
                    : []),
                ...(values.filters
                    ? [
                          {
                              type: 'tag_filters',
                              value: values.filters,
                          },
                      ]
                    : []),
            ],
            location: [
                ...(values.city
                    ? [
                          {
                              type: 'city',
                              value: values.city,
                          },
                      ]
                    : []),
                ...(values.state
                    ? [
                          {
                              type: 'state',
                              value: values.state,
                          },
                      ]
                    : []),
                ...(values.distance
                    ? [
                          {
                              type: 'distance',
                              value: values.distance,
                          },
                      ]
                    : []),
            ],
        },
    }
    console.log('there')
    return formData
}
