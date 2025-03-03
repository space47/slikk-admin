import JsBarcode from 'jsbarcode'

export const generatePrintingData = async (invoice: string, mode: string, status: string, total: number, amount: number) => {
    console.log(invoice, mode, status, total, amount)

    const canvas = document.createElement('canvas')
    JsBarcode(canvas, invoice, {
        height: 50,
        width: 1,
        displayValue: true,
    })
    const barcode = canvas.toDataURL()

    const printContent = `
        <div class="barcode-label">
            
            <p><strong>Mode:</strong> <span>${mode || ''}</span></p>
            <p><strong>Status:</strong> ${status}</p>
            <p><strong>Total Qty:</strong> ${total || ''}</p>
            <p><strong>Amount:</strong> ${amount}</p>
            <div> 
                <img src="${barcode}" alt="${invoice}" onload="window.imageLoaded()" />
            </div>
        </div>
    `

    const printWindow = window.open('', '_blank', 'width=800,height=800')

    if (printWindow) {
        printWindow.document.open()
        printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
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
                    <script>
                        let imagesToLoad = 1;
                        window.imageLoaded = function() {
                            imagesToLoad--;
                            if (imagesToLoad === 0) {
                                window.print();
                            }
                        };
                    </script>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `)
        printWindow.document.close()
    }
}
