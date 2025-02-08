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
                <p><strong>Name:</strong> <span>${item?.product?.name ?? ''}</span></p>
                <p><strong>SKU:</strong> ${item?.product?.sku}</p>
                <p><strong>Color:</strong> ${item?.product?.color ?? ''}</p>
                <p><strong>Size:</strong> ${item?.product?.size}</p>
                <p><strong>Location:</strong> ${item?.location}</p>
                <p><strong>Barcode:</strong> ${item?.product?.barcode}</p>
                
            </div>
        `,
            )
            .join('')

        const printWindow = window.open('', '_blank', 'width=800,height=800')

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
                                    gap: 5px; 
                                }

                                .barcode-label {
                                    width: 180px;
                                    height: 80px;
                                    display: flex;
                                    flex-direction: column;
                                    text-align: center;
                                    font-size: 12px;
                                    background: white;
                                    margin: 5px; 
                                }

                                h3 {
                                    display: flex;
                                    align-items: start;
                                    font-size: 12px;
                                    font-weight: bold;
                                    margin: 0; 
                                }

                                p {
                                    margin: 1px 0;
                                    font-size: 12px;
                                    display: flex;
                                    flex-direction: row;
                                    margin-bottom: 2px; 
                                }
                                    span {
                                    max-width: 160px; 
                                    white-space: nowrap; 
                                    overflow: hidden; 
                                    text-overflow: ellipsis; 
                                    display: block;
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
