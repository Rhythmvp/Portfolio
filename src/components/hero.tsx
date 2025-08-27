import { useState, useEffect, useRef } from 'react'
import { motion, useTransform, useScroll, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { Terminal, ArrowDown, Power, Minimize2, Maximize2, X, Bot, User } from 'lucide-react'

import type { HeroProps } from '@/lib/types'

const FADE_DOWN_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0 },
}

const TERMINAL_VARIANTS = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: -15,
    y: 50
  },
  show: { 
    opacity: 1, 
    scale: 1,
    rotateX: 0,
    y: 0,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    rotateX: -15,
    y: 50,
    transition: {
      duration: 0.3
    }
  }
}

const GLOW_VARIANTS = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2), 0 0 80px rgba(34, 197, 94, 0.1)",
      "0 0 25px rgba(34, 197, 94, 0.6), 0 0 50px rgba(34, 197, 94, 0.3), 0 0 100px rgba(34, 197, 94, 0.15)",
      "0 0 20px rgba(34, 197, 94, 0.4), 0 0 40px rgba(34, 197, 94, 0.2), 0 0 80px rgba(34, 197, 94, 0.1)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const MATRIX_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"

// AI Bot context about Rhythm Gupta
const RHYTHM_CONTEXT = `
You are an AI assistant integrated into Rhythm Gupta's portfolio terminal. Here's what you know about Rhythm:

PERSONAL INFO:
- Name: Rhythm Gupta
- Role: Full-Stack Developer & Software Engineer
- Location: India
- Passionate about building practical, high-impact web tools with clean UX.

TECHNICAL SKILLS (CONFIRMED):
- Frontend: React, TypeScript, JavaScript, Tailwind CSS, external CSS (prefers no Bootstrap), Three.js
- Backend: Python (Django, Flask/FastAPI basics), Node.js (Express)
- Databases: SQL (PostgreSQL/MySQL/real-time DBs), basic schema & query design
- AI/ML & NLP: TensorFlow, NLTK, spaCy; LLM integration (incl. Google Gemini API), chatbot design
- Realtime & Collaboration: WebRTC, WebSockets
- Cloud & DevOps: AWS, Docker, Kubernetes, Git; Netlify deployments
- Payments: Gateway integrations (e.g., Escrow); secure flows
- Security & Tooling: Kali Linux utilities (e.g., netcat), USB Rubber Ducky scripting, Raspberry Pi tinkering, Pwnagotchi experiments
- Methodology: Agile, flowcharts, mockups, rapid prototyping, CI/CD basics

PROJECTS & EXPERIENCE (SELECTED):
- Disaster Management Platform ("Hope Builders"):
  - White + dark-yellow theme; video background; SOS and donate buttons in navbar
  - Donation tracking (total collected vs. disbursed), donor-of-the-month gamification
  - Blood donor integration (friends2support.in)
  - Google Maps for nearby hospitals/fire/police; doctor-approved measures
  - Vision: instant aid via doctor collaboration; live location tracking
  - Created a supporting slide deck and deployment assets
- Job Board Platform:
  - Aggregated listings; advanced filters and search
  - Built-in chatbot using ML/NLP
  - Resume builder suite + templates; interview prep content and tips
  - Application tracking, personalized recommendations, job alerts
  - Minimal, professional UI with testimonial images and custom CSS
- Interactive 3D Newspaper:
  - Three.js experience: realistic newspaper look with 3D/flip effect
- AI/LLM Integrations:
  - Portfolio “terminal” chatbot with Gemini API support
  - Custom stalk-bot concept: analyzes public social profiles for job-fit signals
- Web Apps & Components:
  - Registration/auth page with password strength meter, email checks, autofill handling
  - UI polish tasks (weather icon SVG alignment, persistent footer behavior)
  - Netlify deployment troubleshooting and GitHub CI updates
- Systems & CS Foundations:
  - Algorithms: trees/graphs, Kahn’s topological sort, Dijkstra, Kruskal, etc.
  - OS topics: resource allocation, deadlock avoidance
- Hardware/Security Tinkering:
  - Rubber Ducky payload experiments, Raspberry Pi builds, Pwnagotchi setup
- Research/Materials (not primary focus):
  - Barium titanate—exploratory work/discussion

COMMUNITY & EVENTS:
- IEEE Club (Organizing team): drafted an event proposal (Aug 2025)
- Hackathon: participated and prepared idea submissions (Aug 2025)

INTERESTS:
- Open source contributions
- Modern web stacks and performance-first UX
- System architecture, scalability, and real-time features
- Practical cybersecurity tooling and automation

CONTACT:
- Email: rhythmpg05@gmail.com
- LinkedIn: linkedin.com/in/rhythmgupta2405
- GitHub: github.com/rhythmvp

GUIDELINES FOR THE BOT:
- Answer questions about Rhythm in a friendly, professional tone.
- Keep responses concise but informative.
- If asked about something not covered here, provide them that information but remind them to ask things certainly related to Rhythm's profile.
`;

