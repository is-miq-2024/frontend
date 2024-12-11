import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface RouteCardProps {
    route: Route
}

export function RouteCard({ route }: RouteCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    {route.title}
                    {route.isFavorite && (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6 text-yellow-400"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </CardTitle>
                <CardDescription>{route.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-2">
                    {route.types.map((type) => (
                        <Badge key={type} variant="secondary">{type}</Badge>
                    ))}
                </div>
                <p className="text-sm text-gray-500">Duration: {route.durationInMinutes} minutes</p>
                <p className="text-sm text-gray-500">Difficulty: {route.difficulty}/10</p>
            </CardContent>
            <CardFooter>
                <div className="flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-yellow-400 mr-1"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span>{route.rate.toFixed(1)}</span>
                </div>
            </CardFooter>
        </Card>
    )
}

