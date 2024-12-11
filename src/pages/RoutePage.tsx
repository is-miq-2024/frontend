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
            const userLogin = localStorage.getItem('userLogin');
            const userPassword = localStorage.getItem('userPassword');
            const credentials = btoa(`${userLogin}:${userPassword}`);
            try {
                const response = await fetch(`http://193.32.178.205:8080/route/${routeId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${credentials}`,
                    },
                })
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

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray rounded-lg shadow-md">
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

                <CardFooter className="flex flex-col items-start sm:flex-row sm:justify-between gap-2">
                    <div className="mb-6">
                        <h2 className="scroll-m-20 border-b text-lg font-semibold tracking-tight first:mt-0">
                            Продолжительность
                        </h2>
                        <p className="leading-7">
                            {route.durationInMinutes} минут
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="scroll-m-20 border-b text-lg font-semibold tracking-tight first:mt-0">
                            Сложность</h2>
                        <p className="leading-7">
                            {route.difficulty}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="scroll-m-20 border-b text-lg font-semibold tracking-tight first:mt-0">
                            Тип
                        </h2>
                        <p className="leading-7">
                            {route.types.join(', ')}
                        </p>
                    </div>
                </CardFooter>
            </Card >
        </div >
    );
};

export { RoutePage };
