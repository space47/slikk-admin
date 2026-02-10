import { forwardRef } from 'react'
import classNames from 'classnames'
import { useConfig } from '../ConfigProvider'
import { useForm } from '../Form/context'
import { useInputGroup } from '../InputGroup/context'
import useColorLevel from '../hooks/useColorLevel'
import { CONTROL_SIZES, SIZES } from '../utils/constants'
import { Spinner } from '../Spinner'
import type { CommonProps, TypeAttributes, ColorLevel } from '../@types/common'
import type { ReactNode, ComponentPropsWithRef, MouseEvent } from 'react'

export interface ButtonProps extends CommonProps, Omit<ComponentPropsWithRef<'button'>, 'onClick'> {
    active?: boolean
    block?: boolean
    color?: string
    disabled?: boolean
    icon?: string | ReactNode
    loading?: boolean
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void
    shape?: TypeAttributes.Shape
    size?: TypeAttributes.Size
    variant?: 'solid' | 'twoTone' | 'plain' | 'default' | 'new' | 'accept' | 'reject' | 'pending' | 'yellow' | 'blue' | 'gray'
}

type ButtonColor = {
    bgColor: string
    hoverColor: string
    activeColor: string
    textColor: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        active = false,
        block = false,
        children,
        className,
        color = '',
        disabled,
        icon,
        loading = false,
        shape = 'round',
        size,
        variant = 'default',
        ...rest
    } = props
    const { themeColor, controlSize, primaryColorLevel } = useConfig()
    const formControlSize = useForm()?.size
    const inputGroupSize = useInputGroup()?.size
    const defaultClass = 'button'
    const sizeIconClass = 'inline-flex items-center justify-center'

    const splitedColor = color?.split('-') || []

    const buttonSize = size || inputGroupSize || formControlSize || controlSize
    const buttonColor = splitedColor[0] || themeColor
    const buttonColorLevel = splitedColor[1] || primaryColorLevel

    const [increaseLevel, decreaseLevel] = useColorLevel(buttonColorLevel as ColorLevel)

    const getButtonSize = () => {
        let sizeClass = ''
        switch (buttonSize) {
            case SIZES.LG:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.lg}`,
                    icon && !children ? `w-${CONTROL_SIZES.lg} ${sizeIconClass} text-2xl` : 'px-8 py-2 text-base',
                )
                break
            case SIZES.SM:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.sm}`,
                    icon && !children ? `w-${CONTROL_SIZES.sm} ${sizeIconClass} text-lg` : 'px-3 py-2 text-sm',
                )
                break
            case SIZES.XS:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.xs}`,
                    icon && !children ? `w-${CONTROL_SIZES.xs} ${sizeIconClass} text-base` : 'px-3 py-1 text-xs',
                )
                break
            default:
                sizeClass = classNames(
                    `h-${CONTROL_SIZES.md}`,
                    icon && !children ? `w-${CONTROL_SIZES.md} ${sizeIconClass} text-xl` : 'px-8 py-2',
                )
                break
        }
        return sizeClass
    }

    const disabledClass = 'opacity-50 cursor-not-allowed'

    const solidColor = () => {
        const btn = {
            bgColor: `bg-green-500 border border-green-700 dark:bg-green-600 dark:border-green-800`,
            textColor: `text-white dark:text-white`,
            hoverColor: `hover:bg-green-600 dark:hover:bg-green-700`,
            activeColor: `active:bg-green-400 dark:active:bg-green-500 dark:active:border-green-700`,
        }
        return getBtnColor(btn)
    }

    const twoToneColor = () => {
        const btn = {
            bgColor: active
                ? `bg-${buttonColor}-200 dark:bg-${buttonColor}-50`
                : `bg-${buttonColor}-100 dark:bg-${buttonColor}-500 dark:bg-opacity-20`,
            textColor: `text-${buttonColor}-${buttonColorLevel} dark:text-${buttonColor}-50`,
            hoverColor: active
                ? ''
                : `hover:bg-${buttonColor}-300 hover:text-gray-500 dark:hover:bg-${buttonColor}-300 dark:hover:bg-opacity-30`,
            activeColor: `active:bg-${buttonColor}-200 dark:active:bg-${buttonColor}-500 dark:active:bg-opacity-40`,
        }
        return getBtnColor(btn)
    }
    const newColor = () => {
        const btn = {
            bgColor: active
                ? `bg-gray-100 border  border-gray-300 dark:bg-gray-500 dark:border-gray-500 dark:bg-blue-500 dark:text-white`
                : `bg-black border border-gray-800 dark:bg-black dark:border-gray-700 dark:bg-blue-600 dark:text-white`,
            textColor: `text-white dark:text-white`,
            hoverColor: active ? `hover:bg-gray-200 dark:hover:bg-gray-600` : `hover:bg-gray-500 dark:hover:bg-gray-800`,
            activeColor: `active:bg-gray-300 dark:active:bg-gray-700 dark:active:border-gray-600`,
        }
        return getBtnColor(btn)
    }
    const acceptColor = () => {
        const btn = {
            bgColor: `bg-green-500 border border-green-700 dark:bg-green-600 dark:border-green-800`,
            textColor: `text-white dark:text-white`,
            hoverColor: `hover:bg-green-600 dark:hover:bg-green-700`,
            activeColor: `active:bg-green-400 dark:active:bg-green-500 dark:active:border-green-700`,
        }
        return getBtnColor(btn)
    }
    const gray = () => {
        const btn = {
            bgColor: `bg-gray-500 border border-gray-700 dark:bg-gray-600 dark:border-gray-800`,
            textColor: `text-white dark:text-white`,
            hoverColor: `hover:bg-gray-600 dark:hover:bg-gray-700`,
            activeColor: `active:bg-gray-500 dark:active:bg-gray-500 dark:active:border-gray-700`,
        }
        return getBtnColor(btn)
    }
    const yellowColor = () => {
        const btn = {
            bgColor: `bg-yellow-600 border border-yellow-700 dark:bg-yellow-600 dark:border-yellow-800`,
            textColor: `text-white dark:text-white`,
            hoverColor: `hover:bg-yellow-800 dark:hover:bg-yellow-700`,
            activeColor: `active:bg-yellow-400 dark:active:bg-yellow-500 dark:active:border-yellow-700`,
        }
        return getBtnColor(btn)
    }

    const rejectColor = () => {
        const btn = {
            bgColor: `bg-red-500 border border-red-700 dark:bg-red-600 dark:border-red-800`,
            textColor: `text-white dark:text-white`,
            hoverColor: `hover:bg-red-600 dark:hover:bg-red-700`,
            activeColor: `active:bg-red-400 dark:active:bg-red-500 dark:active:border-red-700`,
        }
        return getBtnColor(btn)
    }

    const pendingColor = () => {
        const btn = {
            bgColor: `bg-orange-500 border border-orange-700 dark:bg-orange-600 dark:border-orange-800`,
            textColor: `text-white dark:text-white`,
            hoverColor: `hover:bg-orange-600 dark:hover:bg-orange-700`,
            activeColor: `active:bg-orange-400 dark:active:bg-orange-500 dark:active:border-orange-700`,
        }
        return getBtnColor(btn)
    }
    const blueColor = () => {
        const btn = {
            bgColor: `bg-blue-500 border border-blue-700 dark:bg-blue-600 dark:border-blue-800`,
            textColor: `text-white dark:text-white`,
            hoverColor: `hover:bg-blue-600 dark:hover:bg-blue-700`,
            activeColor: `active:bg-blue-400 dark:active:bg-blue-500 dark:active:border-blue-700`,
        }
        return getBtnColor(btn)
    }

    const defaultColor = () => {
        const btn = {
            bgColor: active
                ? `bg-gray-100 border border-gray-300 dark:bg-gray-500 dark:border-gray-500`
                : `bg-white border border-gray-300 dark:bg-gray-700 dark:border-gray-700`,
            textColor: `text-gray-600 dark:text-gray-100`,
            hoverColor: active ? '' : `hover:bg-gray-50 dark:hover:bg-gray-600`,
            activeColor: `active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500`,
        }
        return getBtnColor(btn)
    }

    const plainColor = () => {
        const btn = {
            bgColor: active ? `bg-gray-100 dark:bg-gray-500` : 'bg-transparent border border-transparent',
            textColor: `text-gray-600 dark:text-gray-100`,
            hoverColor: active ? '' : `hover:bg-gray-50 dark:hover:bg-gray-600`,
            activeColor: `active:bg-gray-100 dark:active:bg-gray-500 dark:active:border-gray-500`,
        }
        return getBtnColor(btn)
    }

    const getBtnColor = ({ bgColor, hoverColor, activeColor, textColor }: ButtonColor) => {
        return `${bgColor} ${disabled || loading ? disabledClass : hoverColor + ' ' + activeColor} ${textColor}`
    }

    const btnColor = () => {
        switch (variant) {
            case 'solid':
                return solidColor()
            case 'twoTone':
                return twoToneColor()
            case 'plain':
                return plainColor()
            case 'default':
                return defaultColor()
            case 'new':
                return newColor()
            case 'accept':
                return acceptColor()
            case 'yellow':
                return yellowColor()
            case 'reject':
                return rejectColor()
            case 'pending':
                return pendingColor()
            case 'blue':
                return blueColor()
            case 'gray':
                return gray()
            default:
                return defaultColor()
        }
    }

    const classes = classNames(defaultClass, btnColor(), `radius-${shape}`, getButtonSize(), className, block ? 'w-full' : '')

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
        const { onClick } = props
        if (disabled || loading) {
            e.preventDefault()
            return
        }
        onClick?.(e)
    }

    const renderChildren = () => {
        if (loading && children) {
            return (
                <span className="flex items-center justify-center">
                    <Spinner enableTheme={false} className="mr-1" />
                    {children}
                </span>
            )
        }

        if (icon && !children && loading) {
            return <Spinner enableTheme={false} />
        }

        if (icon && !children && !loading) {
            return <>{icon}</>
        }

        if (icon && children && !loading) {
            return (
                <span className="flex items-center justify-center">
                    <span className="text-lg">{icon}</span>
                    <span className="ltr:ml-1 rtl:mr-1">{children}</span>
                </span>
            )
        }

        return <>{children}</>
    }

    return (
        <button ref={ref} className={classes} {...rest} onClick={handleClick}>
            {renderChildren()}
        </button>
    )
})

Button.displayName = 'Button'

export default Button
