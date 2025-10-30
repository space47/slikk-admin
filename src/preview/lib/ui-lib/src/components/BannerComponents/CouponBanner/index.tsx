import { POSITION_ITEM_FRONTEND } from '@/preview/utils'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa'
import { Footer } from '../SupportingComponents/FooterComp'

import { IoIosCloseCircle } from 'react-icons/io'
import GeneralVideoPlayer from '../SupportingComponents/GeneralVideoPlayer'

export const CouponBanner = ({
    size,
    header_config,
    background_image,
    background_config,
    sub_header_config,
    footer_config,
    component_config,
    callBack,
    ...rest
}: POSITION_ITEM_FRONTEND) => {
    const {
        icon: headerIcon = '',
        text: headerText = '',
        web_text: webHeaderText = '',
        style: headerStyle = '',
        position: headerPosition = '',
        image: headerImage = '',
        web_redirection_url: webHeaderRedirectionUrl,
        background_color: headerBackgroundColor,
        font_color: headerFontColor = '#A5A4A5',
        font_size: headerFontSize = 24,
        web_font_size: webHeaderFontSize = 24,
        web_topMargin: webHeaderTopMargin = 0,
        web_bottomMargin: webHeaderBottomMargin = 0,
    } = header_config || {}

    const {
        icon: subHeaderIcon = '',
        text: subHeaderText = '',
        web_text: webSubHeaderText = '',
        style: subHeaderStyle = '',
        position: subHeaderPosition = '',
        web_redirection_url: webSubHeaderRedirectionUrl,
        font_color: subHeaderFontColor = '#A5A4A5',
        font_size: subHeaderFontSize = 18,
        web_bottomMargin: webSubHeaderBottomMargin = 0,
        web_topMargin: webSubHeaderTopMargin = 0,
        web_font_size: webSubHeaderFontSize = 18,
    } = sub_header_config || {}

    const [isExpanded, setIsExpanded] = useState(false)
    const [isReady, setIsReady] = useState(false)
    const headerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const images = [headerIcon, headerImage, subHeaderIcon, background_image]
        const promises = images.map((src) =>
            src
                ? new Promise((resolve) => {
                      const img = new Image()
                      img.src = src
                      img.onload = resolve
                      img.onerror = () => {
                          console.error(`Failed to load image: ${src}`)
                      }
                  })
                : Promise.resolve(),
        )

        Promise.all(promises).then(() => setIsReady(true))
    }, [headerIcon, headerImage, subHeaderIcon, background_image])

    const toggleExpand = () => {
        setIsExpanded((prev) => !prev)
    }

    const headerTextStyle = clsx({
        'font-bold': headerStyle?.toLowerCase().includes('bold'),
        italic: headerStyle?.toLowerCase().includes('italic'),
        underline: headerStyle?.toLowerCase().includes('underline'),
    })

    const subHeaderTextStyle = clsx({
        'font-bold': subHeaderStyle?.toLowerCase().includes('bold'),
        italic: subHeaderStyle?.toLowerCase().includes('italic'),
        underline: subHeaderStyle?.toLowerCase().includes('underline'),
    })

    const getFlexPosition = (position: string | undefined): { justifyContent: string; alignItems: string } => {
        switch (position) {
            case 'left':
                return { alignItems: 'flex-start', justifyContent: 'center' }
            case 'right':
                return { alignItems: 'flex-end', justifyContent: 'center' }
            case 'top':
                return { alignItems: 'center', justifyContent: 'flex-start' }
            case 'center':
                return { alignItems: 'center', justifyContent: 'center' }
            case 'bottom':
                return { alignItems: 'center', justifyContent: 'flex-end' }
            case 'top-left':
                return { alignItems: 'flex-start', justifyContent: 'flex-start' }
            case 'bottom-left':
                return { alignItems: 'flex-start', justifyContent: 'flex-end' }
            case 'top-right':
                return { alignItems: 'flex-end', justifyContent: 'flex-start' }
            case 'bottom-right':
                return { alignItems: 'flex-end', justifyContent: 'flex-end' }
            default:
                return { alignItems: 'flex-start', justifyContent: 'flex-end' }
        }
    }
    const mobilePosition: React.CSSProperties = {
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        ...getFlexPosition(background_config?.mobile_position || ''),
    }

    const headerAlign = headerPosition === 'center' ? 'justify-center' : headerPosition === 'right' ? 'justify-end' : 'justify-start'

    const subHeaderAlign =
        subHeaderPosition === 'center' ? 'justify-center' : subHeaderPosition === 'right' ? 'justify-end' : 'justify-start'

    const containerClasses = clsx(
        'fixed right-0 bg-pink-200 shadow-lg transition-all duration-500 ease-in-out flex z-50 cursor-pointer',
        size == 'lg' && {
            'w-12': !isExpanded,
            '': isExpanded,
        },
        size == 'lg' ? 'overflow-hidden' : 'flex-col',
        size == 'lg' && isLeft() && 'rounded-r-sm flex-row-reverse',
        size == 'lg' && isBottom() ? '-translate-y-full' : size == 'lg' && isTop() ? '' : '-translate-y-1/2',
    )

    const mobileContainerClasses = clsx('bg-pink-200 shadow-lg transition-transform duration-500 ease-in-out z-50 ', 'flex-col')

    const contentClasses = clsx(
        'flex-grow transition-all duration-400 ease-in-out',
        size == 'lg' && {
            'opacity-100 visible': isExpanded,
            'opacity-0 invisible': !isExpanded,
        },
    )

    function isLeft() {
        return (
            background_config?.desktop_position === 'left' ||
            background_config?.desktop_position === 'top-left' ||
            background_config?.desktop_position === 'bottom-left'
        )
    }
    function isTop() {
        return background_config?.desktop_position === 'top-right' || background_config?.desktop_position === 'top-left'
    }
    function isBottom() {
        return background_config?.desktop_position === 'bottom-right' || background_config?.desktop_position === 'bottom-left'
    }

    if (size == 'sm') {
        return (
            <div
                className=" bg-black/40 w-full h-full fixed top-0 left-0 z-[105]"
                onClick={() => {
                    callBack && callBack('skip')
                }}
            >
                <div style={mobilePosition}>
                    <div
                        style={{
                            width: `${(background_config?.mobile_width || 0.4) * 100}%` || '100%',
                        }}
                    >
                        <div className={mobileContainerClasses}>
                            {Object.keys(header_config || {}).length > 0 && (
                                <div
                                    className={clsx(
                                        'w-full text-white text-orientation-mixed text-sm font-bold flex items-center justify-between align-middle overflow-hidden',
                                        background_config?.desktop_position == 'left' ||
                                            background_config?.desktop_position == 'top-left' ||
                                            background_config?.desktop_position == 'bottom-left',
                                    )}
                                    style={{
                                        marginBottom: webHeaderBottomMargin || 0,
                                        marginTop: webHeaderTopMargin || 0,
                                    }}
                                    onClick={toggleExpand}
                                    ref={headerRef}
                                >
                                    <div
                                        className="w-full h-full flex flex-col"
                                        style={{
                                            backgroundColor: headerBackgroundColor,
                                        }}
                                    >
                                        {subHeaderText?.length > 0 && subHeaderFontSize != null && subHeaderFontSize > 0 && (
                                            <a
                                                href={webSubHeaderRedirectionUrl}
                                                onClick={(e) => {
                                                    if (!webSubHeaderRedirectionUrl) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                                className={`flex items-center ${subHeaderAlign}`}
                                                style={{
                                                    color: subHeaderFontColor,
                                                    fontSize: `${subHeaderFontSize}px`,
                                                }}
                                            >
                                                {subHeaderIcon && (
                                                    <img
                                                        src={subHeaderIcon}
                                                        width={40}
                                                        alt="sub-header icon"
                                                        className="inline-block mr-2"
                                                    />
                                                )}
                                                {subHeaderText && <h2 className={`${subHeaderTextStyle}`}>{subHeaderText}</h2>}
                                            </a>
                                        )}

                                        {headerText?.length > 0 && headerFontSize != null && headerFontSize > 0 && (
                                            <a
                                                href={webHeaderRedirectionUrl}
                                                onClick={(e) => {
                                                    if (!webHeaderRedirectionUrl) {
                                                        e.preventDefault()
                                                    }
                                                }}
                                                className={`flex items-center w-full py-2 ${headerAlign}`}
                                                style={{
                                                    color: headerFontColor,
                                                    fontSize: `${headerFontSize}px`,
                                                }}
                                            >
                                                {headerIcon && <img src={headerIcon} alt="header icon" className="inline-block mr-2" />}
                                                {headerText && <h1 className={`${headerTextStyle}`}>{headerText}</h1>}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className={contentClasses}>
                                <div className="h-full flex flex-col justify-center relative">
                                    <div className="text-gray-500 flex justify-end items-center uppercase font-semibold absolute top-2 right-2">
                                        <p
                                            onClick={() => {
                                                callBack && callBack('skip')
                                            }}
                                        >
                                            <IoIosCloseCircle size={25} />
                                        </p>
                                    </div>
                                    <a
                                        href={background_config?.web_redirection_url}
                                        onClick={(e) => {
                                            if (!background_config?.web_redirection_url) {
                                                e.preventDefault()
                                            }
                                        }}
                                    >
                                        {background_config?.is_background_video ? (
                                            <GeneralVideoPlayer
                                                url={background_config?.mobile_background_video || ''}
                                                thumbnail={background_config?.mobile_background_image || ''}
                                                aspectRatio={background_config?.mobile_image_aspect_ratio || 0}
                                                radius={background_config?.corner_radius || 0}
                                            />
                                        ) : background_config?.background_image && background_config?.mobile_background_image ? (
                                            <img src={background_config?.mobile_background_image} className="object-cover" />
                                        ) : (
                                            <img src={background_image || ''} className="object-cover" />
                                        )}
                                    </a>
                                    <Footer footerConfig={footer_config} size={size} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={containerClasses}
            style={{
                top:
                    background_config?.desktop_position == 'top-right' || background_config?.desktop_position == 'top-left'
                        ? `${0}px`
                        : background_config?.desktop_position == 'bottom-right' || background_config?.desktop_position == 'bottom-left'
                          ? `calc(100vh - 1rem)`
                          : `50vh`,
                left:
                    background_config?.desktop_position == 'left' ||
                    background_config?.desktop_position == 'top-left' ||
                    background_config?.desktop_position == 'bottom-left'
                        ? `0`
                        : `auto`,
                width: isExpanded
                    ? size !== 'lg'
                        ? `${(background_config?.mobile_width || 0.4) * 100}%` || '100%'
                        : `${(background_config?.web_width || 0.4) * 100}%`
                    : '3rem',
                transition: 'width 400ms ease-in-out',
            }}
        >
            <div
                className={clsx(
                    'w-12 text-white writing-mode-vertical-lr text-orientation-mixed text-sm font-bold flex items-center justify-between align-middle py-2',
                    background_config?.desktop_position == 'left' ||
                        background_config?.desktop_position == 'top-left' ||
                        background_config?.desktop_position == 'bottom-left'
                        ? 'rotate-0'
                        : 'rotate-180',
                )}
                style={{
                    marginBottom: webHeaderBottomMargin || 0,
                    marginTop: webHeaderTopMargin || 0,
                    backgroundColor: headerBackgroundColor,
                }}
                onClick={toggleExpand}
                ref={headerRef}
            >
                <div className="w-full h-full flex flex-col">
                    <a
                        href={webSubHeaderRedirectionUrl}
                        onClick={(e) => {
                            if (!webSubHeaderRedirectionUrl) {
                                e.preventDefault()
                            }
                        }}
                        className={`flex items-center ${subHeaderAlign}`}
                        style={{
                            color: subHeaderFontColor,
                            fontSize: `${size == 'lg' ? webSubHeaderFontSize : subHeaderFontSize}px`,
                        }}
                    >
                        {subHeaderIcon && <img src={subHeaderIcon} width={40} alt="sub-header icon" className="inline-block mr-2" />}
                        {(webSubHeaderText || subHeaderText) && <h2 className={`${subHeaderTextStyle}`}>{subHeaderText}</h2>}
                    </a>
                    <a
                        href={webHeaderRedirectionUrl}
                        onClick={(e) => {
                            if (!webHeaderRedirectionUrl) {
                                e.preventDefault()
                            }
                        }}
                        className={`flex items-center w-full ${headerAlign}`}
                        style={{
                            color: headerFontColor,
                            fontSize: `${size == 'lg' ? webHeaderFontSize : headerFontSize}px`,
                        }}
                    >
                        {headerIcon && <img src={headerIcon} alt="header icon" className="inline-block mr-2" />}
                        <h1 className={`${headerTextStyle}`}>{webHeaderText || headerText}</h1>
                    </a>
                </div>
                {!isExpanded ? (
                    <FaCaretRight size={size == 'lg' ? webHeaderFontSize || 50 : headerFontSize || 20} color={headerFontColor} />
                ) : (
                    <FaCaretLeft size={size == 'lg' ? webHeaderFontSize || 50 : headerFontSize || 20} color={headerFontColor} />
                )}
            </div>
            <div className={contentClasses}>
                <div className="h-full flex flex-col justify-center">
                    <a
                        href={background_config?.web_redirection_url}
                        onClick={(e) => {
                            if (!background_config?.web_redirection_url) {
                                e.preventDefault()
                            }
                        }}
                        className="w-full"
                    >
                        {background_config?.is_background_video ? (
                            <GeneralVideoPlayer
                                url={
                                    size == 'lg'
                                        ? background_config?.background_video || ''
                                        : background_config?.mobile_background_video || ''
                                }
                                thumbnail={
                                    size == 'lg'
                                        ? background_config?.background_image || ''
                                        : background_config?.mobile_background_image || ''
                                }
                                aspectRatio={
                                    size == 'lg'
                                        ? background_config?.background_image_aspect_ratio || 0
                                        : background_config?.mobile_image_aspect_ratio || 0
                                }
                                radius={size == 'lg' ? background_config?.web_corner_radius || 0 : background_config?.corner_radius || 0}
                            />
                        ) : background_config?.background_image && background_config?.mobile_background_image ? (
                            <img
                                src={size == 'lg' ? background_config?.background_image : background_config?.mobile_background_image}
                                className="object-cover w-full"
                            />
                        ) : (
                            <img src={background_image || ''} className="object-cover w-full" />
                        )}
                    </a>
                    <Footer footerConfig={footer_config} size={size} />
                </div>
            </div>
        </div>
    )
}
