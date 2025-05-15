"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"

interface MoodEntry {
  id: number
  mood: string
  timestamp: string
  value: number // Numeric value for charting
}

const moodToValue = (mood: string): number => {
  const moodMap: Record<string, number> = {
    happy: 5,
    joy: 5,
    neutral: 3,
    surprise: 4,
    sad: 2,
    fear: 1,
    angry: 1,
    disgust: 1,
  }

  return moodMap[mood.toLowerCase()] || 3
}

export function MoodHistory() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const response = await fetch("/api/mood-history")

        if (!response.ok) {
          throw new Error("Failed to fetch mood history")
        }

        const data = await response.json()

        // Transform data for chart
        const transformedData = data.map((entry: any) => ({
          ...entry,
          value: moodToValue(entry.mood),
          // Format date for display
          formattedDate: new Date(entry.timestamp).toLocaleDateString(),
        }))

        setMoodHistory(transformedData)
      } catch (err) {
        console.error("Error fetching mood history:", err)
        setError("Failed to load your mood history. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMoodHistory()
  }, [])

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Your Mood History</CardTitle>
        <CardDescription>Track how your mood has changed over time</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-800 p-3 rounded-md">{error}</div>
        ) : moodHistory.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No mood data yet. Try scanning your face to start tracking your mood!
          </div>
        ) : (
          <>
            <div className="h-80 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="formattedDate" tick={{ fontSize: 12 }} />
                  <YAxis
                    domain={[0, 6]}
                    ticks={[1, 2, 3, 4, 5]}
                    tickFormatter={(value) => {
                      const moodLabels = ["", "Negative", "", "Neutral", "", "Positive"]
                      return moodLabels[value] || ""
                    }}
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      const entry = moodHistory.find((e) => e.value === value)
                      return [entry?.mood || value, "Mood"]
                    }}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Mood" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 mt-4">
              <h3 className="font-medium text-lg">Recent Entries</h3>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">Mood</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moodHistory
                      .slice()
                      .reverse()
                      .map((entry) => (
                        <tr key={entry.id} className="border-b">
                          <td className="py-2">{formatDate(entry.timestamp)}</td>
                          <td className="py-2">{new Date(entry.timestamp).toLocaleTimeString()}</td>
                          <td className="py-2 capitalize">{entry.mood}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
