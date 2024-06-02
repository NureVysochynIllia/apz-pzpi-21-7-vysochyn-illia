import {useEffect, useState} from "react";
import axios from "axios";
import HomeClusterItem from "../components/HomeClusterItem.tsx";

const Home: React.FC<{ texts: any,jwt:String }> = ({ texts ,jwt}) => {
    const [clusters, setClusters] = useState<Cluster[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchClusters = async () => {
            try {
                const res = await axios.get('http://localhost:5000/rent/', {
                    headers: {
                        Authorization: "Bearer " + jwt,
                        lang: "EN"
                    }
                });
                setClusters(res.data.availableClusters);
                setLoading(false);
            } catch (err) {
                setError(texts.loadError);
                setLoading(false);
            }
        };
        fetchClusters();
    }, [texts]);

    if (loading) {
        return <div>{texts.loading}</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }
    return (
        <div className="mx-auto  container p-4">
            <h2 className="text-3xl  font-bold mb-4">{texts.clusters}</h2>
            {clusters.map((cluster) => (
                <HomeClusterItem key={cluster._id} cluster={cluster} texts={texts}  jwt={jwt}/>
            ))}
        </div>
    );
};

export default Home;