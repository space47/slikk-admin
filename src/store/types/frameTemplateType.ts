export interface FrameTemplate {
    id: number
    name: string
    description: string
    is_active: boolean
    create_date: string
}

export interface FrameSingleTemplate {
    id: number
    name: string
    description: string

    safe_zone_left: string
    safe_zone_right: string
    safe_zone_top: string
    safe_zone_bottom: string

    sp_x: string
    sp_y: string
    sp_font_size: string
    sp_color: [number, number, number] // RGB
    sp_thickness: string

    mrp_x: string
    mrp_y: string
    mrp_font_size: string
    mrp_color: [number, number, number] // RGB
    mrp_thickness: string

    slash_orientation: 'horizontal' | 'vertical' | string
    slash_thickness: string
    slash_color: [number, number, number] // RGB
    slash_length_scale: string
    slash_x: string
    slash_y: string

    created_by: string
    is_active: boolean

    create_date: string // ISO string
    update_date: string // ISO string
}
