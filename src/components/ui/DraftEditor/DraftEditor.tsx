import React, { useState } from 'react'
import { Editor, EditorState, convertToRaw } from 'draft-js'
import 'draft-js/dist/Draft.css'

interface DraftEditorProps {
    value: string
    onChange: (value: string) => void
}

const DraftEditor: React.FC<DraftEditorProps> = ({ value, onChange }) => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

    const handleEditorChange = (newState: EditorState) => {
        setEditorState(newState)
        const contentState = newState.getCurrentContent()
        const rawContent = JSON.stringify(convertToRaw(contentState))
        onChange(rawContent)
    }

    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                minHeight: '200px',
            }}
        >
            <Editor editorState={editorState} onChange={handleEditorChange} />
        </div>
    )
}

export default DraftEditor
