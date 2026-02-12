import { fieldsToListingPage, ScreenSize } from '@/preview/utils'
import { BANNER_ITEM_FRONTEND, CarouselGridConfig } from '@/preview/utils/DataTypes'
import clsx from 'clsx'
import React from 'react'
import VideoPlayer from '../../SupportingComponents/VideoPlayer'
import LottieView from '@/preview/components/LottieVIew'

export interface GenericCardProps extends BANNER_ITEM_FRONTEND {
    component_config: CarouselGridConfig // Config object for the component
    size: ScreenSize // Screen size (lg, md, etc.)
    isCarousel: boolean // Is the card part of a carousel
    isGridCarousel?: boolean
    isPlaying?: boolean
}

export const GenericCardMobile: React.FC<GenericCardProps> = ({
    isCarousel,
    component_config,
    isGridCarousel = false,
    image_mobile,
    image_web,
    size,
    name,
    footer,
    extra_attributes,
    isPlaying,
    ...props
}) => {
    const {
        name: isName,
        name_position,
        name_align,
        name_footer,
        name_footer_align,
        font_size,
        footer_font_size,
        name_bottomMargin,
        name_topMargin,
        footer_topMargin,
        footer_bottomMargin,
        footer_font_color,
        footer_font_style,
        font_color,
        font_style,
    } = component_config
    // Dynamic width style based on component_config and carousel mode
    const widthStyle: React.CSSProperties = {
        width: isCarousel
            ? '100%'
            : isGridCarousel
              ? `calc(${(component_config.width || 0.4) * 100}vw - ${component_config?.gap || 4}px)`
              : `${(component_config.width || 0.4) * 100}vw`,
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

    const cornerRadiusStyle: React.CSSProperties = component_config?.corner_radius
        ? {
              borderRadius: component_config?.corner_radius,
          }
        : { borderRadius: 0 }

    // Combine styles
    const combinedStyle: React.CSSProperties = {
        padding: '0px', // Fixed padding
        boxSizing: 'border-box', // Include padding within width
        overflow: 'hidden', // Prevent content overflow
        ...borderStyle,
        ...cornerRadiusStyle,
    }
    const nameAlign = name_align === 'center' ? 'justify-center' : name_align === 'right' ? 'justify-end' : 'justify-start'

    const footerAlign = name_footer_align === 'center' ? 'justify-center' : name_footer_align === 'right' ? 'justify-end' : 'justify-start'
    return (
        <div style={widthStyle}>
            {/* Wrap the image with a link generated from the utility function */}
            {isName && name_position && name_position == 'top' && (
                <div
                    className={clsx('flex w-full', nameAlign)}
                    style={{
                        marginTop: name_topMargin,
                        marginBottom: name_bottomMargin,
                    }}
                >
                    <p
                        className="text-white font-bold text-center"
                        style={{
                            fontSize: `${font_size || 10}px`,
                            color: font_color || '#ffffff',
                            fontStyle: font_style === 'italic' ? 'italic' : 'normal',
                            fontWeight: font_style === 'bold' ? '700' : '400',
                            textDecorationLine: font_style === 'underline' ? 'underline' : 'none',
                        }}
                    >
                        {name}
                    </p>
                </div>
            )}
            <a
                href={
                    extra_attributes?.web_redirection_url
                        ? extra_attributes?.web_redirection_url
                        : fieldsToListingPage({ name, size, ...props })
                }
                className="w-full"
            >
                {/* Dynamically choose the image source based on the screen size */}
                {extra_attributes?.video_mobile ? (
                    <div style={combinedStyle}>
                        <VideoPlayer
                            thumbnail={image_mobile || ''}
                            url={extra_attributes?.video_mobile}
                            aspectRatio={extra_attributes?.mobile_aspect_ratio || 0.56}
                            radius={component_config?.corner_radius || 0}
                            isPlayingVideo={isPlaying}
                        />
                    </div>
                ) : extra_attributes?.lottie_mobile ? (
                    <LottieView
                        path={extra_attributes?.lottie_mobile}
                        width={`${(component_config?.width || 0.16) * 100}vw`}
                        height={`${(component_config?.width || 0.16) * 100 * (component_config?.aspect_ratio || 1)}vw`}
                    />
                ) : (
                    <img src={size !== 'lg' ? image_mobile : image_web} className="rounded-md object-cover w-full" style={combinedStyle} />
                )}
            </a>
            {isName && name_position && name_position == 'bottom' && (
                <div
                    className={clsx('flex w-full', nameAlign)}
                    style={{
                        marginTop: name_topMargin,
                        marginBottom: name_bottomMargin,
                    }}
                >
                    <p
                        className="text-white font-bold text-center"
                        style={{
                            fontSize: `${font_size || 10}px`,
                            color: font_color || '#ffffff',
                            fontStyle: font_style === 'italic' ? 'italic' : 'normal',
                            fontWeight: font_style === 'bold' ? '700' : '400',
                            textDecorationLine: font_style === 'underline' ? 'underline' : 'none',
                        }}
                    >
                        {name}
                    </p>
                </div>
            )}
            {name_footer && (
                <div className={clsx('flex w-full', footerAlign)}>
                    <p
                        className="text-[#FF7733] font-medium text-center"
                        style={{
                            marginTop: footer_topMargin,
                            marginBottom: footer_bottomMargin,
                            fontSize: `${footer_font_size || 10}px`,
                            color: footer_font_color || '#FF7733',
                            fontStyle: footer_font_style === 'italic' ? 'italic' : 'normal',
                            fontWeight: footer_font_style === 'bold' ? '700' : '400',
                            textDecorationLine: footer_font_style === 'underline' ? 'underline' : 'none',
                        }}
                    >
                        {footer}
                    </p>
                </div>
            )}
        </div>
    )
}
