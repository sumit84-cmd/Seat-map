// src/components/SeatBooking.jsx
'use client';

import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { data } from '../data/venue';

const SeatBooking = () => {
    const [venue, setVenue] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedVenue = localStorage.getItem('venueData');
            if (savedVenue) {
                try {
                    return JSON.parse(savedVenue);
                } catch (error) {
                    console.error('Error loading saved venue data:', error);
                }
            }
        }
        return data;
    });

    const [selectedSeats, setSelectedSeats] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedSelectedSeats = localStorage.getItem('selectedSeats');
            if (savedSelectedSeats) {
                try {
                    return JSON.parse(savedSelectedSeats);
                } catch (error) {
                    console.error('Error loading saved selected seats:', error);
                }
            }
        }
        return [];
    });

    const [zoom, setZoom] = useState(1);
    const [resetTrigger, setResetTrigger] = useState(0);

    // Price tiers
    const priceTiers = {
        1: 250,
        2: 350,
        3: 500
    };

    // Save venue data to localStorage whenever it changes
    useEffect(() => {
        // Don't save if we just reset
        if (resetTrigger > 0) {
            return;
        }
        localStorage.setItem('venueData', JSON.stringify(venue));
    }, [venue, resetTrigger]);

    // Save selected seats to localStorage whenever they change
    useEffect(() => {
        // Don't save if we just reset
        if (resetTrigger > 0) {
            return;
        }
        localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
    }, [selectedSeats, resetTrigger]);

    // Reset the reset trigger after a short delay
    useEffect(() => {
        if (resetTrigger > 0) {
            const timer = setTimeout(() => {
                setResetTrigger(0);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [resetTrigger]);

    const getSeatColor = (status, priceTier) => {
        switch (status) {
            case 'available':
                return `bg-green-500 hover:bg-green-600 border-green-600 ${priceTier === 1 ? 'border-2' :
                    priceTier === 2 ? 'border-yellow-400 border-2' :
                        'border-purple-500 border-2'
                    }`;
            case 'sold':
                return 'bg-gray-500 cursor-not-allowed border-gray-600';
            case 'reserved':
                return 'bg-yellow-500 cursor-not-allowed border-yellow-600';
            case 'held':
                return 'bg-blue-500 cursor-not-allowed border-blue-600';
            default:
                return 'bg-gray-300 border-gray-400';
        }
    };

    const getSeatIcon = (status) => {
        switch (status) {
            case 'available':
                return '💺';
            case 'sold':
                return '❌';
            case 'reserved':
                return '⏳';
            case 'held':
                return '🔒';
            default:
                return '💺';
        }
    };

    const handleSeatClick = async (seat) => {
        if (seat.status !== 'available') {
            Swal.fire({
                title: 'Seat Not Available',
                text: 'This seat is already taken or reserved',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const isSelected = selectedSeats.some(s => s.id === seat.id);

        if (isSelected) {
            setSelectedSeats(prev => prev.filter(s => s.id !== seat.id));
        } else {
            if (selectedSeats.length >= 8) {
                Swal.fire({
                    title: 'Maximum Seats Reached',
                    text: 'You can only select up to 8 seats at a time',
                    icon: 'warning',
                    confirmButtonColor: '#3085d6',
                });
                return;
            }

            // Show seat details popup
            const result = await Swal.fire({
                title: 'Seat Details',
                html: `
                    <div class="text-left">
                        <div class="bg-gray-100 p-4 rounded-lg mb-4">
                            <h4 class="font-bold text-lg mb-2">${seat.id}</h4>
                            <div class="space-y-1 text-sm">
                                <p><strong>Row:</strong> ${seat.id.split('-')[1]}</p>
                                <p><strong>Seat:</strong> ${seat.id.split('-')[2]}</p>
                                <p><strong>Section:</strong> ${seat.id.split('-')[0]}</p>
                                <p><strong>Price:</strong> ₹${priceTiers[seat.priceTier]}</p>
                                <p><strong>Type:</strong> ${seat.priceTier === 1 ? 'Standard' : seat.priceTier === 2 ? 'Premium' : 'VIP'}</p>
                            </div>
                        </div>
                        <p class="text-gray-600">Do you want to reserve this seat?</p>
                    </div>
                `,
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Reserve Now',
                cancelButtonText: 'Cancel',
                focusConfirm: false,
                allowEscapeKey: true,
                allowOutsideClick: true
            });

            if (result.isConfirmed) {
                setSelectedSeats(prev => [...prev, seat]);

                // Show success message
                Swal.fire({
                    title: 'Seat Reserved!',
                    text: `${seat.id} has been added to your selection`,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    timer: 1500
                });
            }
        }
    };

    const calculateTotal = () => {
        return selectedSeats.reduce((total, seat) => total + priceTiers[seat.priceTier], 0);
    };

    const handleBooking = async () => {
        if (selectedSeats.length === 0) {
            Swal.fire({
                title: 'No Seats Selected',
                text: 'Please select at least one seat to continue',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Confirm Booking',
            html: `
                <div class="text-left">
                    <p class="mb-2">You are booking ${selectedSeats.length} seat(s):</p>
                    <ul class="list-disc list-inside mb-4">
                        ${selectedSeats.map(seat => `<li>${seat.id} - ₹${priceTiers[seat.priceTier]}</li>`).join('')}
                    </ul>
                    <p class="font-bold">Total: ₹${calculateTotal()}</p>
                    <p class="text-sm text-gray-600 mt-2">Your selection will be saved for 24 hours.</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirm Booking',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            // Update seat status to reserved
            const updatedVenue = { ...venue };
            updatedVenue.sections.forEach(section => {
                section.rows.forEach(row => {
                    row.seats.forEach(seat => {
                        if (selectedSeats.some(s => s.id === seat.id)) {
                            seat.status = 'reserved';
                        }
                    });
                });
            });

            setVenue(updatedVenue);

            Swal.fire({
                title: 'Booking Confirmed!',
                html: `
                    <div class="text-center">
                        <p class="mb-2">Your ${selectedSeats.length} seat(s) have been successfully reserved!</p>
                        <p class="font-bold text-lg">Total: ₹${calculateTotal()}</p>
                        <p class="text-sm text-gray-600 mt-2">Your reservation is saved in your browser.</p>
                    </div>
                `,
                icon: 'success',
                confirmButtonColor: '#3085d6',
            });

            setSelectedSeats([]);
        }
    };

    const handlePayment = async () => {
        if (selectedSeats.length === 0) {
            Swal.fire({
                title: 'No Seats Selected',
                text: 'Please select at least one seat to continue',
                icon: 'warning',
                confirmButtonColor: '#3085d6',
            });
            return;
        }

        const totalAmount = calculateTotal();

        // Show payment confirmation
        const paymentResult = await Swal.fire({
            title: 'Confirm Payment',
            html: `
                <div class="text-left">
                    <p class="mb-3">You are about to pay for ${selectedSeats.length} seat(s):</p>
                    <div class="bg-gray-100 p-3 rounded-lg mb-4 max-h-40 overflow-y-auto">
                        ${selectedSeats.map(seat => `
                            <div class="flex justify-between items-center py-1 border-b border-gray-200">
                                <span>${seat.id}</span>
                                <span class="font-bold">₹${priceTiers[seat.priceTier]}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="flex justify-between items-center font-bold text-lg border-t pt-3">
                        <span>Total Amount:</span>
                        <span>₹${totalAmount}</span>
                    </div>
                    <p class="text-sm text-gray-600 mt-3">Seats will be permanently booked after payment.</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Proceed to Pay',
            cancelButtonText: 'Cancel',
            focusConfirm: false
        });

        if (paymentResult.isConfirmed) {
            // Simulate payment processing
            const loadingSwal = Swal.fire({
                title: 'Processing Payment...',
                text: 'Please wait while we process your payment',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Simulate API call delay
            setTimeout(async () => {
                await loadingSwal.close();

                // Update seat status to sold
                const updatedVenue = { ...venue };
                updatedVenue.sections.forEach(section => {
                    section.rows.forEach(row => {
                        row.seats.forEach(seat => {
                            if (selectedSeats.some(s => s.id === seat.id)) {
                                seat.status = 'sold';
                            }
                        });
                    });
                });

                setVenue(updatedVenue);

                // Show payment success
                Swal.fire({
                    title: 'Payment Successful!',
                    html: `
                        <div class="text-center">
                            <div class="text-6xl mb-4">🎉</div>
                            <p class="mb-2">Your payment of <strong>₹${totalAmount}</strong> was successful!</p>
                            <p class="text-sm text-gray-600">Your tickets have been confirmed and saved.</p>
                        </div>
                    `,
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                });

                setSelectedSeats([]);
            }, 2000);
        }
    };

    const clearSelection = () => {
        setSelectedSeats([]);
        Swal.fire({
            title: 'Selection Cleared',
            text: 'All selected seats have been removed',
            icon: 'info',
            confirmButtonColor: '#3085d6',
            timer: 1500
        });
    };

    const clearAllData = () => {
        Swal.fire({
            title: 'Clear All Data?',
            text: 'This will reset all seats to available and clear your selections. This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Clear All',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                // Clear localStorage first
                localStorage.removeItem('venueData');
                localStorage.removeItem('selectedSeats');

                // Set reset trigger to prevent saving default data back to localStorage
                setResetTrigger(prev => prev + 1);

                // Reset state to default values
                setVenue(data);
                setSelectedSeats([]);

                Swal.fire({
                    title: 'Data Cleared!',
                    text: 'All seat data has been reset to default',
                    icon: 'success',
                    confirmButtonColor: '#3085d6',
                    timer: 2000
                });
            }
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">🎬 Metropolis Arena</h1>
                    <p className="text-xl text-gray-300">Book Your Perfect Seats</p>
                    <p className="text-sm text-gray-400 mt-1">Your selections are automatically saved</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Legend and Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Venue Info */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Venue Information</h3>
                            <div className="space-y-2 text-gray-300">
                                <p>🏟️ {venue.name}</p>
                                <p>📍 Section A - Premium</p>
                                <p>👥 Capacity: 35 seats</p>
                                <p>💾 Auto-save: Enabled</p>
                            </div>
                        </div>

                        {/* Seat Legend */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Seat Status</h3>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-green-500 rounded-lg border-2 border-green-600"></div>
                                    <span className="text-gray-300">Available</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-gray-500 rounded-lg border border-gray-600"></div>
                                    <span className="text-gray-300">Sold</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-yellow-500 rounded-lg border border-yellow-600"></div>
                                    <span className="text-gray-300">Reserved</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-blue-500 rounded-lg border border-blue-600"></div>
                                    <span className="text-gray-300">Held</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-6 h-6 bg-purple-500 rounded-lg border-2 border-purple-400"></div>
                                    <span className="text-gray-300">Selected</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Legend */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Price Tiers</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-green-500 rounded border-2 border-green-600"></div>
                                        <span className="text-gray-300">Standard</span>
                                    </div>
                                    <span className="text-white font-bold">₹250</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-green-500 rounded border-2 border-yellow-400"></div>
                                        <span className="text-gray-300">Premium</span>
                                    </div>
                                    <span className="text-white font-bold">₹350</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-4 h-4 bg-green-500 rounded border-2 border-purple-500"></div>
                                        <span className="text-gray-300">VIP</span>
                                    </div>
                                    <span className="text-white font-bold">₹500</span>
                                </div>
                            </div>
                        </div>

                        {/* Storage Controls */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            <h3 className="text-xl font-bold text-white mb-4">Data Management</h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-300">Auto-save</span>
                                    <span className="text-green-400 font-bold">Active</span>
                                </div>
                                <button
                                    onClick={clearAllData}
                                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold"
                                >
                                    🗑️ Reset All Data
                                </button>
                                <p className="text-xs text-gray-400 text-center">
                                    This will clear all reservations and bookings
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Seating Map */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                            {/* Controls */}
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Select Your Seats</h2>
                                <div className="flex items-center space-x-4">
                                    <span className="text-white bg-blue-600 px-3 py-1 rounded-full text-sm">
                                        Selected: {selectedSeats.length}/8
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            🔍 Zoom In
                                        </button>
                                        <button
                                            onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            🔍 Zoom Out
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Screen */}
                            <div className="mb-8 text-center">
                                <div className="bg-linear-to-r from-gray-400 to-gray-600 h-4 rounded-lg mx-auto max-w-2xl mb-2"></div>
                                <p className="text-white font-semibold">🎭 STAGE / SCREEN 🎭</p>
                            </div>

                            {/* Seating Map */}
                            <div className="overflow-auto bg-gray-900/50 rounded-xl p-8 border border-white/10">
                                <div
                                    className="relative mx-auto"
                                    style={{
                                        width: `${venue.map.width * zoom}px`,
                                        height: `${venue.map.height * zoom}px`,
                                        maxWidth: '100%'
                                    }}
                                >
                                    {venue.sections.map(section => (
                                        <div key={section.id} className="relative">
                                            <div className="text-center mb-4">
                                                <h3 className="text-xl font-bold text-white bg-blue-600/50 inline-block px-6 py-2 rounded-full">
                                                    {section.label}
                                                </h3>
                                            </div>

                                            {section.rows.map(row => (
                                                <div key={row.index} className="flex justify-center items-center mb-4">
                                                    <div className="w-12 text-right pr-4">
                                                        <span className="text-white font-bold bg-gray-700 px-2 py-1 rounded">
                                                            Row {row.index}
                                                        </span>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        {row.seats.map(seat => {
                                                            const isSelected = selectedSeats.some(s => s.id === seat.id);
                                                            return (
                                                                <button
                                                                    key={seat.id}
                                                                    onClick={() => handleSeatClick(seat)}
                                                                    disabled={seat.status !== 'available'}
                                                                    className={`
                                                                        w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm
                                                                        transition-all duration-200 transform hover:scale-110
                                                                        ${isSelected
                                                                            ? 'bg-purple-600 border-2 border-purple-400 shadow-lg shadow-purple-500/50'
                                                                            : getSeatColor(seat.status, seat.priceTier)
                                                                        }
                                                                        ${seat.status === 'available' ? 'cursor-pointer hover:shadow-lg' : 'cursor-not-allowed'}
                                                                    `}
                                                                    style={{
                                                                        transform: `scale(${zoom})`,
                                                                        margin: `${4 * zoom}px`
                                                                    }}
                                                                    title={`${seat.id} - ₹${priceTiers[seat.priceTier]} - ${seat.status}`}
                                                                >
                                                                    {isSelected ? '⭐' : getSeatIcon(seat.status)}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Seats Summary */}
                            {selectedSeats.length > 0 && (
                                <div className="mt-6 bg-linear-to-r from-purple-600 to-blue-600 rounded-xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-4">Selected Seats</h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-white mb-2">Seats ({selectedSeats.length}/8):</p>
                                            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
                                                {selectedSeats.map(seat => (
                                                    <span
                                                        key={seat.id}
                                                        className="bg-white/20 px-3 py-1 rounded-full text-white font-bold text-sm"
                                                    >
                                                        {seat.id} - ₹{priceTiers[seat.priceTier]}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-white">
                                                Total: ₹{calculateTotal()}
                                            </p>
                                            <div className="flex space-x-3 mt-3 justify-end">
                                                <button
                                                    onClick={clearSelection}
                                                    className="px-6 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                                                >
                                                    Clear Selection
                                                </button>
                                                <button
                                                    onClick={handleBooking}
                                                    className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold"
                                                >
                                                    ⏳ Reserve
                                                </button>
                                                <button
                                                    onClick={handlePayment}
                                                    className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold shadow-lg"
                                                >
                                                    💳 Pay Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatBooking;