import { BrandData, ProductCardData, sectionHeadingURLFn } from '@/preview/utils'
import { BackgroundConfig, BANNER_ITEM_FRONTEND, CATEGORIES, POSITION_ITEM_FRONTEND, REELSDATA } from '@/preview/utils/DataTypes'
import { cva } from 'class-variance-authority'
import clsx from 'clsx'
import CountdownTimer from '../SupportingComponents/CountdownTimer'
import { Footer } from '../SupportingComponents/FooterComp'
import GeneralVideoPlayer from '../SupportingComponents/GeneralVideoPlayer'
import { HeaderWithSubHeader } from '../SupportingComponents/HeaderComp'
import { BrandCardProps, GenericBrandCard } from './Cards/BrandCard'
import { CategoryCard, CategoryCardProps } from './Cards/CategoryCard'
import { GenericProductCard, ProductCardProps } from './Cards/ProductCard'
import { GenericReelsTile, ReelCardProps } from './Cards/ReelTile'
import { GenericCard, GenericCardProps } from './GenericCard'
import { GenericCarousel } from './GenericCarousel'
import { GenericBrandCardMobile } from './GenericMobile/Cards/BrandCard'
import { CategoryCardMobile } from './GenericMobile/Cards/CategoryCard'
import { GenericProductCardMobile } from './GenericMobile/Cards/ProductCard'
import { GenericReelsTileMobile } from './GenericMobile/Cards/ReelTile'
import { GenericCardMobile } from './GenericMobile/GenericCardMobile'
import { GenericCarouselMobile } from './GenericMobile/GenericCarouselMobile'
import { GridCarouselMobile } from './GenericMobile/GridCarouselMobile'
import { GridComponentMobile } from './GenericMobile/GridComponentMobile'
import { GridCarousel } from './GridCarousel'
import GridComponent from './GridComponent'
import LottieView from '@/preview/components/LottieVIew'

