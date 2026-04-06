export interface TemplateConfig {
    template_name?: string
    description?: string
    image_1: File[] | []
    image_2: File[] | []
    safe_zone_left: number
    safe_zone_right: number
    safe_zone_top: number
    safe_zone_bottom: number

    sp_x: number
    sp_y: number
    sp_font_size: number
    sp_color: string
    sp_thickness: number

    mrp_x: number
    mrp_y: number
    mrp_font_size: number
    mrp_color: string
    mrp_thickness: number

    slash_orientation: string
    slash_thickness: number
    slash_color: string
    slash_length_scale: number
    slash_x: number
    slash_y: number

    is_price_tag_required: boolean
    selling_price: string
    mrp_price: string
}

const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file)
        const img = new Image()
        img.onload = () => {
            resolve(img)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = url
    })
}

export const generatePreviewCanvas = async (values: TemplateConfig): Promise<string> => {
    if (!values.image_1?.length || !values.image_2?.length) {
        throw new Error('Both Frame and Product images are required for preview (Please upload Image 1 & Image 2).')
    }

    const frameFile = values.image_1[0] // Treat image 1 as frame
    const contentFile = values.image_2[0] // Treat image 2 as product content

    const frameImg = await loadImage(frameFile as File)
    const contentImg = await loadImage(contentFile as File)

    const canvas = document.createElement('canvas')
    const final_width = frameImg.width
    const final_height = frameImg.height
    canvas.width = final_width
    canvas.height = final_height
    const ctx = canvas.getContext('2d')

    if (!ctx) throw new Error('Could not get canvas context')

    // White background fill
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, final_width, final_height)

    // Calculate Safe Zones
    // The inputs are now 0-100 percentages based on user's instruction.
    // We divide by 100 and multiply by dimensions to get absolute pixels.
    const safe_zone_left = final_width * (Number(values.safe_zone_left) / 100)
    const safe_zone_right = final_width * (Number(values.safe_zone_right) / 100)
    const safe_zone_top = final_height * (Number(values.safe_zone_top) / 100)
    const safe_zone_bottom = final_height * (Number(values.safe_zone_bottom) / 100)

    const safe_zone_width = final_width - safe_zone_left - safe_zone_right
    const safe_zone_height = final_height - safe_zone_top - safe_zone_bottom

    const content_aspect_ratio = contentImg.width / contentImg.height
    let new_content_width = 0
    let new_content_height = 0

    if (content_aspect_ratio > safe_zone_width / safe_zone_height) {
        // Fit to width
        new_content_width = safe_zone_width
        new_content_height = new_content_width / content_aspect_ratio
    } else {
        // Fit to height
        new_content_height = safe_zone_height
        new_content_width = new_content_height * content_aspect_ratio
    }

    // Offset to center within safe zone
    const x_offset = safe_zone_left + (safe_zone_width - new_content_width) / 2
    const y_offset = safe_zone_top + (safe_zone_height - new_content_height) / 2

    // 1. Draw Product Image (Content)
    ctx.drawImage(contentImg, x_offset, y_offset, new_content_width, new_content_height)

    // 2. Draw Frame Image (Overlay)
    ctx.drawImage(frameImg, 0, 0, final_width, final_height)

    // 3. Draw Price Tag and text if required
    if (values.is_price_tag_required && (values.selling_price || values.mrp_price)) {
        const selling_price = values.selling_price
        const mrp_price = values.mrp_price

        const price_text = `₹${selling_price}`
        const mrp_text = mrp_price && mrp_price !== selling_price ? `₹${mrp_price}` : ''

        const sp_color = values.sp_color || '#000000'
        const mrp_color = values.mrp_color || '#FED06F'
        const slash_color = values.slash_color || '#FED06F'

        // SP (Selling Price)
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.lineJoin = 'round'

        ctx.font = `${Number(values.sp_font_size)}px Figtree, sans-serif`

        const price_x = final_width * (Number(values.sp_x) / 100)
        const price_y = final_height - (final_height * (Number(values.sp_y) / 100))

        // stroke first (thickness), then fill on top so the fill isn't eaten by the stroke
        const sp_thickness = Number(values.sp_thickness)
        if (sp_thickness > 0) {
            ctx.strokeStyle = sp_color
            ctx.lineWidth = sp_thickness
            ctx.strokeText(price_text, price_x, price_y)
        }
        ctx.fillStyle = sp_color
        ctx.fillText(price_text, price_x, price_y)

        // MRP
        if (mrp_text) {
            ctx.font = `${Number(values.mrp_font_size)}px Figtree, sans-serif`

            const mrp_x = final_width * (Number(values.mrp_x) / 100)
            const mrp_y = final_height - (final_height * (Number(values.mrp_y) / 100))

            const mrp_thickness = Number(values.mrp_thickness)
            if (mrp_thickness > 0) {
                ctx.strokeStyle = mrp_color
                ctx.lineWidth = mrp_thickness
                ctx.strokeText(mrp_text, mrp_x, mrp_y)
            }
            ctx.fillStyle = mrp_color
            ctx.fillText(mrp_text, mrp_x, mrp_y)

            // Strike-through — mirrors Lambda merge_images logic exactly
            const bbox = ctx.measureText(mrp_text)
            const textHalfWidth = bbox.width / 2

            // Ink bounding box of MRP text (canvas textAlign=center, textBaseline=middle)
            const ink_left   = mrp_x - textHalfWidth
            const ink_right  = mrp_x + textHalfWidth
            const halfHeight = Number(values.mrp_font_size) / 2
            const ink_top    = mrp_y - halfHeight
            const ink_bottom = mrp_y + halfHeight

            // slash_x/slash_y are % offsets — convert to pixels (positive = right/down, matches Pillow Y-axis)
            const shift_x = final_width  * (Number(values.slash_x) / 100)
            const shift_y = final_height * (Number(values.slash_y) / 100)

            const padding = 2

            ctx.beginPath()
            if (values.slash_orientation === 'horizontal') {
                // Lambda: start_x = ink_left + shift_x, length = text_width * slash_length_scale
                const line_length = (ink_right - ink_left) * Number(values.slash_length_scale)
                const line_y = (ink_top + ink_bottom) / 2 + shift_y
                ctx.moveTo(ink_left + shift_x,               line_y)
                ctx.lineTo(ink_left + shift_x + line_length, line_y)
            } else {
                // diagonal: top-right → bottom-left (Lambda uses padding=2, slash_length_scale ignored)
                ctx.moveTo(ink_right + padding + shift_x, ink_top    - padding + shift_y)
                ctx.lineTo(ink_left  - padding + shift_x, ink_bottom + padding + shift_y)
            }
            ctx.strokeStyle = slash_color
            ctx.lineWidth = Number(values.slash_thickness)
            ctx.stroke()
        }
    }

    return canvas.toDataURL('image/png')
}
