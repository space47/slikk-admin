export const EventSearchOptions = [
    { label: 'Event Name', value: 'event_name' },
    { label: 'Event Type', value: 'event_type' },
    // { label: 'Event ID', value: 'event_id' },
    { label: 'Mobile Number', value: 'mobile_number' },
]
export const EventUserOptionsList = [
    { label: 'Event Code', value: 'event_code' },
    { label: 'Mobile', value: 'mobile' },
    { label: 'Status', value: 'status' },
]

export const EventTypeForm = [
    { label: 'Name', name: 'name', type: 'text' },
    { label: 'Event Type', name: 'event_type', type: 'text' },
    { label: 'Total Slots', name: 'total_slots', type: 'number' },
    { label: 'Code Prefix', name: 'code_prefix', type: 'text' },
    { label: 'Is Active', name: 'is_active', type: 'checkbox' },
    { label: 'Is Public', name: 'is_public', type: 'checkbox' },
    { label: 'Venue Name', name: 'venue', type: 'text' },
    { label: 'Venue Address', name: 'extra_attributes.venue_address', type: 'text' },
    { label: 'Category', name: 'extra_attributes.category', type: 'text' },
    { label: 'Sponsors', name: 'extra_attributes.sponsors', type: 'text' },
    // { label: 'Special Instructions', name: 'extra_attributes.special_instructions', type: 'text' },
    { label: 'Background color', name: 'extra_attributes.bg_color', type: 'text' },
    { label: 'Button Color', name: 'extra_attributes.button_color', type: 'text' },
    { label: 'Button Font Color', name: 'extra_attributes.button_font_color', type: 'text' },
    { label: 'Legal Instruction', name: 'extra_attributes.legal_instruction', type: 'text' },
    { label: 'Carousel Auto Scroll', name: 'extra_attributes.carousel_auto_scroll', type: 'checkbox' },
    { label: 'Time Interval', name: 'extra_attributes.time_interval', type: 'number' },
    { label: 'Min order value for event pass', name: 'extra_attributes.min_order_value_for_event_pass', type: 'number' },
    { label: 'Is Return Allowed', name: 'extra_attributes.is_return_allowed', type: 'checkbox' },
    {
        label: 'Dummy Registration Count',
        name: 'extra_attributes.dummy_registration_count',
        type: 'number',
        tooltip: true,
        title: 'By placing the dummy count you will be able to increase the total count of the registration by the value',
    },
]
