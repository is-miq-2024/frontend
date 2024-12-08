import { FC, useEffect, useState } from "react";
import { PageMap } from "@/components/PageMap";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// @ts-ignore
const convertCoordinates = (data) => {
    // @ts-ignore
    return data.map(point => [point.latitude, point.longitude]);
};

// @ts-ignore
const RoutePage: FC = () => {
    const [route, setRoute] = useState<any>(null);
    const { id } = useParams();
    const routeId = id;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchRouteData = async () => {
            try {
                const response = await fetch(`http://193.32.178.205:8080/route/${routeId}`);
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
    }, [routeId]);

    if (!route) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    return (<div>
        <button onClick={() => navigate('/')} style={{ margin: '16px' }}>Назад</button>
        <Card>

            <CardHeader>
                <CardTitle>{route.title}</CardTitle>
                <CardDescription>{route.description}</CardDescription>
            </CardHeader>

            <CardContent className="flex-grow">
                <h2 className="text-lg font-semibold text-gray-800">Recommendations:</h2>
                <ul className="list-disc list-inside text-gray-600">
                    {route.recommendations.map((rec: any, index: any) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>
            </CardContent>
            <PageMap coordinates={convertCoordinates(route.points)} />

            <CardFooter className="flex justify-between gap-2">
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
            </CardFooter>
        </Card >
    </div>
    );
};

export { RoutePage };
