
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useTransform, useScroll } from 'framer-motion'
import Image from 'next/image'
import { Terminal, ArrowDown } from 'lucide-react'

import type { HeroProps } from '@/lib/types'

const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0 },
}

export default function Hero({ content }: HeroProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const [input, setInput] = useState('')
  const [output, setOutput] = useState<string[]>([
    'Welcome to my portfolio! Type "help" for available commands.',
  ])
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  })

  // Auto scroll to bottom when new output appears
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()
    let response = ''

    switch (cmd) {
      case 'resume': {
        const link = document.createElement('a')
        link.href = '/RHythm Gupta_cv.pdf'
        link.download = '/RHythm Gupta_cv.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        response = 'Downloading resume...'
        break
      }
      case 'help':
        response =
          'Available commands:\n- resume: Download my resume\n- about: Learn about me\n- contact: Get my contact info\n- clear: Clear terminal'
        break
      case 'about':
        response =
          content.bio +
          '\n\nType "back" to return to help menu.'
        break
      case 'contact':
        response =
          'Email: <a href="mailto:rhythmpg05@gmail.com" class="text-green-400 underline">rhythmpg05@gmail.com</a>\n' +
          'LinkedIn: <a href="https://linkedin.com/in/rhythmgupta2405" target="_blank" class="text-green-400 underline">linkedin.com/in/rhythmgupta2405</a>\n' +
          'GitHub: <a href="https://github.com/rhythmvp" target="_blank" class="text-green-400 underline">github.com/rhythmvp</a>\n\n' +
          'Type "back" to return to help menu.'
        break
      case 'back':
        response =
          'Available commands:\n- resume: Download my resume\n- about: Learn about me\n- contact: Get my contact info\n- clear: Clear terminal'
        break
      case 'clear':
        setOutput([
          'Welcome to my portfolio! Type "help" for available commands.',
        ])
        return
      default:
        response = `Command "${command}" not found. Type "help" for available commands.`
    }

    setOutput((prev) => [...prev, `$ ${command}`, response])
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
    }
  }

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const position = useTransform(scrollYProgress, (pos) =>
    pos === 1 ? 'relative' : 'fixed'
  )

  return (
    <motion.section
      style={{ opacity }}
      ref={targetRef}
      className="relative h-screen flex flex-col items-center justify-center text-center md:text-left"
      id="hero"
    >
      <motion.div
        style={{ scale, position }}
        className="top-0 left-0 w-full h-full flex items-center justify-center"
      >
        <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl px-4">
          {/* Left side content */}
          <motion.div
            className="md:w-1/2"
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.2 } },
            }}
          >
            <motion.h3
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-green-400 mb-4"
            >
              Rhythm Gupta
            </motion.h3>
            <motion.h1
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="font-code text-lg text-green-500 tracking-widest uppercase mb-4"
            >
              {content.title}
            </motion.h1>
            <motion.h2
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="font-headline text-2xl md:text-3xl font-medium text-green-300 mb-8"
            >
              {content.subtitle}
            </motion.h2>
            <motion.p
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="max-w-2xl text-base md:text-lg text-gray-400 mb-6"
            >
              {content.bio}
            </motion.p>

            {/* Hacker CLI Terminal */}
            <motion.div
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              className="w-full max-w-md"
            >
              <button
                onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors mb-2"
              >
                <Terminal className="w-4 h-4" />
                <span className="text-sm">Open Terminal</span>
              </button>

              {isTerminalOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/90 backdrop-blur-sm border border-green-400/30 rounded-lg p-4 font-mono text-sm text-green-300 glow-shadow"
                >
                 <div
                      ref={terminalRef}
                      className="h-40 overflow-y-auto mb-2 space-y-1 custom-scrollbar"
                    >
                      {output.map((line, index) => (
                        <div
                          key={index}
                          className={line.startsWith('$') ? 'text-green-400' : 'text-green-300'}
                          dangerouslySetInnerHTML={{ __html: line.replace(/\n/g, '<br/>') }}
                        />
                      ))}
                    </div>

                  <div className="flex items-center gap-2">
                    <span className="text-green-400">$</span>
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1 bg-transparent outline-none text-green-300 placeholder-green-600 caret-green-400"
                      placeholder="Type 'help' for commands..."
                      autoFocus
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          {/* Right side image */}
          <motion.div
            variants={FADE_DOWN_ANIMATION_VARIANTS}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="mt-8 md:mt-0 md:w-1/2 flex justify-center md:justify-end"
          >
            <Image
              src="/_MG_0114.JPG"
              alt="My picture"
              width={300}
              height={300}
              className="rounded-full border-4 border-green-400/50 shadow-[0_0_15px_rgba(0,255,0,0.5)]"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll down hint */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 1,
          duration: 0.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        className="absolute bottom-10 flex items-center gap-2 text-green-400"
      >
        <ArrowDown className="w-4 h-4" />
        <span>Scroll to explore</span>
      </motion.div>
    </motion.section>
  )
}

