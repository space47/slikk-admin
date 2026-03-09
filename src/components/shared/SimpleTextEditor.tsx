import { forwardRef } from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import 'react-quill/dist/quill.snow.css'

type RichTextEditorProps = ReactQuillProps

export type RichTextEditorRef = ReactQuill

const SimpleTextEditor = forwardRef<RichTextEditorRef, RichTextEditorProps>((props, ref) => {
    const modules = {
        toolbar: [['clean']],
    }

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'script',
        'indent',
        'align',
        'blockquote',
        'code-block',
        'link',
        'image',
        'video',
    ]

    return (
        <div className="rich-text-editor">
            <ReactQuill ref={ref} modules={modules} formats={formats} {...props} />
        </div>
    )
})

SimpleTextEditor.displayName = 'SimpleTextEditor'

export default SimpleTextEditor
