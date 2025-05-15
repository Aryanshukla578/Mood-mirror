"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Music, Dumbbell, BookOpen } from "lucide-react"

interface Recommendation {
  id: number
  type: "music" | "habit" | "reading"
  title: string
  description: string
}

interface RecommendationsProps {
  currentMood: string | null
}

export function Recommendations({ currentMood }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<{
    music: Recommendation[]
    habits: Recommendation[]
    readings: Recommendation[]
  }>({
    music: [],
    habits: [],
    readings: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)

        // Use current mood if available, otherwise fetch the latest mood
        let mood = currentMood

        if (!mood) {
          const historyResponse = await fetch("/api/mood-history?latest=true")
          if (historyResponse.ok) {
            const historyData = await historyResponse.json()
            if (historyData.mood) {
              mood = historyData.mood
            }
          }
        }

        // If we still don't have a mood, use neutral as default
        mood = mood || "neutral"

        const response = await fetch(`/api/recommendations?mood=${mood}`)

        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }

        const data = await response.json()
        setRecommendations(data)
      } catch (err) {
        console.error("Error fetching recommendations:", err)
        setError("Failed to load recommendations. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [currentMood])

  const renderRecommendationList = (items: Recommendation[], icon: React.ReactNode) => {
    if (items.length === 0) {
      return <div className="text-center py-8 text-muted-foreground">No recommendations available</div>
    }

    return (
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="mt-1">{icon}</div>
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Personalized Recommendations</CardTitle>
        <CardDescription>Based on your {currentMood ? `current "${currentMood}"` : "latest"} mood</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-800 p-3 rounded-md">{error}</div>
        ) : (
          <Tabs defaultValue="music" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="habits">Habits</TabsTrigger>
              <TabsTrigger value="readings">Readings</TabsTrigger>
            </TabsList>

            <TabsContent value="music" className="mt-6">
              {renderRecommendationList(recommendations.music, <Music className="h-5 w-5 text-primary" />)}
            </TabsContent>

            <TabsContent value="habits" className="mt-6">
              {renderRecommendationList(recommendations.habits, <Dumbbell className="h-5 w-5 text-primary" />)}
            </TabsContent>

            <TabsContent value="readings" className="mt-6">
              {renderRecommendationList(recommendations.readings, <BookOpen className="h-5 w-5 text-primary" />)}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
