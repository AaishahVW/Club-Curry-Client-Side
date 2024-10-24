import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminModal from "./AdminModal";
import "./ManageAdmin.css"; // Importing CSS specific to ManageAdmin
import adminm from '../../../../../images/adminm.svg'

const ManageAdmin = () => {
    const [admins, setAdmins] = useState([]); // State to store the list of admins
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentAdmin, setCurrentAdmin] = useState(null); // State to keep track of the admin currently being edited or added

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get('http://localhost:8080/ClubCurry/admin/getAll'); 
            setAdmins(response.data); // Update state with fetched admins
        } catch (error) {
            console.error("Error fetching admins", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/ClubCurry/admin/delete/${id}`);
            setAdmins(admins.filter(admin => admin.id !== id)); // Remove deleted admin from state
        } catch (error) {
            console.error("Error deleting admin", error);
        }
    };

    // Function to open the modal, optionally with an admin to edit
    const openModal = (admin = null) => {
        setCurrentAdmin(admin);
        setIsModalOpen(true);
    };

    // Function to close the modal and reset the current admin
    const closeModal = () => {
        setCurrentAdmin(null);
        setIsModalOpen(false);
    };

    const handleFormSubmit = () => {
        fetchAdmins(); // Refresh list after form submission
    };

    return (
        <div className="manage-admins-container">
            <img src={adminm} className="admin-table-image" alt="" />
            <button className="btn btn-primary mb-3" onClick={() => openModal()}>
                Add New Admin
            </button>
            <table className="admin-table w-100">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Username</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{admin.name}</td>
                            <td>{admin.surname}</td>
                            <td>{admin.username}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => openModal(admin)}>EDIT</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(admin.id)}>DELETE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <AdminModal
                isOpen={isModalOpen}
                onClose={closeModal}
                admin={currentAdmin}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default ManageAdmin;
