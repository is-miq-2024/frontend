import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@/components/UserContext.tsx";
import { YMaps } from "@pbe/react-yandex-maps";
import { YMapsComponent } from "@/pages/CreateRoutePage.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PathEdit = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [recommendations, setRecommendations] = useState(['']);
    const [coordinates, setCoordinates] = useState<{
        latitude: number,
        longitude: number
    }[]>([]);
    const [difficulty, setDifficulty] = useState<number>(1);

    const [pathParams, setPathParams] = useState<{ durationInMinutes: number }>({ durationInMinutes: 0 });
    const [pathMapEditMode, setPathMapEditMode] = useState<boolean>(true);

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
    console.log(pathParams.durationInMinutes
    )
    useEffect(() => {
        if (route) {
            setTitle(route.title);
            setDescription(route.description);
            setDifficulty(route.difficulty);
            setRecommendations(route.recommendations);
            setCoordinates(route.points);
            setPathParams((prevState) => ({ ...prevState, durationInMinutes: route.durationInMinutes }));
        }
    }, [route]);

    if (!route) {
        return <div className="text-center text-gray-500">Loading...</div>;
    }

    // @ts-ignore
    const handleRecommendationChange = (index, value) => {
        const updatedRecommendations = [...recommendations];
        updatedRecommendations[index] = value;
        setRecommendations(updatedRecommendations);
    };

    const addRecommendation = () => {
        setRecommendations([...recommendations, '']);
    };
    // @ts-ignore
    const removeRecommendation = (index) => {
        const updatedRecommendations = recommendations.filter((_, i) => i !== index);
        setRecommendations(updatedRecommendations);
    };

    // @ts-ignore
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            id: routeId,
            title,
            description,
            recommendations,
            durationInMinutes: pathParams.durationInMinutes,
            difficulty: difficulty,
            types: [
                "WALKING"
            ],
            points: coordinates,
        };

        console.log(formData)

        try {
            const response = await fetch('http://193.32.178.205:8080/route/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${encodedCredentials}`,
                },
                body: JSON.stringify(formData),
                mode: 'cors',
            });

            if (response.ok) {
                alert('Data submitted successfully');
                navigate('/');
            } else {
                alert('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data');
        }
    };
    console.log(route)
    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray rounded-lg shadow-md">
            <Button onClick={() => navigate('/')} style={{ margin: '16px' }}>Назад</Button>
            <Card>
                <CardHeader>
                    <CardTitle>Редактирование маршрута</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <Label>Название</Label>
                            <Input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <Label>Описание</Label>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />

                            <YMaps query={{ apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21" }}><YMapsComponent
                                setPathMapEditMode={setPathMapEditMode} setPathParams={setPathParams}
                                setCoordinates={setCoordinates}
                                // @ts-ignore
                                coordinates={coordinates?.map((item) => [item.latitude, item.longitude])} /></YMaps>

                            <div className="mb-6 mt-4">
                                <Label>Сложность</Label>
                                <div className="flex items-center space-x-4">
                                    <span className="text-lg font-semibold text-gray-600">1</span>
                                    <Input
                                        type="range"
                                        min={1}
                                        max={10}
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(Number(e.target.value))}
                                    />
                                    <span className="text-lg font-semibold text-gray-600">10</span>
                                </div>
                                <div className="text-center mt-2">
                                    <p className="text-sm text-muted-foreground">Выбрано: {difficulty}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <Label>Рекомендации</Label>
                            {recommendations.map((recommendation, index) => (
                                <div key={index} className="flex items-center space-x-4 mb-2">
                                    <Input
                                        type="text"
                                        value={recommendation}
                                        onChange={(e) => handleRecommendationChange(index, e.target.value)}
                                        required
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        onClick={() => removeRecommendation(index)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addRecommendation}
                            >
                                +
                            </Button>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                            >
                                Сохранить изменения
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>

    );

}

export { PathEdit };
