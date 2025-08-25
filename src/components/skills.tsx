'use client'

import type { PageContent } from '@/lib/types'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type SkillsProps = {
  content: PageContent['skills']
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Skills({ content }: SkillsProps) {
  return (
    <section id="skills" className="w-full">
      <div className="text-center mb-12">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary">{content.title}</h2>
        <p className="text-lg text-gray-400 mt-2">{content.description}</p>
      </div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {content.skillset.map((skill) => (
          <motion.div key={skill.name} variants={itemVariants}>
            <Card className="bg-card/80 border-primary/20 backdrop-blur-sm h-full hover:border-primary/50 transition-colors duration-300 glow-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-headline text-gray-100">{skill.name}</CardTitle>
                  <Badge variant="secondary" className="bg-primary/20 text-accent font-mono">{skill.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="w-full bg-primary/10 rounded-full h-2.5">
                  <motion.div
                    className="bg-gradient-to-r from-primary to-accent h-2.5 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-right text-sm text-accent font-mono mt-2">{skill.level}% proficiency</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
