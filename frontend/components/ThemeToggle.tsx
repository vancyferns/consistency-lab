'use client'

import { useTheme } from 'next-themes'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <div
                className="w-10 h-10 rounded border-2 border-stone-600 bg-stone-800"
                style={{ boxShadow: '0 2px 0 #1c1917' }}
            />
        )
    }

    const isDark = resolvedTheme === 'dark'

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            className={`w-10 h-10 rounded border-2 flex items-center justify-center transition-all ${isDark
                    ? 'bg-indigo-900 border-indigo-600 text-yellow-300 hover:bg-indigo-800'
                    : 'bg-amber-100 border-amber-400 text-amber-600 hover:bg-amber-50'
                }`}
            style={{
                boxShadow: isDark ? '0 2px 0 #312e81' : '0 2px 0 #b45309',
                fontFamily: 'monospace'
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            <motion.div
                key={isDark ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {isDark ? (
                    <Moon className="w-5 h-5" />
                ) : (
                    <Sun className="w-5 h-5" />
                )}
            </motion.div>
        </motion.button>
    )
}
