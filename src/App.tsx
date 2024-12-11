import Header from './components/header'
import Hero from './components/hero-section'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import SearchSection from './components/search-section'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataForm } from "@/pages/DataForm";
import { RoutePage } from "@/pages/RoutePage";
import ProfilePage from './pages/ProfilePage'


function HomePage() {
    return (
        <div className="min-w-full min-h-[100dvh] flex flex-col items-center bg-white dark:bg-black">
            <Header />
            <Hero />
            <SearchSection />
        </div>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<div style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><LoginPage /></div>} />
                <Route path="/registration" element={<div style={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}><RegisterPage /></div>} />
                <Route path="/create-route" element={<DataForm />} />
                <Route path="/route/:id" element={<RoutePage />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App
