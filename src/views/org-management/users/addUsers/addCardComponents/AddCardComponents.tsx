// import React from 'react'
// import { IoMdCloseCircle } from 'react-icons/io'
// import { Card } from 'antd'
// import Button from '@/components/ui/Button'

// const AddCardComponents = () => {
//   return (
//     <div className="">
//     <div className="flex justify-between">
//         {/* All Permissions */}
//         <Card className="overflow-y-scroll h-[560px] w-[400px] flex flex-col">
//             <div className="sticky top-0 z-10 bg-white">
//                 <div className="mb-3 bg-white">
//                     <input
//                         type="text"
//                         className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
//                         placeholder="Search Permissions"
//                         value={searchInput}
//                         onChange={handleSearch}
//                         onKeyDown={(e: any) => e.key === 'Enter' && e.preventDefault()}
//                     />
//                 </div>
//                 <label htmlFor="All Permissions" className="font-bold bg-white">
//                     All Permissions
//                 </label>
//             </div>
//             <div className="">
//                 {filteredPermission?.map((item) => (
//                     <div key={item.id} className="flex flex-col">
//                         <label className="bg-gray-100 px-2 py-2 flex items-center">
//                             <input
//                                 type="checkbox"
//                                 checked={selectedPermissions.includes(item.id)}
//                                 onChange={() => handlePermissionSelect(item.id)}
//                             />
//                             <span className="ml-2">{item.name}</span>
//                         </label>
//                     </div>
//                 ))}
//             </div>
//         </Card>

//         {/* Buttons */}
//         <div className="flex justify-center items-center flex-col gap-4">
//             <Button type="button" variant="accept" className="w-32 px-8" onClick={handleAddPermissions}>
//                 ADD {'>>'}
//             </Button>
//         </div>

//         {/* Added Permissions */}
//         <Card className="overflow-y-scroll h-[560px] w-[400px] flex flex-col">
//             <div className="sticky top-0 z-10 bg-white">
//                 <div className="mb-3 bg-white">
//                     <input
//                         type="text"
//                         value={addInput}
//                         onChange={handleAddPerm}
//                         className="border border-gray-200 w-[90%] h-8 items-center p-2 rounded-md active:border-0 hover:border-blue-500 active:border-blue-500"
//                         placeholder="Search Permissions"
//                     />
//                 </div>
//                 <label htmlFor="Added Permissions" className="font-bold bg-white">
//                     Added Permissions
//                 </label>
//             </div>
//             <div className="">
//                 {filteredAddPermission.map((item) => (
//                     <div key={item.id} className="flex flex-col">
//                         <div className="bg-gray-100 px-2 py-2 flex items-center justify-between">
//                             <span>{item.name}</span>
//                             <button className="text-red-500 ml-2" onClick={() => handleRemovePermissions(item.id)}>
//                                 <IoMdCloseCircle className="text-red-400" />
//                             </button>
//                         </div>
//                     </div>
//                 ))}
//             </div>
//         </Card>
//     </div>
// </div>
//   )
// }

// export default AddCardComponents
