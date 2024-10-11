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
        label: 'Points Available',
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
