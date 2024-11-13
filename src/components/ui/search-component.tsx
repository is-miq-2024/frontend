import { Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
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

export default function SearchComponent() {
  const [destination, setDestination] = useState('')
  const [travelType, setTravelType] = useState('')
  const [duration, setDuration] = useState('')
  const [difficulty, setDifficulty] = useState<number[]>([])
  const [rate, setRate] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])

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
      types: ["WALKING"]
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
        return { lowerBound: 2881, upperBound: 10080 }
      case 'twoweeks':
        return { lowerBound: 10081, upperBound: 20160 }
      case 'month':
        return { lowerBound: 20161, upperBound: 43200 }
      default:
        return { lowerBound: 0, upperBound: 43200 }
    }
  }

  const getTravelType = (type: 'beach' | 'mountain' | 'city' | 'adventure') => {
    switch (type) {
      case 'beach':
        return 'WALKING'
      case 'mountain':
        return 'HIKING'
      case 'city':
        return 'WALKING'
      case 'adventure':
        return 'CYCLING'
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
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Введите место назначения"
            className="w-full"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
          />
        </div>
        <Select value={travelType} onValueChange={setTravelType}>
          <SelectTrigger>
            <SelectValue placeholder="Тип путешествия" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beach">Пляжный отдых</SelectItem>
            <SelectItem value="mountain">Горы</SelectItem>
            <SelectItem value="city">Городской тур</SelectItem>
            <SelectItem value="adventure">Приключения</SelectItem>
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
        <div className="md:col-span-2">
          <p className="mb-2">Сложность:</p>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <label key={`difficulty-${value}`} className="flex items-center space-x-2">
                <Checkbox
                  checked={difficulty.includes(value)}
                  onCheckedChange={() => handleCheckboxChange(value, setDifficulty)}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <p className="mb-2">Рейтинг:</p>
          <div className="flex flex-wrap gap-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
              <label key={`rate-${value}`} className="flex items-center space-x-2">
                <Checkbox
                  checked={rate.includes(value)}
                  onCheckedChange={() => handleCheckboxChange(value, setRate)}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((result) => (
              <div key={result.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-2">{result.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{result.description}</p>
                <p className="text-sm"><strong>Длительность:</strong> {result.durationInMinutes} мин</p>
                <p className="text-sm"><strong>Сложность:</strong> {result.difficulty}/10</p>
                <p className="text-sm"><strong>Рейтинг:</strong> {result.rate.toFixed(1)}/10</p>
                <p className="text-sm"><strong>Тип:</strong> {result.types.join(', ')}</p>
                {result.recommendations.length > 0 && (
                  <div className="mt-2">
                    <strong className="text-sm">Рекомендации:</strong>
                    <ul className="list-disc list-inside text-sm">
                      {result.recommendations.map((rec: string, index: number) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
