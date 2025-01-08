import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedGarages from '../components/RelatedGarages';
import axios from 'axios';
import { toast } from 'react-toastify';

const Appointment = () => {
    const { garId } = useParams();
    const { garages, currencySymbol, backendUrl, token, getGarsData } = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const [garInfo, setGarInfo] = useState(null);
    const [garSlots, setGarSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const navigate = useNavigate();

    const fetchGarInfo = async () => {
        const foundGarInfo = garages.find((gar) => gar._id === garId);
        if (foundGarInfo) {
            setGarInfo(foundGarInfo);
        } else {
            toast.error('Garage not found');
            navigate('/'); // Redirect if garage not found
        }
    };

    const getAvailableSlots = async () => {
        if (!garInfo) return;

        setGarSlots([]);
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);

            const endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);

            if (i === 0) {
                currentDate.setHours(Math.max(currentDate.getHours() + 1, 10));
                currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
            } else {
                currentDate.setHours(10, 0, 0, 0);
            }

            const timeSlots = [];
            while (currentDate < endTime) {
                const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
                const isSlotAvailable =
                    !garInfo.slots_booked?.[slotDate]?.includes(formattedTime);

                if (isSlotAvailable) {
                    timeSlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                    });
                }
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }

            setGarSlots((prev) => [...prev, timeSlots]);
        }
    };
 
    const bookAppointment = async () => {
        if (!token) {
            toast.warning('Login to book an appointment');
            return navigate('/login');
        }
    
        const date = garSlots[slotIndex]?.[0]?.datetime;
        if (!date) {
            toast.error('No slot selected.');
            return;
        }
    
        const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;
    
        const payload = {
            userId: garInfo.userId, // Add userId from context or state
            garId,
            slotDate,
            slotTime,
        };
    
        try {
            const { data } = await axios.post(
                `http://localhost:4000/api/user/book-appointment`,
                payload,
                { headers: { token } }
            );
    
            if (data.success) {
                toast.success(data.message);
                getGarsData(); // Refresh garage data
                navigate('/my-appointments');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };
    

    useEffect(() => {
        if (garages.length > 0) {
            fetchGarInfo();
        }
    }, [garages, garId]);

    useEffect(() => {
        if (garInfo) {
            getAvailableSlots();
        }
    }, [garInfo]);

    return garInfo ? (
        <div>
            {/* Garage Details */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div>
                    <img
                        className="bg-primary w-full sm:max-w-72 rounded-lg"
                        src={garInfo.image}
                        alt={garInfo.name}
                    />
                </div>
                <div className="flex-1 border border-[#ADADAD] rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
                    <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
                        {garInfo.name}
                        <img className="w-5" src={assets.verified_icon} alt="Verified" />
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <p>
                            {garInfo.degree} - {garInfo.speciality}
                        </p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">
                            {garInfo.experience}
                        </button>
                    </div>
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-[#262626] mt-3">
                            About
                            <img className="w-3" src={assets.info_icon} alt="Info" />
                        </p>
                        <p className="text-sm text-gray-600 max-w-[700px] mt-1">
                            {garInfo.about}
                        </p>
                    </div>
                    <p className="text-gray-600 font-medium mt-4">
                        Appointment fee:{' '}
                        <span className="text-gray-800">
                            {currencySymbol}
                            {garInfo.fees}
                        </span>
                    </p>
                </div>
            </div>

            {/* Booking Slots */}
            <div className="sm:ml-72 sm:pl-4 mt-8 font-medium text-[#565656]">
                <p>Booking slots</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {garSlots.map((item, index) => (
                        <div
                            onClick={() => setSlotIndex(index)}
                            key={index}
                            className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                                slotIndex === index
                                    ? 'bg-primary text-white'
                                    : 'border border-[#DDDDDD]'
                            }`}
                        >
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {garSlots[slotIndex]?.map((item, index) => (
                        <p
                            onClick={() => setSlotTime(item.time)}
                            key={index}
                            className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                                item.time === slotTime
                                    ? 'bg-primary text-white'
                                    : 'text-[#949494] border border-[#B4B4B4]'
                            }`}
                        >
                            {item.time.toLowerCase()}
                        </p>
                    ))}
                </div>
                <button
                    onClick={bookAppointment}
                    className="bg-primary text-white text-sm font-light px-20 py-3 rounded-full my-6"
                >
                    Book an appointment
                </button>
            </div>

            {/* Related Garages */}
            <RelatedGarages speciality={garInfo.speciality} garId={garId} />
            </div>
    ) : null;
};

export default Appointment;
