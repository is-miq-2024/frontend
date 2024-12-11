import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom";
import { Rating } from "@/components/Rating.tsx";
import { useUser } from "@/components/UserContext.tsx";

export default function SearchComponent() {
    const [destination, setDestination] = useState('')
    const [travelType, setTravelType] = useState('')
    const [duration, setDuration] = useState('')
    const [difficulty, setDifficulty] = useState<number[]>([])
    const [rate, setRate] = useState<number[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [searchResults, setSearchResults] = useState<any[]>([])

    const navigate = useNavigate();

    const { userLogin, userPassword } = useUser();

    const username = userLogin;
    const password = userPassword;

    const encodedCredentials = btoa(`${username}:${password}`);

    const handleSearch = async () => {
        setIsLoading(true)
        const formData = {
            pageSize: 100,
            pageNumber: 0,
            title: destination,
            durationInMinutes: getDurationBounds(duration as 'weekend' | 'week' | 'twoweeks' | 'month'),
            difficulty: {
                lowerBound: Math.min(...difficulty),
                upperBound: Math.max(...difficulty)
            },
            rate: {
                lowerBound: Math.min(...rate),
                upperBound: Math.max(...rate)
            },
            types: [getTravelType(travelType as 'walking' | 'cycling' | 'driving')]
        }

        const userLogin = localStorage.getItem('userLogin');
        const userPassword = localStorage.getItem('userPassword');
        const credentials = btoa(`${userLogin}:${userPassword}`);
        console.log("Creds:", credentials)
        console.log("Formdata:", formData)
        try {
            const response = await fetch('http://193.32.178.205:8080/route/search', {
                method: 'POST',
                headers: {
                    //'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`,
                },
                body: JSON.stringify(formData),
                mode: 'cors',
            })

            if (response.ok) {
                const data = await response.json()
                setSearchResults(data)
            } else {
                console.log('Failed to fetch search results')
            }
        } catch (error) {
            console.error('Error fetching search results:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const getDurationBounds = (duration: 'weekend' | 'week' | 'twoweeks' | 'month') => {
        switch (duration) {
            case 'weekend':
                return { lowerBound: 0, upperBound: 2880 }
            case 'week':
                return { lowerBound: 0, upperBound: 10080 }
            case 'twoweeks':
                return { lowerBound: 0, upperBound: 20160 }
            case 'month':
                return { lowerBound: 0, upperBound: 43200 }
            default:
                return { lowerBound: 0, upperBound: 43200 }
        }
    }

    const getTravelType = (type: 'walking' | 'cycling' | 'driving') => {
        switch (type) {
            case 'walking':
                return 'WALKING'
            case 'cycling':
                return 'CYCLING'
            case 'driving':
                return 'DRIVING'
            default:
                return 'WALKING'
        }
    }

    const handleCheckboxChange = (value: number, setter: React.Dispatch<React.SetStateAction<number[]>>) => {
        setter(prev =>
            prev.includes(value)
                ? prev.filter(item => item !== value)
                : [...prev, value]
        )
    }

    // @ts-ignore
    const handleSubmitReview = async ({ rating, comment, id }) => {
        const formData = {
            routeId: id,
            text: comment,
            rate: rating,
        }


        try {
            const response = await fetch('http://193.32.178.205:8080/route/addComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${encodedCredentials}`,
                },
                body: JSON.stringify(formData),
                mode: 'cors',
            });

            if (response.ok) {
                console.log('Data submitted successfully');
            } else {
                console.log('Failed to submit data');
            }
        } catch (error) {
            console.error('Error submitting data:', error);
            alert('Error submitting data');
        }
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-4 bg-white dark:bg-black rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select value={travelType} onValueChange={setTravelType}>
                    <SelectTrigger>
                        <SelectValue placeholder="Тип путешествия" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="walking">Пешком</SelectItem>
                        <SelectItem value="cycling">На велосипеде</SelectItem>
                        <SelectItem value="driving">На машине</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                        <SelectValue placeholder="Длительность" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="weekend">Выходные</SelectItem>
                        <SelectItem value="week">Неделя</SelectItem>
                        <SelectItem value="twoweeks">Две недели</SelectItem>
                        <SelectItem value="month">Месяц</SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Сложность" />
                    </SelectTrigger>
                    <SelectContent className='flex flex-col gap-2'>
                        {[0, 1, 2, 3, 4, 5].map((value) => (
                            <label key={`difficulty-${value}`}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    checked={difficulty.includes(value)}
                                    onCheckedChange={() => handleCheckboxChange(value, setDifficulty)}
                                />
                                <span>{value}</span>
                            </label>
                        ))}
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Рейтинг" />
                    </SelectTrigger>
                    <SelectContent className='flex flex-col gap-2'>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                            <label key={`rate-${value}`} className="flex items-center space-x-2">
                                <Checkbox
                                    checked={rate.includes(value)}
                                    onCheckedChange={() => handleCheckboxChange(value, setRate)}
                                />
                                <span>{value}</span>
                            </label>
                        ))}
                    </SelectContent>
                </Select>
                <div className="md:col-span-4">
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        onClick={handleSearch}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            'Поиск...'
                        ) : (
                            <>
                                <Search className="mr-2 h-4 w-4" /> Поиск маршрутов
                            </>
                        )}
                    </Button>
                </div>
            </div>
            {searchResults.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Результаты поиска</h2>
                    <div className="flex flex-col gap-4">
                        {searchResults.map((result) => (
                            <Card key={result.id} className="flex flex-col">
                                <CardHeader>
                                    {result.author === username && (
                                        <Button onClick={() => navigate(`/routeEdit/${result.id}`)}
                                            className='self-end w-1/5'>
                                            Редактировать
                                        </Button>
                                    )}

                                    <CardTitle
                                        onClick={() => navigate(`/route/${result.id}`)}>{result.title}</CardTitle>
                                    <CardDescription>{result.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="grid grid-cols-2 gap-2 mb-4">
                                        <div className="text-sm">
                                            <strong>Длительность:</strong> {result.durationInMinutes} мин
                                        </div>
                                        <div className="text-sm"><strong>Сложность:</strong> {result.difficulty}/10
                                        </div>
                                        <div className="text-sm"><strong>Рейтинг:</strong> {result.rate.toFixed(1)}/10
                                        </div>
                                        <div className="text-sm"><strong>Тип:</strong> {result.types.join(', ')}</div>
                                    </div>
                                    {result.recommendations.length > 0 && (
                                        <div>
                                            <strong className="text-sm">Рекомендации:</strong>
                                            <ul className="list-disc list-inside text-sm mt-2">
                                                {result.recommendations.map((rec: string, index: number) => (
                                                    <li key={index}>{rec}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Rating
                                        currentRating={result.userRating || 0}
                                        onSubmitReview={({ rating, comment }) => {
                                            handleSubmitReview({ rating, comment, id: result.id });
                                        }} />
                                    <Badge variant="outline">{result.types[0]}</Badge>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
