/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GenericCommonTypes {
    // Input Event (e.g., for input, textarea, select)
    InputEvent: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

    // Change Event (e.g., for dropdowns, checkboxes, radios)
    ChangeEventCommon: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>

    // Mouse Events (e.g., button clicks)
    MouseEvent: React.MouseEvent<HTMLButtonElement | HTMLDivElement>

    // Click Event
    ClickEvent: React.MouseEvent<HTMLElement>

    // Submit Event (e.g., for forms)
    SubmitEvent: React.FormEvent<HTMLFormElement>

    // Focus Event (e.g., for focusing on input fields)
    FocusEvent: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

    // Blur Event (e.g., when input loses focus)
    BlurEvent: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>

    // Keyboard Event (e.g., for capturing keypress, keydown, keyup)
    KeyboardEvent: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>

    // Drag Events
    DragEvent: React.DragEvent<HTMLElement>

    // Clipboard Event (e.g., for copy-paste actions)
    ClipboardEvent: React.ClipboardEvent<HTMLInputElement | HTMLTextAreaElement>

    // Form Event
    FormEvent: React.FormEvent<HTMLFormElement>

    // Scroll Event
    ScrollEvent: React.UIEvent<HTMLElement>

    // Context Menu Event (e.g., for right-click menu)
    ContextMenuEvent: React.MouseEvent<HTMLElement>

    // Touch Events (for mobile interactions)
    TouchEvent: React.TouchEvent<HTMLElement>
}

export const handleDownloadCsv = (
    data: any[],
    columns: any[],
    convertToCSV: (data: any[], columns: any[]) => string,
    filename = 'riderData.csv',
) => {
    const csvData = convertToCSV(data, columns)
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
}

export const escapeCsvValue = (value: any) => {
    if (value == null) return ''
    const stringValue = String(value)
    return `"${stringValue.replace(/"/g, '""')}"`
}
