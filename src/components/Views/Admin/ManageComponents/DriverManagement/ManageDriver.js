import React, { useState, useEffect } from "react";
import axios from "axios";
import DriverModal from "./DriverModal";
import "./ManageDriver.css"; // Importing CSS specific to ManageDriver
import driverm from '../../../../../images/driverm.svg'
const ManageDriver = () => {
    const [drivers, setDrivers] = useState([]); // State to store the list of drivers
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentDriver, setCurrentDriver] = useState(null); // State to keep track of the driver currently being edited or added

    useEffect(() => {
        fetchDrivers();
    }, []);

    // Fetch the list of drivers from the backend
    const fetchDrivers = async () => {
        try {
            const response = await axios.get('http://localhost:8080/ClubCurry/driver/getAll'); 
            setDrivers(response.data); // Update state with fetched drivers
        } catch (error) {
            console.error("Error fetching drivers", error);
        }
    };

    // Delete a driver
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/ClubCurry/driver/delete/${id}`);
            setDrivers(drivers.filter(driver => driver.id !== id)); // Remove deleted driver from state
        } catch (error) {
            console.error("Error deleting driver", error);
        }
    };

    // Function to open the modal, optionally with a driver to edit
    const openModal = (driver = null) => {
        setCurrentDriver(driver);
        setIsModalOpen(true);
    };

    // Function to close the modal and reset the current driver
    const closeModal = () => {
        setCurrentDriver(null);
        setIsModalOpen(false);
    };

    // Handle form submission for both adding and updating drivers
    const handleFormSubmit = async (driverData) => {
        if (currentDriver) {
            // Update existing driver
            try {
                const response = await axios.put(`http://localhost:8080/ClubCurry/driver/update/${currentDriver.id}`, driverData);
                setDrivers(drivers.map(driver => driver.id === currentDriver.id ? response.data : driver)); // Update the driver in state
            } catch (error) {
                console.error("Error updating driver", error);
            }
        } else {
            // Add new driver
            try {
                const response = await axios.post('http://localhost:8080/ClubCurry/driver/save', driverData);
                setDrivers([...drivers, response.data]); // Add new driver to state
            } catch (error) {
                console.error("Error adding new driver", error);
            }
        }

        // Close modal and refresh the list of drivers
        closeModal();
    };

    return (
        <div className="manage-drivers-container">
            <img src={driverm} className="driver-table-image" alt="" />
            <button className="btn btn-primary mb-3" onClick={() => openModal()}>
                Add New Driver
            </button>
            <table className="driver-table w-100">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Surname</th>
                        <th>Username</th>
                        <th>Petrol Allowance</th>
                        <th>Registration ID</th>
                        <th>Model</th>
                        <th>Color</th>
                        <th>Make</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {drivers.map((driver) => (
                        <tr key={driver.id}>
                            <td>{driver.id}</td>
                            <td>{driver.name}</td>
                            <td>{driver.surname}</td>
                            <td>{driver.username}</td>
                            <td>{driver.petrolAllowance}</td>
                            <td>{driver.registration.id}</td>
                            <td>{driver.registration.model}</td>
                            <td>{driver.registration.color}</td>
                            <td>{driver.registration.make}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => openModal(driver)}>EDIT</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(driver.id)}>DELETE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <DriverModal
                isOpen={isModalOpen}
                onClose={closeModal}
                driver={currentDriver}
                onSubmit={handleFormSubmit} // Submit form with data to backend
            />
        </div>
    );
};

export default ManageDriver;
