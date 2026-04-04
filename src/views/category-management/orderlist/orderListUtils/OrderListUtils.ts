/* eslint-disable @typescript-eslint/no-explicit-any */
import * as L from 'leaflet'

export const getStatusFilter = (tabSelect: string) => {
    switch (tabSelect) {
        case 'pending':
            return 'PENDING'
        case 'accepted':
            return 'ACCEPTED'
        case 'packed':
            return 'PACKED'
        case 'picking':
            return 'PICKING'
        case 'delivery_created':
            return 'DELIVERY_CREATED'
        case 'reached_at_location':
            return 'REACHED_AT_LOCATION'
        case 'delivery_assigned':
            return 'DELIVERY_ASSIGNED'
        case 'rto_delivered':
            return 'RTO_DELIVERED'
        case 'delivery_cancelled':
            return 'DELIVERY_CANCELLED'
        case 'out_for_delivery':
            return 'OUT_FOR_DELIVERY,SHIPPED'
        case 'delivered':
            return 'COMPLETED'
        case 'cancelled':
            return 'CANCELLED'
        case 'all':
        default:
            return ''
    }
}

export enum OrderColumns {
    AREA = 'area',
    COUPON_CODE = 'coupon_code',
    PAYMENT_STATUS = 'payment.status',
    DELAY_STATUS = 'is_delayed',
    TOTAL_TIME_TAKEN = 'total_time',
    DELAY_TIME = 'delayed_time',
    ETA_DROP_OFF = 'eta_dropoff_time',
    ESTIMATE_DELIVERY = 'eta_duration',
    DEVICE_TYPE = 'device_type',
    CUSTOMER_NAME = 'user.name',
    PICKER_NAME = 'picker.name',
    UPDATE_DATE = 'update_date',
    PRINTER = 'printer',
}

// OrderListUtils.ts

// Cache for box icons to prevent recreation and flickering
const boxIconCache = new Map()

export const createBoxIcon = (
    elapsedTime: string,
    isSelected: boolean,
    logistic_partner: string | null,
    logistic_details: any,
    delivery_type: string | null,
    payment_mode: string | null,
) => {
    // Create a unique cache key based on all props that affect the icon
    const cacheKey = JSON.stringify({
        elapsedTime,
        isSelected,
        logistic_partner,
        runner_name: logistic_details?.runner_name,
        delivery_type,
        payment_mode,
    })

    // Return cached icon if it exists (prevents flickering)
    if (boxIconCache.has(cacheKey)) {
        return boxIconCache.get(cacheKey)
    }

    const hasLogisticPartner = logistic_partner && logistic_partner.trim() !== ''

    const partnerName = hasLogisticPartner ? logistic_partner : ''
    const runnerName = logistic_details?.runner_name || ''

    let bg = '#2563eb' // Default blue
    if (isSelected)
        bg = '#16a34a' // Green when selected
    else if (hasLogisticPartner) bg = '#f59e0b' // Orange for logistic partner

    // Create a unique CSS class name to avoid conflicts
    const uniqueId = Math.random().toString(36).substring(2, 8)

    const contentHtml = `
        <div class="custom-marker-${uniqueId}" style="
            display:flex;
            flex-direction:column;
            align-items:center;
            font-family:system-ui, -apple-system, sans-serif;
            cursor:pointer;
            transition:transform 0.2s ease;
        ">
            <!-- Card -->
            <div style="
                background:${bg};
                color:white;
                border-radius:8px;
                padding:6px 8px;
                min-width:90px;
                max-width:110px;
                width:auto;
                box-shadow:0 3px 8px rgba(0,0,0,0.25);
                line-height:1.3;
                word-break:break-word;
                transition:all 0.2s ease;
            ">
                <!-- Time + Delivery Type -->
                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    font-size:11px;
                    font-weight:700;
                    gap:6px;
                ">
                    <span>${elapsedTime}</span>
                    ${
                        delivery_type
                            ? `<span style="
                                font-size:8px;
                                font-weight:600;
                                opacity:0.9;
                                background:rgba(255,255,255,0.2);
                                padding:2px 4px;
                                border-radius:4px;
                            ">
                                ${delivery_type}
                            </span>`
                            : ''
                    }
                </div>

                ${
                    partnerName
                        ? `
                <div style="
                    font-size:9px;
                    font-weight:500;
                    margin-top:4px;
                    word-break:break-word;
                    border-top:1px solid rgba(255,255,255,0.2);
                    padding-top:3px;
                ">
                    📦 ${partnerName}
                </div>`
                        : ''
                }

                ${
                    runnerName
                        ? `
                <div style="
                    font-size:8px;
                    opacity:0.9;
                    margin-top:3px;
                    word-break:break-word;
                ">
                    🛵${runnerName}
                </div>`
                        : ''
                }

                ${
                    payment_mode
                        ? `
                <div style="
                    font-size:8px;
                    margin-top:3px;
                    opacity:0.9;
                    font-weight:500;
                    background:rgba(0,0,0,0.1);
                    padding:2px 4px;
                    border-radius:4px;
                    display:inline-block;
                ">
                    💳 ${payment_mode}
                </div>`
                        : ''
                }
            </div>

            <!-- Pointer/Triangle -->
            <div style="
                width:0;
                height:0;
                border-left:8px solid transparent;
                border-right:8px solid transparent;
                border-top:8px solid ${bg};
                margin-top:-1px;
            "></div>
        </div>
    `

    const icon = L.divIcon({
        className: `custom-box-icon-${uniqueId}`,
        html: contentHtml,
        iconSize: [100, 80],
        iconAnchor: [50, 80],
        popupAnchor: [0, -80],
    })

    // Cache the icon
    boxIconCache.set(cacheKey, icon)

    // Optional: Clear cache if it gets too large (more than 100 items)
    if (boxIconCache.size > 100) {
        const firstKey = boxIconCache.keys().next().value
        boxIconCache.delete(firstKey)
    }

    return icon
}

// Export function to clear cache if needed (e.g., on logout)
export const clearBoxIconCache = () => {
    boxIconCache.clear()
}
