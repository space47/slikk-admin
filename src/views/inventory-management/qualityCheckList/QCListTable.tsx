// import React, { useEffect, useState } from 'react'
// import axiosInstance from '@/utils/intercepter/globalInterceptorSetup'
// import { useNavigate } from 'react-router-dom'
// import moment from 'moment'
// import Table from '@/components/ui/Table'
// import Pagination from '@/components/ui/Pagination'
// import Select from '@/components/ui/Select'
// import Button from '@/components/ui/Button'

// type QCTABLE = {
//     {
//        id: 17,
//        last_updated_by: {
//            name:Parths Sundarka,
//            mobile:7978069951,
//            email:parthusun21@gmail.com
//         },
//        qc_done_by: {
//            name:Bipin Singh,
//            mobile:9818454888,
//            email:bipin.bloke@gmail.com
//         },
//        qc_number: null,
//        sku:CSMSSJEAN1041_36,
//        quantity_sent: 10,
//        quantity_received: 10,
//        images:nan,
//        qc_passed: 10,
//        qc_failed: 0,
//        batch_number:Batch_15,
//        sent_to_inventory: false,
//        inventory_sync_error: [],
//        create_date:2024-07-12T13:06:24.183429Z,
//        update_date:2024-07-12T13:06:24.183442Z,
//        grn: 4
//     }
// }

// type Option = {
//     value: number
//     label: string
// }

// const { Tr, Th, Td, THead, TBody } = Table

// const pageSizeOptions = [
//     { value: 10, label: '10 / page' },
//     { value: 25, label: '25 / page' },
//     { value: 50, label: '50 / page' },
//     { value: 100, label: '100 / page' },
// ]

// const QCListTable = () => {
//     const [data, setData] = useState<Product[]>([])
//     const [totalData, setTotalData] = useState(0)
//     const [page, setPage] = useState(1)
//     const [pageSize, setPageSize] = useState(10)
//     const [globalFilter, setGlobalFilter] = useState('')

//     const fetchData = async () => {
//         try {
//             const response = await axiosInstance.get('sub-category')
//             const data = response.data.data
//             const total = data.length
//             setData(data)
//             setTotalData(total)
//         } catch (error) {
//             console.error(error)
//         }
//     }

//     useEffect(() => {
//         fetchData()
//     }, [])

//     // Apply global filter
//     const filteredData = data.filter((item) =>
//         Object.values(item).some((val) =>
//             val
//                 ? val
//                       .toString()
//                       .toLowerCase()
//                       .includes(globalFilter.toLowerCase())
//                 : false,
//         ),
//     )

//     // Paginate filtered data
//     const paginatedData = filteredData.slice(
//         (page - 1) * pageSize,
//         page * pageSize,
//     )
//     const totalPages = Math.ceil(filteredData.length / pageSize)

//     const columns = [
//         { header: 'Name', accessor: 'name' },
//         {
//             header: 'Create Date',
//             accessor: 'create_date',
//             format: (value) => moment(value).format('YYYY-MM-DD'),
//         },
//         { header: 'Title', accessor: 'title' },
//         { header: 'Description', accessor: 'description' },
//         {
//             header: 'Image',
//             accessor: 'image',
//             format: (value) => <img src={value} alt="product" width="50" />,
//         },
//         { header: 'Footer', accessor: 'footer' },
//         { header: 'Quick Filter Tags', accessor: 'quick_filter_tags' },
//         { header: 'Position', accessor: 'position' },
//         { header: 'Gender', accessor: 'gender' },
//         {
//             header: 'Active',
//             accessor: 'is_active',
//             format: (value) => (value ? 'Yes' : 'No'),
//         },
//         {
//             header: 'Update Date',
//             accessor: 'update_date',
//             format: (value) => moment(value).format('YYYY-MM-DD'),
//         },
//         {
//             header: 'Try and Buy',
//             accessor: 'is_try_and_buy',
//             format: (value) => (value ? 'Yes' : 'No'),
//         },
//         { header: 'Last Updated By', accessor: 'last_updated_by' },
//         {
//             header: 'Action',
//             accessor: 'id',
//             format: (value) => (
//                 <Button onClick={() => handleActionClick(value)}>EDIT</Button>
//             ),
//         },
//     ]

//     const navigate = useNavigate()

//     const handleActionClick = (id: any) => {
//         navigate(`/app/category/subCategory/${id}`)
//     }

//     const handleSeller = () => {
//         navigate('/app/category/subCategory/addNew')
//     }

//     return (
//         <div>
//             <div className="flex items-end justify-end mb-2">
//                 <button
//                     className="bg-black text-white px-5 py-3 rounded-md hover:bg-gray-700"
//                     onClick={handleSeller}
//                 >
//                     ADD NEW SUB_CATEGORY
//                 </button>{' '}
//                 <br />
//                 <br />
//             </div>
//             <div className="mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search here"
//                     value={globalFilter}
//                     onChange={(e) => setGlobalFilter(e.target.value)}
//                     className="p-2 border rounded"
//                 />
//             </div>
//             <Table>
//                 <THead>
//                     <Tr>
//                         {columns.map((col) => (
//                             <Th key={col.header}>{col.header}</Th>
//                         ))}
//                     </Tr>
//                 </THead>
//                 <TBody>
//                     {paginatedData.map((row) => (
//                         <Tr key={row.id}>
//                             {columns.map((col) => (
//                                 <Td key={col.accessor}>
//                                     {col.format
//                                         ? col.format(row[col.accessor])
//                                         : row[col.accessor]}
//                                 </Td>
//                             ))}
//                         </Tr>
//                     ))}
//                 </TBody>
//             </Table>
//             <div className="flex items-center justify-between mt-4">
//                 <Pagination
//                     currentPage={page}
//                     total={totalPages}
//                     onChange={(page) => setPage(page)}
//                 />
//                 <div style={{ minWidth: 130 }}>
//                     <Select<Option>
//                         size="sm"
//                         isSearchable={false}
//                         value={pageSizeOptions.find(
//                             (option) => option.value === pageSize,
//                         )}
//                         options={pageSizeOptions}
//                         onChange={(option) =>
//                             setPageSize(Number(option?.value))
//                         }
//                     />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default QCListTable
