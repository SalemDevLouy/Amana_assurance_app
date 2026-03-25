// import React,{useState,FormEvent} from "react";
// import {
//   Modal, ModalContent, ModalHeader,Input,
//   ModalBody, ModalFooter, Button, useDisclosure
// } from '@heroui/react'
// import { FaEdit } from "react-icons/fa";
// interface updateProp{
//   id:string,
//   full_name:string,
//   email: string,
//   phone_number: string,
// }
// export default function UpdateModal({question}:updateProp) {
//   const {isOpen, onOpen, onOpenChange} = useDisclosure();
//   const [nameVal, setNameVal] = useState(user.full_name);
//   const [emailVal, setEmailVal] = useState(user.email);
//   const [phoneVal, setPhoneVal] = useState(user.phone_number);

// // handle Update User 
//   const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
//     event.preventDefault() // Prevent default form submission

//     try {
//       const response = await fetch(`../api/bmc`,
//         {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json'
//           },
//           body: JSON.stringify({
//           id: question.id,
//           full_name: nameVal,
//           email: emailVal,
//           phone_number: phoneVal
//         })
//       })

//       if (response.ok) {
//         // Handle successful response and delete from ui table
//         console.log("Successfully deleted");
        
//       } else {
//         // Handle error response
//         console.error('Failed to delete user:', response.statusText)
//       }
//     } catch (error) {
//       console.error('Error deleting user:', error)
//     }
//   }

//   return (
//     <>
//       <Button onPress={onOpen} className='bg-green-500 text-gray-200 block h-[35px] min-w-[35px] p-0'><FaEdit/></Button>
//       <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
//         <ModalContent>
//           {(onClose) => (
//             <>
//               <ModalHeader className=" gap-1">Update
//                 <span className=" inline text-blue-400 capitalize" >{user.full_name}</span>
//                 Information</ModalHeader>
//               <form onSubmit={handleUpdate}>
//               <ModalBody>
//                 <Input size='sm' name='userId' type="text" label="Id" 
//                 className="max-w-xs" 
//                 value={user.id} 
//                 />
//                 <Input size='sm' name='userName' type="text" label="User Name" className="max-w-xs" value={nameVal} onChange={(e) => setNameVal(e.target.value)}/>
//                   <Input size='sm' name='email' type="email" label="Email" className="max-w-xs" value={emailVal} onChange={(e) => setEmailVal(e.target.value)}/>
//                   <Input size='sm' name='phoneNumber' type="tel" label="Phone Number" className="max-w-xs" value={phoneVal} onChange={(e) => setPhoneVal(e.target.value)}/>
//               </ModalBody>
//               <ModalFooter>
//                 <Button color="danger" variant="light" onPress={onClose}>
//                   Cancel
//                 </Button>
//                 <Button color="primary" type='submit' onPress={onClose}>
//                   Update
//                 </Button>
//                 </ModalFooter>
//               </form>
//             </>
//           )}
//         </ModalContent>
//       </Modal>
//     </>
//   );
// }