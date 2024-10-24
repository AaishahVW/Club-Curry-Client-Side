import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeModal from "./EmployeeModal";
import "./ManageEmployee.css"; // CSS specific to ManageEmployee
import employeem from '../../../../../images/employeem.png'

const ManageEmployee = () => {
    const [employees, setEmployees] = useState([]); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await axios.get('http://localhost:8080/ClubCurry/generalStaff/getAll');
            setEmployees(response.data); 
        } catch (error) {
            console.error("Error fetching employees", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/ClubCurry/generalStaff/delete/${id}`);
            setEmployees(employees.filter(employee => employee.id !== id));
        } catch (error) {
            console.error("Error deleting employee", error);
        }
    };

    const openModal = (employee = null) => {
        setCurrentEmployee(employee);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentEmployee(null);
        setIsModalOpen(false);
    };

    const handleFormSubmit = () => {
        fetchEmployees();
    };

    return (
        <div className="manage-employees-container">
            <img src={employeem} className="employee-table-image" />
            <button className="btn btn-primary mb-3" onClick={() => openModal()}>
                Add New Employee
            </button>
            <table className="employee-table w-100">
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
                    {employees.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.surname}</td>
                            <td>{employee.username}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => openModal(employee)}>EDIT</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(employee.id)}>DELETE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <EmployeeModal
                isOpen={isModalOpen}
                onClose={closeModal}
                employee={currentEmployee}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default ManageEmployee;
