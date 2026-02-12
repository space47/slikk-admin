import { CarouselGridConfig, fieldsToListingPage } from '@/preview/utils'
import { SingleBrandCardProps } from '@/preview/utils/types'
import clsx from 'clsx'

export interface BrandCardProps extends SingleBrandCardProps {
    component_config: CarouselGridConfig // Config object for the component
    isCarousel: boolean // Is the card part of a carousel
}
export const GenericBrandCardMobile = ({ component_config, isCarousel, size, data }: BrandCardProps) => {
    const {
        name: isName,
        web_name,
        name_position,
        web_name_position,
        name_align,
        web_name_align,
        name_footer,
        web_name_footer,
        name_footer_align,
        web_name_footer_align,
        name_bottomMargin,
        name_topMargin,
        footer_topMargin,
        footer_bottomMargin,
        font_size,
        footer_font_size,
    } = component_config
    const calcWidth = (component_config?.width || 0.4) * 100

    const widthStyle: React.CSSProperties = {
        width: `${(component_config?.width || 0.4) * 100}vw`, // Use full width in carousel mode
    }
    const borderStyle: React.CSSProperties = component_config?.border
        ? {
              borderWidth: component_config.border_width || 0, // Default to 0 if not provided
              borderStyle: component_config.border_style || 'solid',
              borderColor: component_config.border_color || 'transparent', // Default color
          }
        : {
              border: 'none',
          }

    const cornerRadiusStyle: React.CSSProperties =
        component_config?.corner_radius || component_config?.corner_radius == 0
            ? {
                  borderRadius: component_config?.corner_radius,
              }
            : { borderRadius: `${calcWidth / 20}vw` }

    // Combine styles
    const combinedStyle: React.CSSProperties = {
        padding: '0px', // Fixed padding
        boxSizing: 'border-box', // Include padding within width
        overflow: 'hidden', // Prevent content overflow
        display: 'flex',
        ...borderStyle,
        ...cornerRadiusStyle,
    }
    const nameAlign = name_align === 'center' ? 'justify-center' : name_align === 'right' ? 'justify-end' : 'justify-start'

    const footerAlign = name_footer_align === 'center' ? 'justify-center' : name_footer_align === 'right' ? 'justify-end' : 'justify-start'
    if (!data.image) return
    let url = fieldsToListingPage({
        brand: data.name,
        quick_filter_tags: data.quick_filter_tags,
        size,
        pk: -1,
        tags: [],
        is_clickable: true,
        coupon_code: null,
    })
    if (data?.filter_id) {
        url += '&filter_id=' + data?.filter_id
    }
    return (
        <div style={widthStyle}>
            {isName && name_position && name_position == 'top' && (
                <div
                    className={clsx('flex w-full', nameAlign)}
                    style={{
                        marginTop: name_topMargin,
                        marginBottom: name_bottomMargin,
                    }}
                >
                    <p>{data.name}</p>
                </div>
            )}
            <div style={combinedStyle}>
                <a href={url}>
                    <img src={data.image} />
                </a>
            </div>
            {isName && name_position && name_position == 'bottom' && (
                <div
                    className={clsx('flex w-full', nameAlign)}
                    style={{
                        marginTop: name_topMargin,
                        marginBottom: name_bottomMargin,
                    }}
                >
                    <p className=" text-center" style={{ fontSize: font_size || '12px' }}>
                        {data.name}
                    </p>
                </div>
            )}
            {name_footer && (
                <div
                    className={clsx('flex w-full', footerAlign)}
                    style={{
                        marginTop: footer_topMargin,
                        marginBottom: footer_bottomMargin,
                    }}
                >
                    <p style={{ fontSize: footer_font_size || '12px' }}>{data.footer}</p>
                </div>
            )}
        </div>
    )
}
