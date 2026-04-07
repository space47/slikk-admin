import classNames from 'classnames'
import Drawer from '@/components/ui/Drawer'
import { HiOutlineCog } from 'react-icons/hi'
import SidePanelContent, { SidePanelContentProps } from './SidePanelContent'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import { setPanelExpand, useAppSelector, useAppDispatch } from '@/store'
import type { CommonProps } from '@/@types/common'
import StoreSelect from '../VerticalMenuContent/StoreSelect'
import { useEffect } from 'react'

type SidePanelProps = SidePanelContentProps & CommonProps

const _SidePanel = (props: SidePanelProps) => {
    const dispatch = useAppDispatch()
    const { className, ...rest } = props
    const panelExpand = useAppSelector((state) => state.theme.panelExpand)
    const direction = useAppSelector((state) => state.theme.direction)

    const openPanel = () => {
        dispatch(setPanelExpand(true))
    }
    useEffect(() => {
        closePanel()
    }, [])

    const closePanel = () => {
        dispatch(setPanelExpand(false))
        const bodyClassList = document.body.classList
        if (bodyClassList.contains('drawer-lock-scroll')) {
            bodyClassList.remove('drawer-lock-scroll', 'drawer-open')
        }
    }

    return (
        <div className="">
            <div className={classNames('text-2xl xl:block', className)} onClick={openPanel} {...rest}>
                <HiOutlineCog />
            </div>
            <Drawer
                title="Dashboard Settings"
                className={'p-4'}
                isOpen={panelExpand}
                placement={direction === 'rtl' ? 'left' : 'right'}
                onClose={closePanel}
                onRequestClose={closePanel}
            >
                <div className="p-4">
                    <SidePanelContent callBackClose={closePanel} />
                </div>
                <div className="w-full mt-1 p-4">
                    <StoreSelect />
                </div>
            </Drawer>
        </div>
    )
}

const SidePanel = withHeaderItem(_SidePanel)

export default SidePanel
