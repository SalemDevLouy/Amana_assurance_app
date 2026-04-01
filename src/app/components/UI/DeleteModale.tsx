"use client";
import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Modal, Button } from "@heroui/react"
import { FaCheck } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


interface DeleteQuestionModalProps {
  questionId: string;
  questionTxt :string;
  deleteQuestion: (questionId: string) => void;
}

const DeleteQuestionModal: React.FC<DeleteQuestionModalProps> = ({ questionId,questionTxt, deleteQuestion }) => {
  const [isOpen, setIsOpen] = useState(false);

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
    <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
      <Button
        onPress={() => setIsOpen(true)}
        className="bg-red-500 text-gray-200 flex justify-center items-center h-[35px] min-w-[35px] p-0 "
      >
        <MdDelete />
      </Button>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-[400px]">
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>Delete Question</Modal.Heading>
            </Modal.Header>
            <form onSubmit={handleDeleteQuestion}>
              <input type="hidden" name="questionId" value={questionId} />
              <Modal.Body>
                <p>Are you sure you want to delete this question ?</p>
                <p>{questionTxt}</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="outline" onPress={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button variant="secondary" type="submit" onPress={() => setIsOpen(false)}>
                  Delete
                </Button>
              </Modal.Footer>
            </form>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

export default DeleteQuestionModal;
