export const AgencyDomain = [
    { label: 'HyperLocal', value: 'hyperlocal' },
    { label: 'Same Day', value: 'same-day' },
    { label: 'Pan India', value: 'pan-india' },
    { label: 'International', value: 'international' },
]

export const AgencyFields = [
    {
        title: 'Agency Details',
        grid: 'grid-cols-2',
        fields: [
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Registered Name', name: 'registered_name', type: 'text' },
            { label: 'Agency Domain', name: 'agency_domains', type: 'select', options: AgencyDomain, isMulti: true },
            { label: 'Is Active', name: 'is_active', type: 'checkbox' },
        ],
    },
    {
        title: 'POC Contact',
        grid: 'grid-cols-2',
        fields: [
            { label: 'POC Name', name: 'poc_name', type: 'text' },
            { label: 'POC Mobile', name: 'poc_mobile', type: 'text' },
            { label: 'POC Email', name: 'poc_email', type: 'text' },
        ],
    },
    {
        title: 'Address',
        grid: 'grid-cols-2',
        fields: [
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'GSTIN', name: 'gstin', type: 'text' },
            { label: 'CIN', name: 'cin', type: 'text' },
        ],
    },
]
