'use client'

import type { PageContent } from '@/lib/types'
import { motion } from 'framer-motion'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '@/components/ui/badge'
import { Code, Terminal } from 'lucide-react'

type ProjectsProps = {
  content: PageContent['projects']
}

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
}

export default function Projects({ content }: ProjectsProps) {
  return (
    <section id="projects" className="w-full">
      <div className="text-center mb-12">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">{content.title}</h2>
        <p className="text-lg text-gray-400 mt-2">{content.description}</p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="show"
        variants={{
          show: { transition: { staggerChildren: 0.2 } },
        }}
        viewport={{ once: true, amount: 0.1 }}
      >
        <Accordion type="single" collapsible className="w-full space-y-4">
          {content.projectList.map((project) => (
            <motion.div key={project.id} variants={FADE_UP_ANIMATION_VARIANTS}>
              <AccordionItem value={project.id} className="border border-primary/20 rounded-lg bg-card/80 backdrop-blur-sm overflow-hidden glow-shadow">
                <AccordionTrigger className="p-6 text-left hover:no-underline font-headline text-lg md:text-xl text-gray-100">
                  <div className='flex items-center gap-4'>
                    <Terminal className="h-6 w-6 text-accent flex-shrink-0" />
                    <span>{project.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-6 pt-0">
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <p className="text-gray-300 mb-6 leading-relaxed">{project.details}</p>
                  <div className="flex flex-wrap gap-2 items-center">
                    <Code className="h-4 w-4 text-accent" />
                    {project.tech.map((tech) => (
                      <Badge key={tech} variant="outline" className="border-accent text-accent font-mono">{tech}</Badge>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.div>
    </section>
  )
}
