import Header from './components/header'
import Hero from './components/hero-section'
import LoginPage from './components/LoginPage'
import LogoutButton from './components/LogoutButton'
import RegisterPage from './components/RegisterPage'
import SearchSection from './components/search-section'

function App() {
  return (
    <div className="min-w-full min-h-[100dvh] flex flex-col items-center bg-white dark:bg-black">
      <Header />
      <Hero />
      <SearchSection />
      <RegisterPage />
      <LoginPage />
      <LogoutButton />
    </div >
  )
}

export default App
