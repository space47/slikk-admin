import { useState, useRef, useEffect, useMemo } from 'react'
import classNames from 'classnames'
import withHeaderItem from '@/utils/hoc/withHeaderItem'
import Dialog from '@/components/ui/Dialog'
import useThemeClass from '@/utils/hooks/useThemeClass'
import navigationIcon from '@/configs/navigation-icon.config'
import debounce from 'lodash/debounce'
import { HiOutlineSearch, HiChevronRight } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import Highlighter from 'react-highlight-words'
import appsNavigationConfig from '@/configs/navigation.config/apps.navigation.config'
import { Input, Tooltip } from '../ui'

type MenuItem = {
    key: string
    path?: string
    title?: string
    subMenu?: MenuItem[]
}

type FormattedItem = {
    key: string
    title: string
    path: string
}

const getLastSubMenus = (menuList: MenuItem[]): MenuItem[] =>
    menuList.flatMap((item) => (item.subMenu?.length ? getLastSubMenus(item.subMenu) : [item]))

const ListItem = ({
    icon,
    label,
    url,
    isLast,
    keyWord,
    onNavigate,
}: {
    icon: string
    label: string
    url: string
    isLast?: boolean
    keyWord: string
    onNavigate: () => void
}) => {
    const { textTheme } = useThemeClass()

    return (
        <Link to={url} onClick={onNavigate}>
            <div
                className={classNames(
                    'flex items-center justify-between rounded-lg p-3.5 cursor-pointer user-select',
                    'bg-gray-50 dark:bg-gray-700/60 hover:bg-gray-100 dark:hover:bg-gray-700/90',
                    !isLast && 'mb-3',
                )}
            >
                <div className="flex items-center">
                    <div
                        className={classNames(
                            'mr-4 rounded-md ring-1 ring-slate-900/5 shadow-sm text-xl h-6 w-6 flex items-center justify-center bg-white dark:bg-gray-700',
                            textTheme,
                            'dark:text-gray-100',
                        )}
                    >
                        {icon && navigationIcon[icon]}
                    </div>

                    <div className="text-gray-900 dark:text-gray-300">
                        <Highlighter
                            autoEscape
                            highlightClassName={classNames(textTheme, 'underline bg-transparent font-semibold dark:text-white')}
                            searchWords={[keyWord]}
                            textToHighlight={label}
                        />
                    </div>
                </div>

                <HiChevronRight className="text-lg" />
            </div>
        </Link>
    )
}

const _Search = ({ className }: { className?: string }) => {
    const [searchDialogOpen, setSearchDialogOpen] = useState(false)
    const [filteredData, setFilteredData] = useState<FormattedItem[]>([])
    const [noResult, setNoResult] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const formattedData = useMemo(() => {
        const lastSubMenus = getLastSubMenus(appsNavigationConfig)
        return lastSubMenus
            .filter((item) => item.title && item.path)
            .map((item) => ({
                key: item.key,
                title: item.title!,
                path: item.path!,
            }))
    }, [appsNavigationConfig])

    const handleSearchOpen = () => {
        setSearchDialogOpen(true)
        setFilteredData(formattedData)
        setNoResult(false)
    }

    const handleSearchClose = () => {
        setSearchDialogOpen(false)
        setNoResult(false)
        setFilteredData(formattedData)
    }

    const handleNavigate = () => {
        handleSearchClose()
    }

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                if (!value.trim()) {
                    setFilteredData(formattedData)
                    setNoResult(false)
                    return
                }

                const result = formattedData.filter((item) => item.title.toLowerCase().includes(value.toLowerCase()))

                setFilteredData(result)
                setNoResult(result.length === 0)
            }, 300),
        [formattedData],
    )

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        debouncedSearch(e.target.value)
    }

    useEffect(() => {
        return () => {
            debouncedSearch.cancel()
        }
    }, [debouncedSearch])

    return (
        <>
            <Tooltip title="Search for navigation">
                <div className={classNames(className, 'text-2xl cursor-pointer md:hidden xl:hidden block')} onClick={handleSearchOpen}>
                    <HiOutlineSearch />
                </div>
            </Tooltip>
            <div className="xl:block md:block hidden" onClick={handleSearchOpen}>
                <Input
                    type="search"
                    placeholder="Search Menu Items...."
                    className=" pr-10  w-full rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                transition-all duration-200"
                />
            </div>
            <Dialog
                contentClassName="p-2"
                isOpen={searchDialogOpen}
                width={800}
                onRequestClose={handleSearchClose}
                onClose={handleSearchClose}
            >
                <div className="p-5">
                    <div className="px-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center w-full">
                            <Input
                                ref={inputRef}
                                autoFocus
                                type="search"
                                placeholder="Search..."
                                className=" pr-10 py-3 w-full rounded-lg border border-gray-300 dark:border-gray-700 
                                bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                transition-all duration-200"
                                onChange={handleSearch}
                            />
                        </div>
                    </div>

                    <div className="py-6 px-5 max-h-[550px] overflow-y-auto">
                        {filteredData.map((item, index) => (
                            <ListItem
                                key={item.key}
                                icon={'docsIcon'}
                                label={item.title}
                                url={item.path}
                                isLast={index === filteredData.length - 1}
                                keyWord={inputRef.current?.value || ''}
                                onNavigate={handleNavigate}
                            />
                        ))}

                        {noResult && (
                            <div className="my-10 text-center text-lg text-gray-500">
                                No results for <span className="font-semibold">{inputRef.current?.value}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    )
}

const Search = withHeaderItem(_Search)
export default Search
