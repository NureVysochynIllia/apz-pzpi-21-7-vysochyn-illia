import { useEffect, useState } from 'react';
import axios from "axios";


const History: React.FC<{ texts: any }> = ({ texts }) => {
    const [history, setHistory] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBookingHistory = async () => {
        try {
            let jwt = localStorage["jwt"];
            if (!jwt) {
                return;
            }
            const response = await axios.get('http://localhost:5000/rent/all/', {
                headers: { Authorization: "Bearer " + jwt }
            });
            setHistory(response.data.bookings);
            setLoading(false);
        } catch (error:any) {
            console.error(error);
            setError(error.response.data.message);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    if (loading) {
        return <div>{texts.loading}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">{texts.bookingHistory}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead>
                    <tr>
                        <th className="py-2 border bg-amber-400">{texts.id}</th>
                        <th className="py-2 border bg-amber-400">{texts.from}</th>
                        <th className="py-2 border bg-amber-400">{texts.to}</th>
                        <th className="py-2 border bg-amber-400">{texts.storageNumber}</th>
                        <th className="py-2 border bg-amber-400">{texts.price}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {history.map((booking) => (
                        <tr key={booking._id}>
                            <td className="border px-4 py-2">{booking._id}</td>
                            <td className="border px-4 py-2">{new Date(booking.rentalTime.from).toLocaleString()}</td>
                            <td className="border px-4 py-2">{new Date(booking.rentalTime.to).toLocaleString()}</td>
                            <td className="border px-4 py-2">{booking.storageId.number}</td>
                            <td className="border px-4 py-2">{booking.price}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;