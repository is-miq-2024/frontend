import { ChevronRight, Search, Star } from 'lucide-react'
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

export default function SearchComponent() {
  const [destination, setDestination] = useState('')
  const [travelType, setTravelType] = useState('')
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState<number[]>([])
  const [rate, setRate] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const navigate = useNavigate();

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

  const addToFavorite = async (routeId: string) => {
    const userLogin = localStorage.getItem('userLogin');
    const userPassword = localStorage.getItem('userPassword');
    const creds = btoa(`${userLogin}:${userPassword}`);
    console.log("creds:", creds)
    if (userLogin === null) {
      return
    }
    const url = `http://193.32.178.205:8080/users/addFavoriteRoute?routeId=${routeId}`;
    console.log(url);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${creds}`,
        },
        //body: null, // No body is necessary for this request
        //body: JSON.stringify(""), // No body is necessary for this request
        mode: 'cors',
      });
      if (response.ok) {
        setFavorites(prev => new Set(prev).add(routeId));
        console.log('Route added to favorites successfully');
      } else {
        console.log('Failed to add route to favorites', response.status, await response.text());
      }
    } catch (error) {
      console.error('Error adding route to favorites:', error);
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
            {[0, 1, 2, 3, 4, 5].map((value) => (
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
              <Card key={result.id} className="flex flex-col" onClick={() => navigate(`/route/${result.id}`)}>
                <CardHeader>
                  <CardTitle>{result.title}</CardTitle>
                  <CardDescription>{result.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="text-sm"><strong>Длительность:</strong> {result.durationInMinutes} мин</div>
                    <div className="text-sm"><strong>Сложность:</strong> {result.difficulty}/10</div>
                    <div className="text-sm"><strong>Рейтинг:</strong> {result.rate.toFixed(1)}/10</div>
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
                <CardFooter className="flex justify-between gap-2">
                  <Badge variant="outline">{result.types[0]}</Badge>
                  <Button size='icon' className='p-2'
                    variant={favorites.has(result.id) ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToFavorite(result.id);
                    }}
                  >
                    <Star />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )
      }
    </div >
  )
}
