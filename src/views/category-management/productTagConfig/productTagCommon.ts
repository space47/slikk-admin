export const ProductTagFromFields = [
    { name: 'tag_name', label: 'Tag Name', type: 'text', section: 'basic' },
    { name: 'file_header_name', label: 'File Header Name', type: 'text', section: 'basic' },
    { name: 'product_field_name', label: 'Product Field Name', type: 'text', section: 'basic' },

    // Filter fields
    { name: 'filter_name', label: 'Filter Name', type: 'text', section: 'filter' },
    { name: 'display_name', label: 'Display Name', type: 'text', section: 'filter' },
    { name: 'filter_position', label: 'Filter Position', type: 'number', section: 'filter' },

    // Flags
    { name: 'is_update_field', label: 'Is Update Field', type: 'checkbox', section: 'flags' },
    { name: 'is_tag', label: 'Is Tag', type: 'checkbox', section: 'flags' },
    { name: 'is_filter', label: 'Is Filter', type: 'checkbox', section: 'flags' },
]
