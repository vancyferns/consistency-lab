'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Sparkles, Zap, Target, TrendingUp, BookOpen, Brain } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM4YjVjZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGg3Nzd2MTBoLTc3N3ptMC0xNjBoNzc3djEwaC03Nzd6bTAtMTYwaDc3N3YxMGgtNzc3eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        
        {/* Floating Orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-8"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-200 text-sm font-semibold px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-lg shadow-purple-500/20">
              <Sparkles className="w-4 h-4" />
              The Becoming League Learning Engine
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent"
          >
            Consistency Lab
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Transform YouTube playlists into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-semibold">
              structured courses
            </span>{' '}
            with AI-powered learning tools, personalized scheduling, and gamified accountability.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="text-lg px-10 py-7 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-xl shadow-purple-500/30 border-0 font-semibold transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                <Zap className="mr-2 h-5 w-5" />
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 py-7 bg-white/10 backdrop-blur-sm border-2 border-purple-400/50 text-white hover:bg-white/20 hover:border-purple-400 shadow-lg transition-all duration-300 hover:scale-105 min-w-[200px]"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mt-20"
          >
            {[
              { value: '3x', label: 'Faster Learning', icon: TrendingUp },
              { value: 'AI', label: 'Powered Insights', icon: Brain },
              { value: '100%', label: 'Free to Use', icon: Target }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-xl"
              >
                <div className="flex justify-center mb-3">
                  <stat.icon className="w-8 h-8 text-purple-400" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to master any subject with consistency
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {[
              {
                emoji: '📚',
                title: 'Playlist to Course',
                description: 'Convert any YouTube playlist into a structured learning path with AI-generated summaries and syllabi.',
                gradient: 'from-purple-500/20 to-blue-500/20',
                borderColor: 'border-purple-500/30'
              },
              {
                emoji: '📅',
                title: '3-Day Logic Engine',
                description: 'Set your weekly schedule (e.g., Mon/Wed/Fri) and get a personalized completion timeline.',
                gradient: 'from-blue-500/20 to-cyan-500/20',
                borderColor: 'border-blue-500/30'
              },
              {
                emoji: '🔥',
                title: 'Consistency Heatmap',
                description: 'GitHub-style visualization shows your learning streak and holds you accountable.',
                gradient: 'from-orange-500/20 to-red-500/20',
                borderColor: 'border-orange-500/30'
              },
              {
                emoji: '🤖',
                title: 'AI Learning Assistant',
                description: 'Ask questions about course content and get instant, context-aware answers powered by Gemini 2.5 Flash.',
                gradient: 'from-green-500/20 to-emerald-500/20',
                borderColor: 'border-green-500/30'
              },
              {
                emoji: '📝',
                title: 'Auto Quiz Generation',
                description: 'Test your knowledge with automatically generated quizzes from video transcripts.',
                gradient: 'from-pink-500/20 to-rose-500/20',
                borderColor: 'border-pink-500/30'
              },
              {
                emoji: '📊',
                title: 'Learning Analytics',
                description: 'AI-powered insights predict completion probability and identify areas needing more focus.',
                gradient: 'from-violet-500/20 to-purple-500/20',
                borderColor: 'border-violet-500/30'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-md border ${feature.borderColor} rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group`}
              >
                <motion.div
                  className="text-6xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {feature.emoji}
                </motion.div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Start learning in just 3 simple steps
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                step: '1',
                title: 'Paste YouTube Playlist URL',
                description: 'Enter any public YouTube playlist URL or ID',
                color: 'purple'
              },
              {
                step: '2',
                title: 'Set Your Schedule',
                description: 'Choose your study days and hours per session',
                color: 'blue'
              },
              {
                step: '3',
                title: 'Start Learning!',
                description: 'Track progress, take quizzes, and stay consistent with AI support',
                color: 'green'
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex gap-6 items-start bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300"
              >
                <motion.div
                  className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-${item.color}-500/30`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.step}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2 text-white">{item.title}</h3>
                  <p className="text-gray-300 text-lg">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-xl px-12 py-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl shadow-purple-500/40 border-0 font-bold transition-all duration-300 hover:scale-110"
              >
                <Sparkles className="mr-2 h-6 w-6" />
                Start Your Journey Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-md border-t border-white/10 py-12 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-gray-300 text-lg mb-3">
              Built with <span className="text-red-500 animate-pulse">❤️</span> for learners who value consistency
            </p>
            <p className="text-sm text-gray-500">
              Powered by <span className="text-purple-400 font-semibold">Gemini 2.5 Flash</span> • 
              <span className="text-green-400 font-semibold"> Supabase</span> • 
              <span className="text-blue-400 font-semibold"> Next.js</span>
            </p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}