export const GenericComponent = ({
    component_config,
    header_config,
    sub_header_config,
    footer_config,
    size,
    data,
    data_type,
    background_image,
    heartOnClick,
    position,
    section_filters,
    is_section_clickable,
    background_config,
    extra_info,
    ...rest
}: POSITION_ITEM_FRONTEND) => {
    // Function to map data to props for GenericCard
    const mapDataToGenericCardProps = (data: BANNER_ITEM_FRONTEND) => ({
        ...data, // Spread the data fields directly
        component_config: component_config || {}, // Pass the component configuration
        isCarousel: true, // If this should behave as a carousel
    })
    const mapDataToCategoryCardProps = (data: CATEGORIES): CategoryCardProps => ({
        ...data, // Spread the data fields directly
        component_config: component_config || {}, // Pass the component configuration
        isCarousel: true, // If this should behave as a carousel
        size: size,
    })
    const mapDataToBrandCardProps = (data: BrandData): BrandCardProps => ({
        data: data, // Spread the data fields directly
        component_config: component_config || {}, // Pass the component configuration
        isCarousel: true, // If this should behave as a carousel
        size: size,
    })
    const mapDataToReelCardProps = (data: REELSDATA): ReelCardProps => ({
        ...data, // Spread the data fields directly
        component_config: component_config || {}, // Pass the component configuration
        isCarousel: true, // If this should behave as a carousel
        size: size,
    })
    const mapDataToProductCardProps = (data: ProductCardData): ProductCardProps => ({
        ...data, // Spread the data fields directly
        component_config: component_config || {}, // Pass the component configuration
        isCarousel: true, // If this should behave as a carousel
        size: size,
        type: 'dark',
        heartOnClick: heartOnClick,
    })
    const background_imageUrl = size == 'lg' ? background_config?.background_image : background_config?.mobile_background_image // example value
    function getComp({ isGrid, isWeb, isCarousel }: { isGrid: boolean; isCarousel: boolean; isWeb: boolean }) {
        if (isWeb) {
            if (isGrid) {
                if (isCarousel) {
                    return (
                        <GridCarousel<BANNER_ITEM_FRONTEND, GenericCardProps>
                            component_config={component_config}
                            size={size}
                            data={data}
                            data_type={data_type}
                            RenderCard={GenericCard}
                            renderCardProps={mapDataToGenericCardProps}
                        />
                    )
                } else {
                    return (
                        <GridComponent<BANNER_ITEM_FRONTEND, GenericCardProps>
                            component_config={component_config}
                            size={size}
                            data={data}
                            data_type={data_type}
                            RenderComponent={GenericCard}
                            renderComponentProps={mapDataToGenericCardProps}
                        />
                    )
                }
                // return <GridComponent component_config={component_config} position={position} size={size} data={data} data_type={data_type} heartOnClick={heartOnClick} {...rest} />
            } else {
                return (
                    <GenericCarousel<BANNER_ITEM_FRONTEND, GenericCardProps>
                        data={data} // Pass the data
                        component_config={component_config} // Configuration for the carousel
                        size={size} // Screen size
                        RenderCard={GenericCard} // The card to render
                        renderCardProps={mapDataToGenericCardProps} // Function to map each data item to props
                    />
                )
                // return <GenericCarousel component_config={component_config} position={position} size={size} data={data} data_type={data_type} heartOnClick={heartOnClick} {...rest} />
            }
        } else {
            if (isGrid) {
                if (isCarousel) {
                    return (
                        <GridCarouselMobile<BANNER_ITEM_FRONTEND, GenericCardProps>
                            component_config={component_config}
                            size={size}
                            data={data}
                            RenderCard={GenericCardMobile}
                            renderCardProps={mapDataToGenericCardProps}
                        />
                    )
                } else {
                    return (
                        <GridComponentMobile<BANNER_ITEM_FRONTEND, GenericCardProps>
                            component_config={component_config}
                            size={size}
                            data={data}
                            RenderComponent={GenericCardMobile}
                            renderComponentProps={mapDataToGenericCardProps}
                        />
                    )
                }
            } else {
                return (
                    <GenericCarouselMobile<BANNER_ITEM_FRONTEND, GenericCardProps>
                        data={data} // Pass the data
                        component_config={component_config} // Configuration for the carousel
                        size={size} // Screen size
                        RenderCard={GenericCardMobile} // The card to render
                        renderCardProps={mapDataToGenericCardProps} // Function to map each data item to props
                    />
                )
            }
        }
    }
    function getBackgroundDirection(
        position?: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | null,
    ): 'row' | 'row-reverse' | 'column' | 'column-reverse' {
        switch (position) {
            case 'top':
                return 'column'
            case 'bottom':
                return 'column-reverse'
            case 'left':
                return 'row'
            case 'right':
                return 'row-reverse'
            default:
                return 'column'
        }
    }
    function getLayout(render: JSX.Element) {
        if (size == 'lg') {
            return getPosition({
                position: background_config?.desktop_position || 'top',
                width: background_config?.web_width || 1,
                render: render,
                videoUrl: background_config?.background_video || '',
                radius: background_config?.web_corner_radius || 0,
                lottie: background_config?.background_lottie || '',
                aspectRatio: background_config?.background_image_aspect_ratio || 1,
            })
        } else {
            return getPosition({
                position: background_config?.mobile_position || 'top',
                width: background_config?.mobile_width || 1,
                render: render,
                videoUrl: background_config?.mobile_background_video || '',
                radius: background_config?.corner_radius || 0,
                lottie: background_config?.mobile_background_lottie || '',
                aspectRatio: background_config?.background_image_aspect_ratio || 1,
            })
        }
    }
    function getPosition({
        position,
        width,
        render,
        videoUrl,
        radius,
        lottie,
        aspectRatio,
    }: {
        position: 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top' | 'bottom' | null
        width: number
        render: JSX.Element
        videoUrl: string
        radius: number
        lottie: string
        aspectRatio: number
    }) {
        return (
            <a
                className={clsx(
                    'flex overflow-hidden',
                    // getBackgroundClasses(background_config || undefined)
                )}
                href={background_config?.web_redirection_url || sectionHeadingURLFn({ section_filters, is_section_clickable })}
                style={{
                    flexDirection: getBackgroundDirection(position || 'top'),
                }}
            >
                <div
                    style={{
                        width: `${width * 100}%`,
                        paddingTop:
                            size == 'lg' ? background_config?.web_background_topMargin || 0 : background_config?.background_topMargin || 0,
                        paddingBottom:
                            size == 'lg'
                                ? background_config?.web_background_bottomMargin || 0
                                : background_config?.background_bottomMargin || 0,
                        paddingLeft:
                            size == 'lg'
                                ? background_config?.web_background_leftMargin || 0
                                : background_config?.background_leftMargin || 0,
                        paddingRight:
                            size == 'lg'
                                ? background_config?.web_background_rightMargin || 0
                                : background_config?.background_rightMargin || 0,
                    }}
                >
                    {background_config?.is_background_video
                        ? videoUrl && (
                              <GeneralVideoPlayer
                                  url={videoUrl}
                                  thumbnail={background_imageUrl || ''}
                                  aspectRatio={aspectRatio}
                                  radius={radius}
                              />
                          )
                        : background_config?.is_background_lottie
                          ? lottie && (
                                <LottieView
                                    path={
                                        lottie ||
                                        'https://slikk-dev-assets-public.s3.ap-south-1.amazonaws.com/product/b5577797f7f841daafa0c50ce7502fb4_Holi.json'
                                    }
                                    width={`${width * 100}vw`}
                                    height={`${width * 100 * aspectRatio}vw`}
                                />
                            )
                          : background_imageUrl && (
                                <img
                                    src={background_imageUrl || ''}
                                    alt=""
                                    className="object-contain self-end w-full max-w-full overflow-hidden"
                                    style={{
                                        borderRadius: radius,
                                        width: `${width * 100}vw`,
                                    }}
                                />
                            )}
                </div>
                <div className="justify-center items-center flex-1 overflow-hidden">{render}</div>
            </a>
        )
        // switch (position) {
        //   case "top":
        //     return (
        //       <div className="flex flex-col">
        //         <div
        //           style={{
        //             marginTop: `${background_config?.background_topMargin || 0}px`,
        //             marginBottom: `${
        //               background_config?.background_bottomMargin || 0
        //             }px`,
        //           }}
        //         >
        //           <img
        //             src={background_imageUrl || ""}
        //             width={`${width * 100}%`}
        //             alt=""
        //           />
        //         </div>
        //         <div className="justify-center items-center flex">{render}</div>
        //       </div>
        //     );
        //   case "left":
        //     return (
        //       <div className="flex w-full">
        //         <div
        //           className={clsx("flex", isGrid ? "items-center" : "items-end")}
        //           style={{ width: `${width * 100}%` }}
        //         >
        //           <img src={background_imageUrl || ""} width="100%" alt="" />
        //         </div>
        //         <div
        //           className="overflow-hidden justify-center items-center flex"
        //           style={{ width: `${100 - width * 100}%` }}
        //         >
        //           {render}
        //         </div>
        //       </div>
        //     );
        //   case "right":
        //     return (
        //       <div className="flex w-full">
        //         <div
        //           className="overflow-hidden justify-center items-center flex"
        //           style={{ width: `${100 - width * 100}%` }}
        //         >
        //           {render}
        //         </div>
        //         <div
        //           className={clsx("flex", isGrid ? "items-center" : "items-end")}
        //           style={{ width: `${width * 100}%` }}
        //         >
        //           <img src={background_imageUrl || ""} width="100%" alt="" />
        //         </div>
        //       </div>
        //     );

        //   default:
        //     return (
        //       <div className="flex flex-col">
        //         <div>
        //           <img
        //             src={background_imageUrl || ""}
        //             width={`${width * 100}%`}
        //             alt=""
        //           />
        //         </div>
        //         <div>{render}</div>
        //       </div>
        //     );
        // }
    }
    function getRenderElement({ isGrid, isWeb, isCarousel }: { isGrid: boolean; isCarousel: boolean; isWeb: boolean }) {
        if (!data_type) return null

        switch (data_type.type) {
            case 'spotlight':
            case 'searches':
            case 'purchases':
            case 'wishlist':
            case 'products':
                if (isWeb) {
                    return !isGrid ? (
                        <GenericCarousel<ProductCardData, ProductCardProps>
                            data={data}
                            component_config={component_config}
                            heartOnClick={heartOnClick}
                            size={size}
                            data_type={data_type}
                            RenderCard={GenericProductCard}
                            renderCardProps={mapDataToProductCardProps}
                        />
                    ) : (
                        <GridComponent<ProductCardData, ProductCardProps>
                            RenderComponent={GenericProductCard}
                            component_config={component_config}
                            size={size}
                            data={data}
                            data_type={data_type}
                            renderComponentProps={mapDataToProductCardProps}
                        />
                    )
                } else {
                    return !isGrid ? (
                        <GenericCarouselMobile<ProductCardData, ProductCardProps>
                            data={data}
                            component_config={component_config}
                            size={size}
                            data_type={data_type}
                            RenderCard={GenericProductCardMobile}
                            renderCardProps={mapDataToProductCardProps}
                        />
                    ) : (
                        <GridComponentMobile<ProductCardData, ProductCardProps>
                            RenderComponent={GenericProductCardMobile}
                            component_config={component_config}
                            data_type={data_type}
                            size={size}
                            data={data}
                            renderComponentProps={mapDataToProductCardProps}
                        />
                    )
                }

            case 'banner':
                return getComp({
                    isCarousel: isCarousel,
                    isGrid: isGrid,
                    isWeb: isWeb,
                })
            case 'categories':
                if (isWeb) {
                    return !isGrid ? (
                        <GenericCarousel<CATEGORIES, CategoryCardProps>
                            data={data} // Pass the data
                            component_config={component_config} // Configuration for the carousel
                            size={size}
                            data_type={data_type}
                            RenderCard={CategoryCard} // The card to render
                            renderCardProps={mapDataToCategoryCardProps} // Function to map each data item to props
                        />
                    ) : (
                        <GridComponent<CATEGORIES, CategoryCardProps>
                            RenderComponent={CategoryCard}
                            component_config={component_config}
                            data_type={data_type}
                            size={size}
                            data={data}
                            renderComponentProps={mapDataToCategoryCardProps}
                        />
                    )
                } else {
                    return !isGrid ? (
                        <GenericCarouselMobile<CATEGORIES, CategoryCardProps>
                            data={data} // Pass the data
                            data_type={data_type}
                            component_config={component_config} // Configuration for the carousel
                            size={size}
                            RenderCard={CategoryCardMobile} // The card to render
                            renderCardProps={mapDataToCategoryCardProps} // Function to map each data item to props
                        />
                    ) : (
                        <GridComponentMobile<CATEGORIES, CategoryCardProps>
                            RenderComponent={CategoryCardMobile}
                            data_type={data_type}
                            component_config={component_config}
                            size={size}
                            data={data}
                            renderComponentProps={mapDataToCategoryCardProps}
                        />
                    )
                }
            case 'brands':
                if (isWeb) {
                    return !isGrid ? (
                        <GenericCarousel<BrandData, BrandCardProps>
                            data={data} // Pass the data
                            component_config={component_config} // Configuration for the carousel
                            size={size}
                            data_type={data_type}
                            RenderCard={GenericBrandCard} // The card to render
                            renderCardProps={mapDataToBrandCardProps} // Function to map each data item to props
                        />
                    ) : (
                        <GridComponent<BrandData, BrandCardProps>
                            RenderComponent={GenericBrandCard}
                            component_config={component_config}
                            data_type={data_type}
                            size={size}
                            data={data}
                            renderComponentProps={mapDataToBrandCardProps}
                        />
                    )
                } else {
                    return !isGrid ? (
                        <GenericCarouselMobile<BrandData, BrandCardProps>
                            data={data} // Pass the data
                            data_type={data_type}
                            component_config={component_config} // Configuration for the carousel
                            size={size}
                            RenderCard={GenericBrandCardMobile} // The card to render
                            renderCardProps={mapDataToBrandCardProps} // Function to map each data item to props
                        />
                    ) : (
                        <GridComponentMobile<BrandData, BrandCardProps>
                            RenderComponent={GenericBrandCardMobile}
                            data_type={data_type}
                            component_config={component_config}
                            size={size}
                            data={data}
                            renderComponentProps={mapDataToBrandCardProps}
                        />
                    )
                }
            case 'post':
                if (isWeb) {
                    return !isGrid ? (
                        <GenericCarousel<REELSDATA, ReelCardProps>
                            data_type={data_type}
                            data={data} // Pass the data
                            component_config={component_config} // Configuration for the carousel
                            size={size}
                            RenderCard={GenericReelsTile} // The card to render
                            renderCardProps={mapDataToReelCardProps} // Function to map each data item to props
                        />
                    ) : (
                        <GridComponent<REELSDATA, ReelCardProps>
                            data_type={data_type}
                            RenderComponent={GenericReelsTile}
                            component_config={component_config}
                            size={size}
                            data={data}
                            renderComponentProps={mapDataToReelCardProps}
                        />
                    )
                } else {
                    return !isGrid ? (
                        <GenericCarouselMobile<REELSDATA, ReelCardProps>
                            data_type={data_type}
                            data={data} // Pass the data
                            component_config={component_config} // Configuration for the carousel
                            size={size}
                            RenderCard={GenericReelsTileMobile} // The card to render
                            renderCardProps={mapDataToReelCardProps} // Function to map each data item to props
                        />
                    ) : (
                        <GridComponentMobile<REELSDATA, ReelCardProps>
                            data_type={data_type}
                            RenderComponent={GenericReelsTileMobile}
                            component_config={component_config}
                            size={size}
                            data={data}
                            renderComponentProps={mapDataToReelCardProps}
                        />
                    )
                }

            default:
                return null
        }
    }
    const borderStyle: React.CSSProperties = (size !== 'lg' ? component_config?.section_border : component_config?.web_section_border)
        ? {
              borderWidth: size !== 'lg' ? component_config?.section_border_width || 0 : component_config?.section_border_width || 0, // Default to 0 if not provided
              borderStyle:
                  size !== 'lg' ? component_config?.section_border_style || 'solid' : component_config?.section_border_style || 'solid',
              borderColor:
                  size !== 'lg'
                      ? component_config?.section_border_color || 'transparent'
                      : component_config?.section_border_color || 'transparent', // Default color
          }
        : {
              border: 'none',
          }
    const getBackgroundColor = (color: string | undefined | null) => {
        return (color || '')?.trim().split(',').length > 1 ? `linear-gradient(to bottom, ${color})` : color || 'transparent'
    }

    const backgroundColor =
        size !== 'lg'
            ? getBackgroundColor(background_config?.background_color)
            : getBackgroundColor(background_config?.web_background_color)

    const combinedStyle: React.CSSProperties = {
        background: backgroundColor,
        ...borderStyle,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        paddingLeft: size !== 'lg' ? (component_config?.section_leftPadding ?? 0) : (component_config?.web_section_leftPadding ?? '5%'),
        paddingRight: size !== 'lg' ? (component_config?.section_rightPadding ?? 0) : (component_config?.web_section_rightPadding ?? '5%'),
        paddingBottom: size !== 'lg' ? (component_config?.section_bottomPadding ?? 0) : (component_config?.web_section_bottomPadding ?? 0),
        paddingTop: size !== 'lg' ? (component_config?.section_topPadding ?? 0) : (component_config?.web_section_topPadding ?? 0),
        marginLeft: size !== 'lg' ? (component_config?.section_leftMargin ?? 4) : (component_config?.web_section_leftMargin ?? 0),
        marginRight: size !== 'lg' ? (component_config?.section_rightMargin ?? 4) : (component_config?.web_section_rightMargin ?? 0),
        marginBottom: size !== 'lg' ? (component_config?.section_bottomMargin ?? 0) : (component_config?.web_section_bottomMargin ?? 0),
        marginTop: size !== 'lg' ? (component_config?.section_topMargin ?? 20) : (component_config?.web_section_topMargin ?? 0),
        borderRadius: size !== 'lg' ? (component_config?.section_corner_radius ?? 0) : (component_config?.web_section_corner_radius ?? 0),
        overflow: 'hidden',
    }

    return (
        <div style={combinedStyle}>
            <HeaderWithSubHeader headerConfig={header_config} subHeaderConfig={sub_header_config} size={size} />
            {extra_info?.timeout && new Date(extra_info.timeout).getTime() > Date.now() && (
                <CountdownTimer config={extra_info} size={size} />
            )}
            <div
                className={clsx('relative w-full h-full')}
                style={{
                    // backgroundColor: background_config?.background_color ?? "transparent",
                    justifyContent:
                        size == 'lg'
                            ? component_config?.web_section_alignment || 'space-around'
                            : component_config?.section_alignment || 'space-around',
                }}
            >
                {size == 'lg' &&
                    getLayout(
                        getRenderElement({
                            isGrid: component_config?.web_grid || false,
                            isWeb: true,
                            isCarousel: component_config?.web_carousel || false,
                        }) || <></>,
                    )}
                {size !== 'lg' &&
                    getLayout(
                        getRenderElement({
                            isGrid: component_config?.grid || false,
                            isWeb: false,
                            isCarousel: component_config?.carousel || false,
                        }) || <></>,
                    )}
                {/* <div className="relative w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: background_imageUrl ? `url(${background_imageUrl})` : 'none' }}> */}
                {/* {background_image && <a href={sectionHeadingURLFn({ position, section_filters, is_section_clickable })} className="w-full"><img src={background_image} className={ImageStyles({ size })} /></a>} */}
            </div>
            <Footer footerConfig={footer_config} size={size} />
        </div>
    )
}
function getBackgroundClasses(backgroundConfig?: BackgroundConfig) {
    if (!backgroundConfig) return ' '
    const { background_topMargin, background_bottomMargin } = backgroundConfig

    return [background_topMargin ? `pt-${background_topMargin}` : '', background_bottomMargin ? `pb-${background_bottomMargin}` : '']
        .filter(Boolean) // Remove any empty strings
        .join(' ') // Join the classes into a single string
}
const ContainerStyles = cva('flex flex-col items-center relative w-full h-fit px-[2%]', {
    variants: {
        size: {
            sm: 'mb-[10%]',
            md: 'mb-[8%]',
            lg: 'mb-[7.5%]',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
})

const BigBgVariants = cva('absolute flex overflow-x-scroll rounded-md w-full pl-[4%]', {
    variants: {
        size: {
            sm: 'pl-2 top-[40%]',
            md: 'pl-3 top-[40%]',
            lg: 'pl-5 top-[40%]',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
})

const ImageStyles = cva('object-fit w-full rounded-xl absolute', {
    variants: {
        size: {
            sm: '',
            md: '',
            lg: '',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
})

const backDropStyles = cva('absolute bottom-0 w-full bg-gradient-to-t from-black from-20% to-transparent rounded-b-xl pl-[4%]', {
    variants: {
        size: {
            sm: 'h-[100px]',
            md: 'h-[150px]',
            lg: 'h-[300px]',
        },
    },
    defaultVariants: {
        size: 'lg',
    },
})
// Helper to convert width to Tailwind class
export const convertWidthToTailwindClass = (width?: number | null): string => {
    if (width == null || width < 0 || width > 1) return ''
    const percentage = Math.round(width * 100)
    if (percentage === 0) return 'w-0'
    return percentage === 100 ? 'w-full' : `w-[${percentage}%]`
}
// Helper to convert corner radius to Tailwind class
// export const convertCornerRadiusToClass = (
//   cornerRadius?: number | null
// ): string => {
//   if (!cornerRadius || cornerRadius <= 0) return "";
//   return `rounded-[${cornerRadius}px]`; // Using arbitrary values for precise corner radius
// };
