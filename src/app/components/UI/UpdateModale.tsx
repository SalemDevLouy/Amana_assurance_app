import React, { useState, FormEvent } from "react";
import {
  Modal, Input, Button
} from '@heroui/react'
import { FaEdit } from "react-icons/fa";

interface UpdateModalProps {
  id: string,
  full_name: string,
  email: string,
  phone_number: string,
}

export default function UpdateModal({ id, full_name, email, phone_number }: UpdateModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [nameVal, setNameVal] = useState(full_name);
  const [emailVal, setEmailVal] = useState(email);
  const [phoneVal, setPhoneVal] = useState(phone_number);

  // handle Update User 
  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault() // Prevent default form submission

    try {
      const response = await fetch(`../api/bmc`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: id,
            full_name: nameVal,
            email: emailVal,
            phone_number: phoneVal
          })
        })

      if (response.ok) {
        // Handle successful response and update from ui table
        console.log("Successfully updated");
        setIsOpen(false);
      } else {
        // Handle error response
        console.error('Failed to update user:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating user:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button onPress={() => setIsOpen(true)} className='bg-green-500 text-gray-200 block h-[35px] min-w-[35px] p-0'><FaEdit /></Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[450px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                Update <span className="text-blue-400 capitalize">{full_name}</span> Information
              </Modal.Heading>
            </Modal.Header>
            <form onSubmit={handleUpdate}>
              <Modal.Body>
                <Input name='userId' type="text" placeholder="Id"
                  className="max-w-xs"
                  value={id}
                  disabled
                />
                <Input name='userName' type="text" placeholder="User Name" className="max-w-xs" value={nameVal} onChange={(e) => setNameVal(e.target.value)} />
                <Input name='email' type="email" placeholder="Email" className="max-w-xs" value={emailVal} onChange={(e) => setEmailVal(e.target.value)} />
                <Input name='phoneNumber' type="tel" placeholder="Phone Number" className="max-w-xs" value={phoneVal} onChange={(e) => setPhoneVal(e.target.value)} />
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type='submit'>
                  Update
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}