import {useState} from "react";
import {YMapsComponent} from "@/pages/CreateRoutePage.tsx";
import {YMaps} from "@pbe/react-yandex-maps";
import {useUser} from "@/components/UserContext.tsx";
import {useNavigate} from "react-router-dom";

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
                </div>

                <YMaps query={{apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21"}}><YMapsComponent setCoordinates={setCoordinates}/></YMaps>

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
};

export {DataForm}