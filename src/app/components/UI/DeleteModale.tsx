"use client";
import React, { FormEvent } from "react";
import { toast } from "sonner";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react"
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


interface DeleteQuestionModalProps {
  questionId: string;
  questionTxt :string;
  deleteQuestion: (questionId: string) => void;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({ questionId,questionTxt, deleteQuestion }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDeleteQuestion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await fetch(`../../api/bmc/${questionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Handle successful response and update UI
        deleteQuestion(questionId);
        toast("Successfully Deleted Question", {
          className: "bg-green-300",
          duration: 5000,
          position: "bottom-right",
          icon: <FaCheck />,
        });
      } else {
        console.error("Failed to delete question:", response.statusText);
        toast("Failed to Delete Question", {
          className: "bg-red-300",
          description: "Something went wrong",
          duration: 5000,
          position: "bottom-right",
        });
      }
    } catch (error) {
      console.error("Error deleting question:", error);
      toast("Failed to Delete Question", {
        className: "bg-red-300",
        description: "An error occurred",
        duration: 5000,
        position: "bottom-right",
        icon: <FaCheck />,
      });
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        className="bg-red-500 text-gray-200 flex justify-center items-center h-[35px] min-w-[35px] p-0 "
      >
        <MdDelete />

      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose: () => void) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Question</ModalHeader>
              <form onSubmit={handleDeleteQuestion}>
                <input type="hidden" name="questionId" value={questionId} />
                <ModalBody>
                  <p>Are you sure you want to delete this question ?</p>
                  <p>{questionTxt}</p>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button color="primary" type="submit" onPress={onClose}>
                    Delete
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteQuestionModal;