export default function Hero({ content }: HeroProps) {
  const targetRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const matrixRef = useRef<HTMLCanvasElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const [input, setInput] = useState('')
  const [output, setOutput] = useState<{ type: 'system' | 'user' | 'ai' | 'command', content: string, timestamp?: string }[]>([
    { 
      type: 'system', 
      content: '<span class="text-green-400">[SYSTEM ONLINE]</span> Welcome to Rhythm Gupta\'s AI-powered terminal',
      timestamp: new Date().toLocaleTimeString()
    },
    { 
      type: 'system', 
      content: '<span class="text-cyan-400">[AI ASSISTANT]</span> I can answer questions about Rhythm or help with commands. Type "help" for available commands or just ask me anything!',
      timestamp: new Date().toLocaleTimeString()
    }
  ])
  const [isTerminalOpen, setIsTerminalOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  })

  // Matrix rain effect
  useEffect(() => {
    const canvas = matrixRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / 14)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#22c55e'
      ctx.font = '12px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
        ctx.fillText(text, i * 14, drops[i] * 14)

        if (drops[i] * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 50)
    return () => clearInterval(interval)
  }, [])

  // Mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = targetRef.current?.getBoundingClientRect()
    if (rect) {
      mouseX.set((e.clientX - rect.left - rect.width / 2) * 0.1)
      mouseY.set((e.clientY - rect.top - rect.height / 2) * 0.1)
    }
  }

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (terminalRef.current) {
      setTimeout(() => {
        terminalRef.current!.scrollTo({
          top: terminalRef.current!.scrollHeight,
          behavior: 'smooth'
        })
      }, 50)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [output])

  // Focus input when terminal opens
  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isTerminalOpen])

  // AI API call
  const callGeminiAPI = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${RHYTHM_CONTEXT}\n\nUser Question: ${prompt}\n\nRespond as Rhythm's AI assistant in the terminal. Keep it concise and helpful.`
        }),
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
      return data.response || "I'm having trouble connecting to my AI brain right now. Try asking about my skills, projects, or contact info using the standard commands!"
    } catch (error) {
      console.error('Gemini API Error:', error)
      return "My AI assistant is currently offline. You can still use standard commands like 'help', 'about', 'skills', or 'contact'!"
    }
  }

  const addOutput = (type: 'system' | 'user' | 'ai' | 'command', content: string) => {
    setOutput(prev => [...prev, { 
      type, 
      content, 
      timestamp: new Date().toLocaleTimeString() 
    }])
  }

  const handleCommand = async (command: string) => {
    if (!command.trim()) return

    const cmd = command.toLowerCase().trim()
    
    // Add user command to output
    addOutput('user', command)
    setIsTyping(true)

    let response = ''
    let isAIResponse = false

    // Standard commands
    switch (cmd) {
      case 'resume':
      case 'download resume':
      case 'cv': {
        const link = document.createElement('a')
        link.href = '/RHythm Gupta_cv.pdf'
        link.download = 'RHythm Gupta_cv.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        response = '<span class="text-green-400">[SUCCESS]</span> Downloading resume... <span class="animate-pulse">📄</span>'
        break
      }
      case 'help':
      case 'commands':
        response = `<span class="text-cyan-400">[AVAILABLE COMMANDS]</span>
<span class="text-green-400">help</span>     - Show this help menu
<span class="text-green-400">about</span>    - Learn about Rhythm
<span class="text-green-400">skills</span>   - View technical skills  
<span class="text-green-400">contact</span>  - Get contact information
<span class="text-green-400">projects</span> - View recent projects
<span class="text-green-400">resume</span>   - Download resume
<span class="text-green-400">clear</span>    - Clear terminal

<span class="text-yellow-400">[AI ASSISTANT]</span>
You can also ask me questions naturally like:
• "What technologies does Rhythm use?"
• "Tell me about Rhythm's experience" 
• "What projects has Rhythm worked on?"
• Or anything else about Rhythm!`
        break
      case 'about':
        response = `<span class="text-cyan-400">[ABOUT RHYTHM GUPTA]</span>
${content.bio}

<span class="text-green-400">💻 Passion:</span> Building scalable web applications
<span class="text-green-400">🎯 Focus:</span> User experience & clean code
<span class="text-green-400">🚀 Goal:</span> Creating innovative digital solutions`
        break
      case 'skills':
      case 'tech':
      case 'technologies':
        response = `<span class="text-cyan-400">[TECHNICAL EXPERTISE]</span>
<span class="text-green-400">Frontend:</span>    React, Next.js, Vue.js, TypeScript, Tailwind CSS
<span class="text-green-400">Backend:</span>     Node.js, Express, Python, Django, FastAPI  
<span class="text-green-400">Database:</span>    PostgreSQL, MongoDB, Redis, MySQL
<span class="text-green-400">Cloud/DevOps:</span> AWS, Docker, Vercel, Git, CI/CD
<span class="text-green-400">Mobile:</span>      React Native, Flutter
<span class="text-green-400">Other:</span>       REST APIs, GraphQL, WebSockets`
        break
      case 'contact':
      case 'reach out':
      case 'connect':
        response = `<span class="text-cyan-400">[CONTACT INFORMATION]</span>
<span class="text-green-400">📧 Email:</span>    <a href="mailto:rhythmpg05@gmail.com" class="text-green-400 underline hover:text-green-300">rhythmpg05@gmail.com</a>
<span class="text-green-400">💼 LinkedIn:</span> <a href="https://linkedin.com/in/rhythmgupta2405" target="_blank" class="text-green-400 underline hover:text-green-300">linkedin.com/in/rhythmgupta2405</a>
<span class="text-green-400">🔗 GitHub:</span>   <a href="https://github.com/rhythmvp" target="_blank" class="text-green-400 underline hover:text-green-300">github.com/rhythmvp</a>

<span class="text-yellow-400">Always open to discussing new opportunities! 🚀</span>`
        break
      case 'projects':
      case 'work':
        response = `<span class="text-cyan-400">[RECENT PROJECTS]</span>
<span class="text-green-400">🌐 Portfolio Website:</span> This interactive terminal you're using!
<span class="text-green-400">💼 Full-Stack Apps:</span> E-commerce platforms, SaaS applications
<span class="text-green-400">🔧 Open Source:</span>     Contributing to React and Next.js ecosystem
<span class="text-green-400">📱 Mobile Apps:</span>     Cross-platform apps with React Native

<span class="text-yellow-400">Check out my GitHub for more detailed project information!</span>`
        break
      case 'clear':
      case 'cls':
        setOutput([
          { 
            type: 'system', 
            content: '<span class="text-green-400">[SYSTEM ONLINE]</span> Terminal cleared. Welcome back!',
            timestamp: new Date().toLocaleTimeString()
          },
          { 
            type: 'system', 
            content: '<span class="text-cyan-400">[AI ASSISTANT]</span> Ready to help! Ask me anything about Rhythm or type "help" for commands.',
            timestamp: new Date().toLocaleTimeString()
          }
        ])
        setIsTyping(false)
        return
      default:
        // AI-powered responses for natural language
        isAIResponse = true
        response = await callGeminiAPI(command)
    }

    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    addOutput(isAIResponse ? 'ai' : 'command', response)
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isTyping && input.trim()) {
      handleCommand(input)
      setInput('')
    }
  }

  // NOTE: This getMessageIcon function is not used in the provided code, but it's a great utility to have for future use!
  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4 text-blue-400" />
      case 'ai':
        return <Bot className="w-4 h-4 text-purple-400" />
      case 'system':
        return <Terminal className="w-4 h-4 text-green-400" />
      default:
        return <span className="text-green-400">$</span>
    }
  }

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8])
  const position = useTransform(scrollYProgress, (pos) =>
    pos === 1 ? 'relative' : 'fixed'
  )

  return (
    <>
      {/* Matrix Background */}
      <canvas
        ref={matrixRef}
        className="fixed inset-0 pointer-events-none opacity-10 z-0"
      />
      
      <motion.section
        style={{ opacity }}
        ref={targetRef}
        className="relative h-screen flex flex-col items-center justify-center text-center md:text-left overflow-hidden"
        id="hero"
        onMouseMove={handleMouseMove}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black opacity-90">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
          <motion.div 
            className="absolute inset-0 opacity-20"
            animate={{
              background: [
                "radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
                "radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)",
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>

        <motion.div
          style={{ 
            scale, 
            position,
            x: springX,
            y: springY
          }}
          className="top-0 left-0 w-full h-full flex items-center justify-center relative z-10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl px-4 gap-8">
            {/* Left side content */}
            <motion.div
              className="lg:w-1/2 relative"
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.15 } },
              }}
            >
              {/* Glowing orb behind name */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.h3
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="font-headline text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-green-400 mb-4 relative"
                whileHover={{ 
                  scale: 1.05,
                  textShadow: "0 0 30px rgba(34, 197, 94, 0.8)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <motion.span
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(34, 197, 94, 0.5)",
                      "0 0 20px rgba(34, 197, 94, 0.8)",
                      "0 0 10px rgba(34, 197, 94, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Rhythm Gupta
                </motion.span>
              </motion.h3>

              <motion.h1
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="font-code text-lg text-green-500 tracking-widest uppercase mb-4"
              >
                <motion.span
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {content.title}
                </motion.span>
              </motion.h1>

              <motion.h2
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="font-headline text-2xl md:text-3xl font-medium text-green-300 mb-8"
              >
                {content.subtitle}
              </motion.h2>

              <motion.p
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="max-w-2xl text-base md:text-lg text-gray-400 mb-6 leading-relaxed"
              >
                {content.bio}
              </motion.p>

              {/* Enhanced Terminal Button */}
              <motion.div
                variants={FADE_DOWN_ANIMATION_VARIANTS}
                className="w-full max-w-lg relative z-20"
              >
                <motion.button
                  onClick={() => setIsTerminalOpen(!isTerminalOpen)}
                  className="flex items-center gap-3 text-green-400 hover:text-green-300 transition-all duration-300 mb-4 group bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg border border-green-400/30 hover:border-green-400/60"
                  whileHover={{ scale: 1.05, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={{ rotate: isTerminalOpen ? 90 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Terminal className="w-5 h-5" />
                  </motion.div>
                  <span className="text-base font-medium">
                    {isTerminalOpen ? 'Close Terminal' : 'Access Terminal'}
                  </span>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-400"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.button>
              </motion.div>

              {/* Fixed Terminal Overlay */}
              {isTerminalOpen && (
                <motion.div
                  variants={TERMINAL_VARIANTS}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="fixed inset-4 md:inset-8 lg:inset-16 xl:inset-24 z-50 flex items-center justify-center"
                  onClick={(e) => e.target === e.currentTarget && setIsTerminalOpen(false)}
                >
                  <motion.div
                    variants={GLOW_VARIANTS}
                    animate="animate"
                    // Removed fixed height and let flexbox handle it
                    className="flex flex-col bg-black/98 backdrop-blur-xl border border-green-400/60 rounded-2xl overflow-hidden relative w-full max-w-4xl h-full max-h-[80vh] shadow-2xl"
                    style={{
                      background: "linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(0,50,0,0.15) 100%)",
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-green-400/40 bg-green-400/10">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          className="w-4 h-4 rounded-full bg-red-500 cursor-pointer"
                          whileHover={{ scale: 1.3, boxShadow: "0 0 10px rgba(239, 68, 68, 0.6)" }}
                          onClick={() => setIsTerminalOpen(false)}
                        />
                        <motion.div 
                          className="w-4 h-4 rounded-full bg-yellow-500"
                          whileHover={{ scale: 1.3, boxShadow: "0 0 10px rgba(245, 158, 11, 0.6)" }}
                        />
                        <motion.div 
                          className="w-4 h-4 rounded-full bg-green-500"
                          whileHover={{ scale: 1.3, boxShadow: "0 0 10px rgba(34, 197, 94, 0.6)" }}
                        />
                      </div>
                      
                      <motion.div 
                        className="flex items-center gap-2 px-4 py-2 bg-black/50 rounded-lg border border-green-400/30"
                        animate={{
                          boxShadow: [
                            "0 0 5px rgba(34, 197, 94, 0.3)",
                            "0 0 15px rgba(34, 197, 94, 0.5)",
                            "0 0 5px rgba(34, 197, 94, 0.3)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Terminal className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-mono">
                          root@rhythmgupta:~$
                        </span>
                      </motion.div>

                      <motion.button
                        onClick={() => setIsTerminalOpen(false)}
                        className="w-8 h-8 flex items-center justify-center text-green-400/60 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>

                    {/* Terminal Content and Input */}
                    <div className="flex flex-col flex-1 p-6 font-mono overflow-hidden">
                      {/* Terminal Output Area (This is the only part that should scroll) */}
                      <div
                        ref={terminalRef}
                        className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-green-400/50 hover:scrollbar-thumb-green-400/70"
                        style={{ scrollBehavior: 'smooth' }}
                      >
                        {output.map((line, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.03 }}
                            className="text-green-300 leading-relaxed text-base break-words"
                            dangerouslySetInnerHTML={{ 
                              __html: line.content.replace(/\n/g, '<br/>') 
                            }}
                          />
                        ))}
                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-green-400 text-base flex items-center"
                          >
                            <span className="mr-2">...</span>
                            <span className="text-sm text-green-400/80">AI is processing...</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Command Input (This will stay fixed at the bottom) */}
                      <motion.div 
                        className="flex items-center gap-3 bg-green-400/10 backdrop-blur-sm rounded-xl p-4 border border-green-400/30 flex-shrink-0"
                        animate={{
                          borderColor: isTyping ? "rgba(34, 197, 94, 0.6)" : "rgba(34, 197, 94, 0.3)",
                          boxShadow: isTyping ? 
                            "0 0 20px rgba(34, 197, 94, 0.3)" : 
                            "0 0 10px rgba(34, 197, 94, 0.2)"
                        }}
                      >
                        <span className="text-green-400 font-bold text-lg flex-shrink-0">$</span>
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          disabled={isTyping}
                          className="flex-1 bg-transparent outline-none text-green-300 placeholder-green-600/60 caret-green-400 disabled:opacity-50 text-base min-w-0"
                          placeholder={isTyping ? "Processing..." : "Enter command..."}
                          autoFocus
                        />
                        <motion.div
                          animate={{ 
                            opacity: [0.3, 1, 0.3],
                            scale: isTyping ? [1, 1.2, 1] : 1
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-1 h-6 bg-green-400 rounded-full flex-shrink-0"
                        />
                      </motion.div>
                    </div>

                    {/* Terminal Stats Bar */}
                    <div className="flex items-center justify-between px-6 py-3 border-t border-green-400/30 bg-green-400/5 text-xs text-green-400/70">
                      <div className="flex items-center gap-4">
                        <span>Lines: {output.length}</span>
                        <span>Status: {isTyping ? 'Processing' : 'Ready'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-2 h-2 rounded-full bg-green-400"
                        />
                        <span>Connected</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>

            {/* Right side image */}
            <motion.div
              variants={FADE_DOWN_ANIMATION_VARIANTS}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.3 }}
              className="lg:w-1/2 flex justify-center lg:justify-end relative"
            >
              {/* Floating particles around image */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  animate={{
                    x: [0, Math.sin(i * 60) * 100],
                    y: [0, Math.cos(i * 60) * 100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `50%`,
                    top: `50%`,
                  }}
                />
              ))}

              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 10,
                  rotateX: -5,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative group perspective-1000"
                style={{ transformStyle: "preserve-3d" }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <Image
                  src="/_MG_0114.JPG"
                  alt="Rhythm Gupta"
                  width={350}
                  height={350}
                  className="relative rounded-full border-4 border-green-400/60 shadow-2xl"
                  style={{
                    filter: "drop-shadow(0 0 30px rgba(34, 197, 94, 0.4))",
                    transform: "translateZ(20px)"
                  }}
                />
                
                {/* Scanning line effect */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-green-400/30"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.5,
            duration: 0.8,
          }}
          className="absolute bottom-8 flex flex-col items-center gap-2 text-green-400 z-10"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="flex flex-col items-center gap-2"
          >
            <ArrowDown className="w-5 h-5" />
            <span className="text-sm font-medium">Explore Portfolio</span>
          </motion.div>
          
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-green-400 to-transparent"
            animate={{
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.section>
    </>
  )
}