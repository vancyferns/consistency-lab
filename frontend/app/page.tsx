import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-block mb-6">
            <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full">
              🎓 The Becoming League Learning Engine
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Consistency Lab
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform YouTube playlists into <span className="text-blue-600 font-semibold">structured courses</span> with AI-powered learning tools, personalized scheduling, and accountability tracking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-6">
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div>
              <div className="text-3xl font-bold text-blue-600">3x</div>
              <div className="text-sm text-gray-600">Faster Learning</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">AI</div>
              <div className="text-sm text-gray-600">Powered Insights</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">Free to Use</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Playlist to Course</h3>
              <p className="text-gray-600">
                Convert any YouTube playlist into a structured learning path with AI-generated summaries and syllabi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">3-Day Logic Engine</h3>
              <p className="text-gray-600">
                Set your weekly schedule (e.g., Mon/Wed/Fri) and get a personalized completion timeline.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">Consistency Heatmap</h3>
              <p className="text-gray-600">
                GitHub-style visualization shows your learning streak and holds you accountable.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI Learning Assistant</h3>
              <p className="text-gray-600">
                Ask questions about course content and get instant, context-aware answers powered by Gemini 2.5 Flash.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-2">Auto Quiz Generation</h3>
              <p className="text-gray-600">
                Test your knowledge with automatically generated quizzes from video transcripts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Learning Analytics</h3>
              <p className="text-gray-600">
                AI-powered insights predict completion probability and identify areas needing more focus.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Paste YouTube Playlist URL</h3>
                <p className="text-gray-600">
                  Enter any public YouTube playlist URL or ID
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Set Your Schedule</h3>
                <p className="text-gray-600">
                  Choose your study days and hours per session
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Start Learning!</h3>
                <p className="text-gray-600">
                  Track progress, take quizzes, and stay consistent with AI support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            Built with ❤️ for learners who value consistency
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Powered by Gemini 2.5 Flash • Supabase • Next.js
          </p>
        </div>
      </footer>
    </div>
  )
}
