import { notification } from 'antd'
import React from 'react'
import { BsFillPrinterFill } from 'react-icons/bs'

interface Props {
    dataForPrinter: any[]
}

const PrinterComp = ({ dataForPrinter }: Props) => {
    const generatePrint = () => {
        const checkForLocation = dataForPrinter?.some((item) => item?.location)
        if (!checkForLocation) {
            notification.error({
                message: 'No location found for this particular product',
            })
            return
        }

        const printContent = dataForPrinter
            .map(
                (item) => `
            <div class="barcode-label">
                <h3>${item?.product?.brand_name}</h3>
                <p><strong>Name:</strong> ${item?.product?.name ?? ''}</p>
                <p><strong>SKU:</strong> ${item?.product?.sku}</p>
                <p><strong>Color:</strong> ${item?.product?.color ?? ''}</p>
                <p><strong>Size:</strong> ${item?.product?.size}</p>
                <p><strong>Location:</strong> ${item?.location}</p>
                <div class="barcode">${item?.product?.barcode}</div>
            </div>
        `,
            )
            .join('')

        const printWindow = window.open('', '_blank', 'width=400,height=500')

        if (printWindow) {
            printWindow.document.open()
            printWindow.document.write(`
                 <html>
                    <head>
                        <title>''</title>
                        <style>
                            @media print {
                                body {
                                    display: flex;
                                    flex-wrap: wrap;
                                    font-family: Arial, sans-serif;
                                }
                                .barcode-label {
                                    width: 180px;
                                    height: 80px;
                                    display: flex;
                                    flex-direction: column;
                                    text-align: center;
                                    font-size: 14px;
                                    background: white;
                                    margin-left: 12px;
                                }
                            
                                h3 {
                                    display: flex;
                                    
                                    align-items: start;
                                    font-size: 12px;
                                    font-weight: bold;
                                }
                                p {
                                    margin: 1px 0;
                                    font-size: 14px;
                                    display:flex;
                                    flex-direction:row;
                                    gap: 2px;
                                    margin-bottom:10px;
                                }
                            }
                        </style>
                    </head>
                    <body>
                        ${printContent}
                    </body>
                </html>
            `)
            printWindow.document.close()
            printWindow.print()
        }
    }

    return (
        <div>
            <button className="px-4 py-2 bg-none text-gray-500 rounded hover:text-blue-600" onClick={generatePrint}>
                <BsFillPrinterFill className="text-3xl" />
            </button>
        </div>
    )
}

export default PrinterComp
