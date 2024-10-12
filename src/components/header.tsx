import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { MapPin } from "lucide-react"

function Header() {
  return (
    <div className='container sticky top-0 py-2 md:py-4 bg-white dark:bg-black text-black dark:text-white flex justify-between'>
      <div className="flex gap-x-4 items-end">
        <div className="flex flex-row items-center gap-1">
          <h3 className="text-2xl font-semibold tracking-tight"><MapPin /></h3>
          <h3 className="text-2xl font-semibold tracking-tight">Travel</h3>
        </div>
        <div className="hidden lg:flex gap-x-4 items-end">
          <a className="leading-7 cursor-pointer">Создать маршрут</a>
          <a className="leading-7 cursor-pointer">Найти маршрут</a>
          <a className="leading-7 cursor-pointer">Личный кабинет</a>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Input placeholder="Поиск" className="hidden lg:block" />
        <Button>Вход/регистрация</Button>
      </div>
    </div >
  )
}

export default Header
