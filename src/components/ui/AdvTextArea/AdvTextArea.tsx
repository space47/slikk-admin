import React, { useState } from 'react'

const AdvTextArea: React.FC = () => {
    const [selectedFont, setSelectedFont] = useState('Arial')
    const [selectedColor, setSelectedColor] = useState('#000000')

    const execCmd = (command: string, value: string | null = null) => {
        document.execCommand(command, false, value)
    }

    const insertLink = () => {
        const url = prompt('Enter the URL:')
        execCmd('createLink', url)
    }

    return (
        <div className="w-4/5 max-w-3xl my-5 mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="bg-gray-800 p-3 flex justify-around flex-wrap">
                <button
                    onClick={() => execCmd('bold')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    <b>B</b>
                </button>
                <button
                    onClick={() => execCmd('italic')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    <i>I</i>
                </button>
                <button
                    onClick={() => execCmd('underline')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    <u>U</u>
                </button>
                <button
                    onClick={() => execCmd('strikeThrough')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    <s>S</s>
                </button>
                <button
                    onClick={() => execCmd('justifyLeft')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    Left
                </button>
                <button
                    onClick={() => execCmd('justifyCenter')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    Center
                </button>
                <button
                    onClick={() => execCmd('justifyRight')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    Right
                </button>
                <button
                    onClick={() => execCmd('insertUnorderedList')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    • List
                </button>
                <button
                    onClick={() => execCmd('insertOrderedList')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    1. List
                </button>
                <button
                    onClick={() => execCmd('outdent')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    Outdent
                </button>
                <button
                    onClick={() => execCmd('indent')}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    Indent
                </button>
                <select
                    onChange={(e) => {
                        setSelectedFont(e.target.value)
                        execCmd('fontName', e.target.value)
                    }}
                    value={selectedFont}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    <option value="Arial">Arial</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Work Sans">Work Sans</option>
                </select>
                <input
                    type="color"
                    onChange={(e) => {
                        setSelectedColor(e.target.value)
                        execCmd('foreColor', e.target.value)
                    }}
                    value={selectedColor}
                    className="bg-gray-600 p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                />
                <button
                    onClick={insertLink}
                    className="bg-gray-600 text-white p-2 m-1 cursor-pointer rounded transition duration-300 ease-in-out hover:bg-gray-500"
                >
                    Link
                </button>
            </div>
            <div
                id="editor"
                contentEditable="true"
                className="h-96 p-5 text-lg border-none outline-none resize-none overflow-y-auto bg-gray-200 text-gray-800"
            ></div>
        </div>
    )
}

export default AdvTextArea
