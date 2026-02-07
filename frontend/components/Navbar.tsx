'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen, BarChart3, Settings, Home, Sword, ScrollText } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import AuthButton from './AuthButton'

const navLinks = [
    { href: '/dashboard', label: 'Base Camp', icon: Home },
    { href: '/dashboard/progress', label: 'Stats', icon: BarChart3 },
]

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md border-b-4 border-stone-700'
                    : 'bg-stone-900/80 dark:bg-stone-950/80 backdrop-blur-sm border-b-4 border-stone-600'
                }`}
            style={{
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.4)' : 'none'
            }}
        >
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Minecraft Style */}
                    <Link href="/dashboard" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                            transition={{ duration: 0.3 }}
                            className="relative"
                        >
                            <div
                                className="w-10 h-10 rounded border-2 border-amber-600 flex items-center justify-center"
                                style={{
                                    background: 'linear-gradient(135deg, #78350f 0%, #451a03 100%)',
                                    boxShadow: '0 2px 0 #78350f, inset 0 1px 1px rgba(255,255,255,0.2)'
                                }}
                            >
                                <span className="text-xl">⚔️</span>
                            </div>
                        </motion.div>
                        <div>
                            <h1
                                className="font-bold text-lg text-amber-100 tracking-wide"
                                style={{ fontFamily: 'monospace', letterSpacing: '2px' }}
                            >
                                CONSISTENCY LAB
                            </h1>
                            <p className="text-[10px] text-stone-400 tracking-widest" style={{ fontFamily: 'monospace' }}>
                                LEVEL UP YOUR LEARNING
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        {navLinks.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href
                            return (
                                <Link key={link.href} href={link.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 py-2 rounded border-2 flex items-center gap-2 transition-all ${isActive
                                                ? 'bg-amber-700 border-amber-500 text-amber-100'
                                                : 'bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700 hover:border-stone-500 hover:text-stone-100'
                                            }`}
                                        style={{
                                            fontFamily: 'monospace',
                                            boxShadow: isActive ? '0 2px 0 #78350f' : '0 2px 0 #1c1917'
                                        }}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-bold">{link.label.toUpperCase()}</span>
                                    </motion.div>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <div className="hidden md:block">
                            <AuthButton />
                        </div>

                        {/* Mobile Menu Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded border-2 border-stone-600 bg-stone-800 text-stone-300 hover:bg-stone-700"
                            style={{ boxShadow: '0 2px 0 #1c1917' }}
                        >
                            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu - Inventory Style */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden"
                        style={{
                            background: 'linear-gradient(180deg, #292524 0%, #1c1917 100%)',
                            borderTop: '2px solid #44403c'
                        }}
                    >
                        <div className="container mx-auto px-4 py-4 space-y-2">
                            {navLinks.map((link, idx) => {
                                const Icon = link.icon
                                const isActive = pathname === link.href
                                return (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div
                                                className={`p-3 rounded border-2 flex items-center gap-3 transition-all ${isActive
                                                        ? 'bg-amber-800 border-amber-600 text-amber-100'
                                                        : 'bg-stone-800 border-stone-600 text-stone-300'
                                                    }`}
                                                style={{ fontFamily: 'monospace' }}
                                            >
                                                <div className={`w-8 h-8 rounded border flex items-center justify-center ${isActive ? 'bg-amber-700 border-amber-500' : 'bg-stone-700 border-stone-500'
                                                    }`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold">{link.label.toUpperCase()}</span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navLinks.length * 0.1 }}
                                className="pt-2 border-t border-stone-700"
                            >
                                <AuthButton />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
