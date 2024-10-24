import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingModal from './BookingModal'; // Import the BookingModal component
import './ManageBooking.css'; // Importing CSS specific to ManageBooking
import bookingm from '../../../../../images/bookingm.png'

const ManageBooking = () => {
    const [bookings, setBookings] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/ClubCurry/booking/getAll');
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/ClubCurry/booking/delete/${id}`);
            setBookings(bookings.filter(booking => booking.bookingId !== id));
        } catch (error) {
            console.error("Error deleting booking", error);
        }
    };

    const openModal = (booking = null) => {
        setCurrentBooking(booking);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setCurrentBooking(null);
        setIsModalOpen(false);
    };

    const handleFormSubmit = () => {
        fetchBookings(); // Refresh list after form submission
    };

    return (
        <div className="manage-bookings-container ">
            <img src={bookingm} className="booking-table-image" alt="" />
            <button className="btn btn-primary" onClick={() => openModal()}>
                Add New Booking
            </button>
            <table className="booking-table ">
                <thead>
                    <tr>
                        <th>Booking ID</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Table No</th>
                        <th>Section No</th>
                        <th>Status</th>
                        <th>Booked By Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((booking) => (
                        <tr key={booking.bookingId}>
                            <td>{booking.bookingId}</td>
                            <td>{booking.date}</td>
                            <td>{booking.time}</td>
                            <td>{booking.tableNo}</td>
                            <td>{booking.sectionNo}</td>
                            <td>{booking.status}</td>
                            <td>{booking.bookedBy.id}</td>
                            <td>
                                <button className="btn btn-warning mr-2" onClick={() => openModal(booking)}>EDIT</button>
                                <button className="btn btn-danger" onClick={() => handleDelete(booking.bookingId)}>DELETE</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <BookingModal
                isOpen={isModalOpen}
                onClose={closeModal}
                booking={currentBooking}
                onSubmit={handleFormSubmit}
            />
        </div>
    );
};

export default ManageBooking;
