import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useUser} from "@/components/UserContext.tsx";
import {YMaps} from "@pbe/react-yandex-maps";
import {YMapsComponent} from "@/pages/CreateRoutePage.tsx";

const PathEdit = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [recommendations, setRecommendations] = useState(['']);
    const [coordinates, setCoordinates] = useState<{
        latitude: number,
        longitude: number
    }[]>([]);
    const [difficulty, setDifficulty] = useState<number>(1);

    const [pathParams, setPathParams] = useState<{ durationInMinutes: number }>({durationInMinutes: 0});
    const [pathMapEditMode, setPathMapEditMode] = useState<boolean>(true);

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
    console.log(pathParams.durationInMinutes
    )
    useEffect(() => {
        if (route) {
            setTitle(route.title);
            setDescription(route.description);
            setDifficulty(route.difficulty);
            setRecommendations(route.recommendations);
            setCoordinates(route.points);
            setPathParams((prevState) => ({...prevState, durationInMinutes: route.durationInMinutes}));
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
            <button onClick={() => navigate('/')} style={{margin: '16px'}}>Назад</button>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        // @ts-ignore
                        rows="4"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />

                    <YMaps query={{apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21"}}><YMapsComponent
                        setPathMapEditMode={setPathMapEditMode} setPathParams={setPathParams}
                        setCoordinates={setCoordinates}
                        // @ts-ignore
                        coordinates={coordinates?.map((item) => [item.latitude, item.longitude])}/></YMaps>

                    <div className="mb-6 mt-4">
                        <label className="block text-lg font-medium text-gray-700 mb-2">Difficulty (1-10)</label>
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-semibold text-gray-600">1</span>
                            <input
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
                </div>

                <div className="mb-4">
                    <label className="block text-lg font-medium text-gray-700">Recommendations</label>
                    {recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-center space-x-4 mb-2">
                            <input
                                type="text"
                                value={recommendation}
                                onChange={(e) => handleRecommendationChange(index, e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={() => removeRecommendation(index)}
                                className="text-blue-500 hover:text-red-700"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addRecommendation}
                        className="text-blue-500 hover:text-blue-700"
                    >
                        Add Recommendation
                    </button>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Submit
                    </button>
                </div>

            </form>
        </div>

    );

}

export {PathEdit};