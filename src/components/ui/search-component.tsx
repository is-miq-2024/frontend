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

export default function SearchComponent() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white dark:bg-black rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <Input type="text" placeholder="Введите место назначения" className="w-full" />
        </div>
        <Select>
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
        <Select>
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
        <div className="md:col-span-4">
          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            <Search className="mr-2 h-4 w-4" /> Поиск маршрутов
          </Button>
        </div>
      </div>
    </div>
  )
}
