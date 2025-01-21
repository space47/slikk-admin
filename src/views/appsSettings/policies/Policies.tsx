import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RichTextEditor } from '@/components/shared'
import { CONFIGOPTIONS } from './policiesCommon'
import { Dropdown, Button } from '@/components/ui'
import { BANNER_PAGE_NAME } from '@/common/banner'
import DropdownItem from '@/components/ui/Dropdown/DropdownItem'
import axioisInstance from '@/utils/intercepter/globalInterceptorSetup'
import { notification } from 'antd'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
    ClassicEditor,
    Alignment,
    AutoLink,
    Autosave,
    BlockQuote,
    Bold,
    Bookmark,
    Code,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontFamily,
    FontSize,
    FullPage,
    GeneralHtmlSupport,
    Heading,
    Highlight,
    HorizontalLine,
    HtmlComment,
    HtmlEmbed,
    Indent,
    IndentBlock,
    Italic,
    Link,
    Paragraph,
    RemoveFormat,
    ShowBlocks,
    SourceEditing,
    SpecialCharacters,
    Strikethrough,
    Subscript,
    Superscript,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Underline,
} from 'ckeditor5'

import 'ckeditor5/ckeditor5.css'

const LICENSE_KEY = import.meta.env.VITE_EDITOR_LICENSE

const Policies = () => {
    const [currentSelectedPage, setCurrentSelectedPage] = useState<Record<string, string>>(CONFIGOPTIONS[0])
    const [data, setData] = useState<string | null>(null)
    const [richTextValue, setRichTextValue] = useState('Hello')
    const editorContainerRef = useRef(null)
    const editorRef = useRef(null)
    const [isLayoutReady, setIsLayoutReady] = useState(false)
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        setIsReady(true)
    }, [])

    useEffect(() => {
        setIsLayoutReady(true)
        return () => setIsLayoutReady(false)
    }, [])

    const { editorConfig } = useMemo(() => {
        if (!isLayoutReady) {
            return {}
        }

        return {
            editorConfig: {
                toolbar: {
                    items: [
                        'sourceEditing',
                        'showBlocks',
                        '|',
                        'heading',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        '|',
                        'link',
                        'insertTable',
                        'highlight',
                        'blockQuote',
                        '|',
                        'alignment',
                        '|',
                        'outdent',
                        'indent',
                    ],
                    shouldNotGroupWhenFull: false,
                },
                plugins: [
                    Alignment,
                    AutoLink,
                    Autosave,
                    BlockQuote,
                    Bold,
                    Bookmark,
                    Code,
                    Essentials,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    FullPage,
                    GeneralHtmlSupport,
                    Heading,
                    Highlight,
                    HorizontalLine,
                    HtmlComment,
                    HtmlEmbed,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    Paragraph,
                    RemoveFormat,
                    ShowBlocks,
                    SourceEditing,
                    SpecialCharacters,
                    Strikethrough,
                    Subscript,
                    Superscript,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    Underline,
                ],
                fontFamily: {
                    supportAllValues: true,
                },
                fontSize: {
                    options: [10, 12, 14, 'default', 18, 20, 22],
                    supportAllValues: true,
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph',
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1',
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2',
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3',
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4',
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5',
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6',
                        },
                    ],
                },
                htmlSupport: {
                    allow: [
                        {
                            name: /^.*$/,
                            styles: true,
                            attributes: true,
                            classes: true,
                        },
                    ],
                },
                licenseKey: LICENSE_KEY,

                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file',
                            },
                        },
                    },
                },
                placeholder: 'Type or paste your content here!',
                table: {
                    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells', 'tableProperties', 'tableCellProperties'],
                },
            },
        }
    }, [isLayoutReady])

    const fetchData = async () => {
        console.log('Starting API call...')
        try {
            const response = await axioisInstance.get(`/page/config?page_name=${currentSelectedPage.value}`)
            console.log('API Response:', response)
            const responsedata = response.data?.data?.value || ''
            setData(responsedata)
            setRichTextValue(responsedata)
        } catch (error) {
            console.error('Error fetching data:', error)
            // notification.error({
            //     message: 'Failed to fetch data',
            //     description: error.message,
            // })
            setRichTextValue('')
            setData(null)
        }
    }

    useEffect(() => {
        fetchData()
    }, [currentSelectedPage])

    const handleSelect = (value: string) => {
        const selectedOption = CONFIGOPTIONS.find((option) => option.value === value)
        setCurrentSelectedPage({
            value,
            name: selectedOption?.label || '',
        })
    }

    const handlePolicySubmit = async () => {
        try {
            const body = {
                page_name: currentSelectedPage.value,
                value: richTextValue,
            }
            console.log('Submitting data:', body)
            await axioisInstance.post(`/page/config?page_name=${currentSelectedPage.value}`, body)
            notification.success({
                message: 'Successfully added',
            })
        } catch (error) {
            console.error('Error submitting policy:', error)
            notification.error({
                message: 'Failed to Upload',
            })
        }
    }

    return (
        <div className="flex flex-col gap-10">
            <div className="text-black text-lg font-semibold inline-flex w-auto">
                <Dropdown className="text-xl text-black" title={currentSelectedPage.value} onSelect={handleSelect}>
                    {CONFIGOPTIONS.map((item, key) => (
                        <DropdownItem key={key} eventKey={item.value}>
                            <span>{item.label}</span>
                        </DropdownItem>
                    ))}
                </Dropdown>
            </div>

            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div ref={editorRef}>
                        {isReady && (
                            <CKEditor
                                editor={ClassicEditor}
                                config={editorConfig}
                                data={richTextValue}
                                onChange={(event, editor) => {
                                    const data = editor.getData()
                                    setRichTextValue(data)
                                }}
                            />
                        )}
                    </div>
                </div>
            </div>

            <div className="policy_save_button">
                <Button variant="solid" color="indigo" size="sm" type="submit" onClick={handlePolicySubmit}>
                    Submit
                </Button>
            </div>

            <div className="flex flex-col gap-6 w-[80%] items-center flex-wrap justify-center mx-12">
                <span className="text-4xl font-bold flex justify-center">Preview</span>
                <div className="flex flex-col gap-4 justify-center" dangerouslySetInnerHTML={{ __html: richTextValue }} />
            </div>
        </div>
    )
}

export default Policies
