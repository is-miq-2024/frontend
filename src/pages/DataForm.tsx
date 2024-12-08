import { useState } from "react";
import { YMapsComponent } from "@/pages/CreateRoutePage";
import { Input } from "@/components/ui/input"
import { YMaps } from "@pbe/react-yandex-maps";
import { useUser } from "@/components/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DataForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [recommendations, setRecommendations] = useState(['']);
    const [coordinates, setCoordinates] = useState<{
        latitude: number,
        longitude: number
    }[]>([]);

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
            durationInMinutes: 0,
            difficulty: 0,
            types: [
                "WALKING"
            ],
            points: coordinates,
        };

        console.log(formData)
        console.log(`Basic ${encodedCredentials}`)
        console.log(encodedCredentials)

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

    return (
        <div className="max-w-2xl mx-auto p-6 bg-gray rounded-lg shadow-md">
            <Card>
                <CardHeader>
                    <CardTitle>Создание маршрута</CardTitle>
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

                        <YMaps query={{ apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21" }}><YMapsComponent setCoordinates={setCoordinates} /></YMaps>

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
                                        onClick={() => removeRecommendation(index)}
                                        variant="destructive"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}
                            <Button
                                type="button"
                                onClick={addRecommendation}
                                variant="outline"
                            >
                                Добавить рекомендацию
                            </Button>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
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
