import { Modal, ModalBody, ModalHeader, Button } from "flowbite-react";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from 'react-hot-toast';

import axiosInstance from "../lib/axios";

const DeleteModal = ({ taskId, onDeleteSuccess }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axiosInstance.delete(`/task/delete/${taskId}`);
      if (response.data.success) {
        window.location.reload(); 
        toast.success("Task deleted successfully");
        setOpenModal(false);
        if (onDeleteSuccess) onDeleteSuccess(taskId);  
      }
    } catch (error) {
      console.warn("Error while deleting task", error);
      toast.error("Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button className="bg-red-700 w-20 h-8 text-white flex justify-center items-center rounded " onClick={() => setOpenModal(true)}><Trash2 size={18} /> Delete</button>
      <Modal show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="red" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Yes, I'm sure"}
              </Button>
              <Button color="alternative" onClick={() => setOpenModal(false)} disabled={isDeleting}>
                No, cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default DeleteModal;
