import { FC, useEffect, useState } from "react";
import { PageMap } from "@/components/PageMap";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/components/UserContext.tsx";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

    const { userLogin, userPassword } = useUser();

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

    return (
        <div>
            <Button onClick={() => navigate('/')} className="mt-4 ml-4">Назад</Button>
            <Card className="max-w-3xl mx-auto p-6 shadow-md rounded-lg mt-10">
                <CardHeader>
                    <CardTitle>Информация о маршруте</CardTitle>
                </CardHeader>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    {route.title}
                </h2>

                <p className="leading-7 font-semibold mt-4">
                    Описание:
                </p>
                <p className="leading-7">
                    {route.description}
                </p>

                <p className="leading-7 font-semibold mt-4">
                    Рекомендации:
                </p>
                <ul className="ml-6 mb-4 list-disc">
                    {route.recommendations.map((rec: any, index: any) => (
                        <li key={index}>{rec}</li>
                    ))}
                </ul>

                <PageMap coordinates={convertCoordinates(route.points)} />

                <p className="leading-7 font-semibold mt-4">
                    Продолжительность:
                </p>
                <p className="leading-7">
                    {route.durationInMinutes} минут
                </p>

                <p className="leading-7 font-semibold mt-4">
                    Сложность:
                </p>
                <p className="leading-7">
                    {route.difficulty}
                </p>

                <p className="leading-7 font-semibold mt-4">
                    Тип маршрута:
                </p>
                <p className="leading-7">
                    {route.types.join(', ')}
                </p>

                {
                    route.comments.length > 0 && (
                        <div className="mt-4">
                            <h4 className="scroll-m-20 mb-4 text-md font-semibold tracking-tight">
                                Отзывы</h4>
                            <ul className="space-y-2">

                                {route.comments.map((review: any, index: any) => (
                                    <li key={index} className="pb-2">
                                        <Card className="flex flex-col items-left">
                                            <CardContent>
                                                <div className="flex flex-row mt-5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rate ? "text-yellow-400" : "text-gray-300"}`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-700">{review.text}</p>
                                            </CardContent>
                                        </Card>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </Card >
        </div >
    );
};

export { RoutePage };
