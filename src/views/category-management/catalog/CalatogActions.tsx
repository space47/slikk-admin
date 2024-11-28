import Button from '@/components/ui/Button'
import Drawer from '@/components/ui/Drawer'
import type { MouseEvent } from 'react'
import { IoMdDownload } from 'react-icons/io'
import { FaFacebook } from 'react-icons/fa'

interface CatalogActionsProps {
    isOpen: boolean
    setIsOpen: (x: boolean) => void
    handleGenerateSiteMap: () => Promise<void>
    setShowFacebookDialog: (value: React.SetStateAction<boolean>) => void
    handleDownload: () => Promise<void>
}

const CatalogActions = ({ isOpen, setIsOpen, setShowFacebookDialog, handleDownload, handleGenerateSiteMap }: CatalogActionsProps) => {
    const openDrawer = () => {
        setIsOpen(true)
    }

    const onDrawerClose = (e: MouseEvent) => {
        console.log('onDrawerClose', e)
        setIsOpen(false)
    }

    return (
        <div>
            <Button onClick={() => openDrawer()}>Open Drawer</Button>
            <Drawer title="Actions" isOpen={isOpen} onClose={onDrawerClose} onRequestClose={onDrawerClose}>
                <div className="grid grid-cols-3 gap-4">
                    <button
                        className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-yellow-600 rounded-lg text-white bg-yellow-700"
                        onClick={handleGenerateSiteMap}
                    >
                        <span className="font-bold">SiteMap</span>
                    </button>
                    <button
                        className=" px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-blue-600 rounded-lg text-white bg-blue-700"
                        onClick={() => setShowFacebookDialog(true)}
                    >
                        <span className="font-bold">Sync</span> <FaFacebook className="text-xl" />
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 xl:flex items-center gap-2 hidden hover:bg-green-400 rounded-lg font-bold"
                        onClick={handleDownload}
                    >
                        <IoMdDownload className="text-xl" /> Export
                    </button>
                </div>
            </Drawer>
        </div>
    )
}

export default CatalogActions
