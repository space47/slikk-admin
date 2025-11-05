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
        type: 'text',
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
        type: 'text',
    },
]

export const LoyaltyArray = [
    {
        label: 'Points Available',
        start_name: 'max_point_available',
        end_name: 'min_point_available',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'text',
    },
    {
        label: 'Points Earned',
        start_name: 'max_point_earned',
        end_name: 'min_point_earned',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'text',
    },
    {
        label: 'Points Redeemed',
        start_name: 'max_point_redeemed',
        end_name: 'min_point_redeemed',
        start_placeholder: 'max',
        min_placeholder: 'min',
        type: 'text',
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

export const form = (values, csvFile, mobileNumbers = []) => {
    console.log('here', values)

    try {
        const formData = {
            ...(values.name && { name: values.name }),
            ...(values.user ? { user: values.user } : csvFile ? { user: Array.isArray(mobileNumbers) ? mobileNumbers.join(',') : '' } : {}),

            rules: {
                cart: [
                    ...(values.cart_start || values.cart_end || values.allOpenCart
                        ? [
                              {
                                  type: 'cart',
                                  value: {
                                      ...(values.allOpenCart
                                          ? {}
                                          : {
                                                ...(values.cart_start && { start_date: values.cart_start }),
                                                ...(values.cart_end && { end_date: values.cart_end }),
                                            }),
                                  },
                              },
                          ]
                        : []),
                ],
                userInfo: [
                    ...(values.registration_start || values.registration_end
                        ? [
                              {
                                  type: 'registration',
                                  value: {
                                      ...(values.registration_start && { start_date: values.registration_start }),
                                      ...(values.registration_end && { end_date: values.registration_end }),
                                  },
                              },
                          ]
                        : []),
                    ...(values.dob_start || values.dob_end
                        ? [
                              {
                                  type: 'dob',
                                  value: {
                                      ...(values.dob_start && { start_date: values.dob_start }),
                                      ...(values.dob_end && { end_date: values.dob_end }),
                                  },
                              },
                          ]
                        : []),
                    ...(values.gender && Array.isArray(values.gender) && values.gender.length
                        ? [
                              {
                                  type: 'gender',
                                  value: values.gender.join(','),
                              },
                          ]
                        : []),
                ],
                order: [
                    ...(values.start_date || values.end_date
                        ? [
                              {
                                  type: 'order_date',
                                  value: {
                                      ...(values.start_date && { start_date: values.start_date }),
                                      ...(values.end_date && { end_date: values.end_date }),
                                  },
                              },
                          ]
                        : []),
                    ...((values.max_value !== undefined && values.max_value !== null && values.max_value !== '') ||
                    (values.min_value !== undefined && values.min_value !== null && values.min_value !== '')
                        ? [
                              {
                                  type: 'order_value',
                                  value: {
                                      ...(values.max_value !== undefined &&
                                          values.max_value !== null &&
                                          values.max_value !== '' && { max_value: Number(values.max_value) }),
                                      ...(values.min_value !== undefined &&
                                          values.min_value !== null &&
                                          values.min_value !== '' && { min_value: Number(values.min_value) }),
                                  },
                              },
                          ]
                        : []),
                    ...((values.max_purchase !== undefined && values.max_purchase !== null && values.max_purchase !== '') ||
                    (values.min_purchase !== undefined && values.min_purchase !== null && values.min_purchase !== '')
                        ? [
                              {
                                  type: 'life_time_purchase',
                                  value: {
                                      ...(values.max_purchase !== undefined &&
                                          values.max_purchase !== null &&
                                          values.max_purchase !== '' && { max_amount: Number(values.max_purchase) }),
                                      ...(values.min_purchase !== undefined &&
                                          values.min_purchase !== null &&
                                          values.min_purchase !== '' && { min_amount: Number(values.min_purchase) }),
                                  },
                              },
                          ]
                        : []),
                    ...((values.max_count !== undefined && values.max_count !== null && values.max_count !== '') ||
                    (values.min_count !== undefined && values.min_count !== null && values.min_count !== '')
                        ? [
                              {
                                  type: 'order_count',
                                  value: {
                                      ...(values.max_count !== undefined &&
                                          values.max_count !== null &&
                                          values.max_count !== '' && { max_order_count: Number(values.max_count) }),
                                      ...(values.min_count !== undefined &&
                                          values.min_count !== null &&
                                          values.min_count !== '' && { min_order_count: Number(values.min_count) }),
                                  },
                              },
                          ]
                        : []),
                    ...(values.order_delivery_type && Array.isArray(values.order_delivery_type) && values.order_delivery_type.length
                        ? [
                              {
                                  type: 'order_delivery_type',
                                  value: values.order_delivery_type.join(','),
                              },
                          ]
                        : []),
                ],
                loyalty: [
                    ...(values.loyalty && Array.isArray(values.loyalty) && values.loyalty.length
                        ? [
                              {
                                  type: 'tier',
                                  value: values.loyalty.join(','),
                              },
                          ]
                        : []),
                    ...((values.max_point_available !== undefined &&
                        values.max_point_available !== null &&
                        values.max_point_available !== '') ||
                    (values.min_point_available !== undefined && values.min_point_available !== null && values.min_point_available !== '')
                        ? [
                              {
                                  type: 'points available',
                                  value: {
                                      ...(values.max_point_available !== undefined &&
                                          values.max_point_available !== null &&
                                          values.max_point_available !== '' && { max: Number(values.max_point_available) }),
                                      ...(values.min_point_available !== undefined &&
                                          values.min_point_available !== null &&
                                          values.min_point_available !== '' && { min: Number(values.min_point_available) }),
                                  },
                              },
                          ]
                        : []),
                    ...((values.max_point_earned !== undefined && values.max_point_earned !== null && values.max_point_earned !== '') ||
                    (values.min_point_earned !== undefined && values.min_point_earned !== null && values.min_point_earned !== '')
                        ? [
                              {
                                  type: 'points earned',
                                  value: {
                                      ...(values.max_point_earned !== undefined &&
                                          values.max_point_earned !== null &&
                                          values.max_point_earned !== '' && { max: Number(values.max_point_earned) }),
                                      ...(values.min_point_earned !== undefined &&
                                          values.min_point_earned !== null &&
                                          values.min_point_earned !== '' && { min: Number(values.min_point_earned) }),
                                  },
                              },
                          ]
                        : []),
                    ...((values.max_point_redeemed !== undefined &&
                        values.max_point_redeemed !== null &&
                        values.max_point_redeemed !== '') ||
                    (values.min_point_redeemed !== undefined && values.min_point_redeemed !== null && values.min_point_redeemed !== '')
                        ? [
                              {
                                  type: 'points redeemed',
                                  value: {
                                      ...(values.max_point_redeemed !== undefined &&
                                          values.max_point_redeemed !== null &&
                                          values.max_point_redeemed !== '' && { max: Number(values.max_point_redeemed) }),
                                      ...(values.min_point_redeemed !== undefined &&
                                          values.min_point_redeemed !== null &&
                                          values.min_point_redeemed !== '' && { min: Number(values.min_point_redeemed) }),
                                  },
                              },
                          ]
                        : []),
                ],
                order_item: [
                    ...((values.max_basket_size !== undefined && values.max_basket_size !== null && values.max_basket_size !== '') ||
                    (values.min_basket_size !== undefined && values.min_basket_size !== null && values.min_basket_size !== '')
                        ? [
                              {
                                  type: 'basket_size',
                                  value: {
                                      ...(values.max_basket_size !== undefined &&
                                          values.max_basket_size !== null &&
                                          values.max_basket_size !== '' && { max: Number(values.max_basket_size) }),
                                      ...(values.min_basket_size !== undefined &&
                                          values.min_basket_size !== null &&
                                          values.min_basket_size !== '' && { min: Number(values.min_basket_size) }),
                                  },
                              },
                          ]
                        : []),
                    ...(values.tag_filters
                        ? [
                              {
                                  type: 'tag_filters',
                                  value: values.tag_filters,
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

        console.log('there', formData)
        return formData
    } catch (error) {
        console.error('Error in form function:', error)
    }
}
