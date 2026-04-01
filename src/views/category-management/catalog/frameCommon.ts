export const FrameFields = [
    {
        title: 'Safe Zone Ratios',
        grid: 'grid-cols-4',
        fields: [
            { label: 'Left %', name: 'safe_zone_left', type: 'number', min: 0, max: 100 },
            { label: 'Right %', name: 'safe_zone_right', type: 'number', min: 0, max: 100 },
            { label: 'Top %', name: 'safe_zone_top', type: 'number', min: 0, max: 100 },
            { label: 'Bottom %', name: 'safe_zone_bottom', type: 'number', min: 0, max: 100 },
        ],
    },
    {
        title: 'Selling Price Typography',
        grid: 'grid-cols-5',
        fields: [
            { label: 'X %', name: 'sp_x', type: 'number', min: 0, max: 100 },
            { label: 'Y %', name: 'sp_y', type: 'number', min: 0, max: 100 },
            { label: 'Size', name: 'sp_font_size', type: 'number', min: 1 },
            { label: 'Color', name: 'sp_color', type: 'color' },
            { label: 'Thick', name: 'sp_thickness', type: 'number', min: 0 },
        ],
    },
    {
        title: 'MRP Typography',
        grid: 'grid-cols-5',
        fields: [
            { label: 'X %', name: 'mrp_x', type: 'number', min: 0, max: 100 },
            { label: 'Y %', name: 'mrp_y', type: 'number', min: 0, max: 100 },
            { label: 'Size', name: 'mrp_font_size', type: 'number', min: 1 },
            { label: 'Color', name: 'mrp_color', type: 'color' },
            { label: 'Thick', name: 'mrp_thickness', type: 'number', min: 0 },
        ],
    },
    {
        title: 'MRP Strike-Through',
        grid: 'grid-cols-3',
        fields: [
            {
                label: 'Orientation',
                name: 'slash_orientation',
                type: 'select',
                options: [
                    { label: 'diagonal', value: 'diagonal' },
                    { label: 'horizontal', value: 'horizontal' },
                ],
            },
            { label: 'Color', name: 'slash_color', type: 'color' },
            { label: 'Thickness', name: 'slash_thickness', type: 'number', min: 0 },
            { label: 'Length Scale', name: 'slash_length_scale', type: 'number', min: 0.1 },
            { label: 'X offset %', name: 'slash_x', type: 'number' },
            { label: 'Y offset %', name: 'slash_y', type: 'number' },
        ],
    },
    {
        title: 'Live Preview Text Injection',
        grid: 'grid-cols-3',
        wrapperClass: 'bg-gray-100 p-4 rounded-xl border border-gray-200',
        fields: [
            { label: 'Show Tags', name: 'is_price_tag_required', type: 'checkbox' },
            { label: 'Selling Price', name: 'selling_price', type: 'text' },
            { label: 'MRP', name: 'mrp_price', type: 'text' },
        ],
    },
]
