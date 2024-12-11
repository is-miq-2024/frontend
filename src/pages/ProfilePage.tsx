import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RouteCard } from './RouteCard'

interface Route {
    id: string
    title: string
    description: string
    recommendations: string[]
    durationInMinutes: number
    difficulty: number
    types: string[]
    points: { latitude: number; longitude: number }[]
    comments: {
        id: string
        text: string
        userLogin: string
        rate: number
        timestamp: string
    }[]
    rate: number
    isFavorite: boolean
}

interface UserProfile {
    login: string
    favoriteRoutes: Route[]
    createdRoutes: Route[]
    completedRoutes: Route[]
}

export default function ProfilePage() {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [userLogin, setUserLogin] = useState<string | null>(null)

    const fetchUserProfile = async () => {
        const storedUserLogin = localStorage.getItem('userLogin')
        setUserLogin(storedUserLogin)
        console.log(storedUserLogin)

        //const userLogin = localStorage.getItem('userLogin');
        //const userPassword = localStorage.getItem('userPassword');
        const userLogin = "username"
        const userPassword = "passwordPASS*"
        const credentials = btoa(`${userLogin}:${userPassword}`);
        console.log(`https://193.32.178.205:8080/users/findByLogin/${userLogin}`)
        const formdata = { "pageSize": 100, "pageNumber": 0, "title": "", "durationInMinutes": { "lowerBound": 0, "upperBound": 43200 }, "difficulty": { "lowerBound": null, "upperBound": null }, "rate": { "lowerBound": null, "upperBound": null }, "types": ["WALKING"] }
        try {
            //const response = await fetch('http://193.32.178.205:8080/route/search', {
            const response = await fetch(`http://193.32.178.205:8080/users/findByLogin/username`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic dXNlcm5hbWU6cGFzc3dvcmRQQVNTKg=='
                },
                //body: JSON.stringify(formdata),
                mode: 'cors',
            })
            if (!response.ok) {
                throw new Error('Failed to fetch route data');
            }
            console.log('response:', response.ok)
            const data = await response.json();
            setUserProfile(data)
        } catch (error) {
            console.error('Error fetching route data:', error);
        }
    }
    useEffect(() => {
        fetchUserProfile()
    }, [])

    if (!userProfile) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-w-full min-h-[100dvh] flex flex-col items-center bg-white dark:bg-black">
            <section className="container py-12">
                <Card className="mb-8">
                    <CardContent className="flex items-center space-x-4 pt-6">
                        <div>
                            <h1 className="text-2xl font-bold">{userLogin || 'User'}</h1>
                            <p className="text-gray-500">{userProfile.login}</p>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="favorite" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="favorite">Favorite Routes</TabsTrigger>
                        <TabsTrigger value="created">Created Routes</TabsTrigger>
                        <TabsTrigger value="completed">Completed Routes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="favorite">
                        <Card>
                            <CardHeader>
                                <CardTitle>Favorite Routes</CardTitle>
                                <CardDescription>Routes you've marked as favorites</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {userProfile.favoriteRoutes.map((route) => (
                                    <RouteCard key={route.id} route={route} />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="created">
                        <Card>
                            <CardHeader>
                                <CardTitle>Created Routes</CardTitle>
                                <CardDescription>Routes you've created</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {userProfile.createdRoutes.map((route) => (
                                    <RouteCard key={route.id} route={route} />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="completed">
                        <Card>
                            <CardHeader>
                                <CardTitle>Completed Routes</CardTitle>
                                <CardDescription>Routes you've completed</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {userProfile.completedRoutes.map((route) => (
                                    <RouteCard key={route.id} route={route} />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </section>
        </div>
    )
}
