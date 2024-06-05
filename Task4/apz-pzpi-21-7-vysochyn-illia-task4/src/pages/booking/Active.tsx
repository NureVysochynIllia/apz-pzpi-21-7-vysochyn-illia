import axios from "axios";
import {useEffect, useState} from "react";

const Active: React.FC<{ texts: any }> = ({ texts }) => {
    const [rentals, setRentals] = useState<Booking[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchActiveRentals();
    }, []);

    const fetchActiveRentals = async () => {
        try {
            let jwt = localStorage["jwt"];
            if (!jwt) {
                return;
            }
            const response = await axios.get('http://localhost:5000/rent/active/', {
                headers: { Authorization: "Bearer " + jwt }
            });
            setRentals(response.data.bookings);
            setLoading(false);
        }catch (error:any) {
            console.error(error);
            setError(error.response.data.message);
        }
    };

    if (loading) {
        return <div>{texts.loading}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-bold mb-4">{texts.activeRentals}</h2>
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
                    {rentals.map((rental) => (
                        <tr key={rental._id}>
                            <td className="border px-4 py-2">{rental._id}</td>
                            <td className="border px-4 py-2">{new Date(rental.rentalTime.from).toLocaleString()}</td>
                            <td className="border px-4 py-2">{new Date(rental.rentalTime.to).toLocaleString()}</td>
                            <td className="border px-4 py-2">{rental.storageId.number}</td>
                            <td className="border px-4 py-2">{rental.price}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Active;