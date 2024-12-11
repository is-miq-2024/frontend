import { useState } from "react";
import { YMapsComponent } from "@/pages/CreateRoutePage";
import { YMaps } from "@pbe/react-yandex-maps";
import { useUser } from "@/components/UserContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DataForm = () => {
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


    const navigate = useNavigate();

    const { userLogin, userPassword } = useUser();

    const username = userLogin;
    const password = userPassword;

    const encodedCredentials = btoa(`${username}:${password}`);
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

        try {
            const response = await fetch('http://193.32.178.205:8080/route/save', {
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

    return (<div className="max-w-2xl mx-auto p-6 bg-gray rounded-lg shadow-md">

        <Card>
            <CardHeader>
                <CardTitle>Создание маршрута</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label className="block text-lg font-medium text-gray-700">Название</Label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <Label>Описание</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            // @ts-ignore
                            rows="4"
                            className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <YMaps query={{ apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21" }}>
                        <YMapsComponent setPathMapEditMode={setPathMapEditMode} setPathParams={setPathParams} setCoordinates={setCoordinates} />
                    </YMaps>

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
                                className="flex-grow h-4 appearance-none bg-blue-200 rounded-full outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition duration-200"
                                style={{
                                    accentColor: '#2563eb',
                                    width: '100%',
                                }}
                            />
                            <span className="text-lg font-semibold text-gray-600">10</span>
                        </div>
                        <div className="text-center mt-2">
                            <span className="text-lg font-medium text-gray-700">Selected: {difficulty}</span>
                        </div>
                        <style>{`
                        input[type="range"]::-webkit-slider-thumb {
                            height: 24px;
                            width: 24px;
                            background-color: #2563eb; /* Tailwind's blue-600 */
                            border-radius: 50%;
                            border: 2px solid #ffffff; /* Белая окантовка */
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Легкая тень */
                            cursor: pointer;
                            appearance: none;
                        }

                        input[type="range"]::-moz-range-thumb {
                            height: 24px;
                            width: 24px;
                            background-color: #2563eb;
                            border-radius: 50%;
                            border: 2px solid #ffffff;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            cursor: pointer;
                        }

                        input[type="range"]::-ms-thumb {
                            height: 24px;
                            width: 24px;
                            background-color: #2563eb;
                            border-radius: 50%;
                            border: 2px solid #ffffff;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                            cursor: pointer;
                        }
                    `}</style>
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
                                    variant="destructive"
                                    onClick={() => removeRecommendation(index)}
                                >
                                    Удалить
                                </Button>
                            </div>
                        ))}
                        <Button
                            onClick={addRecommendation}
                        >
                            Добавить
                        </Button>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            disabled={pathMapEditMode}
                        >
                            Создать
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    </div>
    );
};

export { DataForm }
