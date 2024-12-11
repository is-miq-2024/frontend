import {FC, useEffect, useState} from "react";
import {PageMap} from "@/components/PageMap";
import {useNavigate, useParams} from "react-router-dom";
import {useUser} from "@/components/UserContext.tsx";
import {Star} from "lucide-react";

// @ts-ignore
const convertCoordinates = (data) => {
    // @ts-ignore
    return data.map(point => [point.latitude, point.longitude]);
};

// @ts-ignore
const RoutePage: FC = () => {
    const [route, setRoute] = useState<any>(null);
    const {id} = useParams();
    const routeId = id;

    const navigate = useNavigate();

    const {userLogin, userPassword} = useUser();

    const username = userLogin;
    const password = userPassword;

    const encodedCredentials = btoa(`${username}:${password}`);

    useEffect(() => {
        const fetchRouteData = async () => {
            try {
                const response = await fetch(`http://193.32.178.205:8080/route/${routeId}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Basic ${encodedCredentials}`,
                        },
                        mode: 'cors',
                    });
                if (!response.ok) {
                    throw new Error('Failed to fetch route data');
                }
                const data = await response.json();
                setRoute(data);
            } catch (error) {
                console.error('Error fetching route data:', error);
            }
        };

        fetchRouteData();
    }, [encodedCredentials, routeId]);

    if (!route) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    console.log(route)

    return (<div>
            <button onClick={() => navigate('/')} style={{margin: '16px'}}>Назад</button>
            <div className="max-w-3xl mx-auto p-6 bg-gray-400 shadow-md rounded-lg mt-10">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Title:</h2>
                    <h1 className="text-3xl font-semibold text-blue-600">{route.title}</h1>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Description:</h2>
                    <p className="text-gray-700">{route.description}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Recommendations:</h2>
                    <ul className="list-disc list-inside text-gray-600">
                        {route.recommendations.map((rec: any, index: any) => (
                            <li key={index}>{rec}</li>
                        ))}
                    </ul>
                </div>
                <PageMap coordinates={convertCoordinates(route.points)}/>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Duration:</h2>
                    <p className="text-gray-600">{route.durationInMinutes} minutes</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Difficulty:</h2>
                    <p className="text-gray-600">{route.difficulty}</p>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800">Type:</h2>
                    <p className="text-gray-600">{route.types.join(', ')}</p>
                </div>

                {route.comments.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Reviews:</h3>
                        <ul className="space-y-2">
                            {route.comments.map((review, index) => (
                                <li key={index} className="border-b pb-2">
                                    <div className="flex items-center space-x-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rate ? "text-yellow-400" : "text-gray-300"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-gray-700">{review.text}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export {RoutePage};
