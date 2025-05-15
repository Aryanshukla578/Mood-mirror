"use client"

import { useState } from "react"
import { Camera } from "@/components/camera"
import { MoodHistory } from "@/components/mood-history"
import { Recommendations } from "@/components/recommendations"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"

export default function Home() {
  const [currentMood, setCurrentMood] = useState<string | null>(null)

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">AI Mood Mirror</h1>
        <ModeToggle />
      </div>

      <Tabs defaultValue="scan" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="scan">Scan Mood</TabsTrigger>
          <TabsTrigger value="history">Mood History</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="scan" className="mt-6">
          <Camera setCurrentMood={setCurrentMood} />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <MoodHistory />
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <Recommendations currentMood={currentMood} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
