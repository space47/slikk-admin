import { useCallback } from 'react'

import Switcher from '@/components/ui/Switcher'

interface MODEPROPS {
    isDark: any
    setIsDark: (value: any) => void
}

const ModeSwitcher = ({ isDark, setIsDark }: MODEPROPS) => {
    const onSwitchChange = useCallback(
        (checked: boolean) => {
            setIsDark(checked ? 'dark' : 'light')
        },
        [setIsDark],
    )

    return (
        <div>
            <Switcher defaultChecked={isDark} onChange={(checked) => onSwitchChange(checked)} />
        </div>
    )
}

export default ModeSwitcher
