'use client'

import type { PageContent } from '@/lib/types'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Key, Send, Info, ShieldCheck, Lock, UserCheck } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

type ContactProps = {
  content: PageContent['contact']
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
})

export default function Contact({ content }: ContactProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (data.success) {
        toast({
          title: "✅ Transmission Sent",
          description: "Your message has been securely dispatched.",
          variant: 'default',
          className: 'bg-primary text-primary-foreground border-accent',
        })
        form.reset()
      } else {
        toast({
          title: "❌ Transmission Failed",
          description: data.error || "There was an error sending your message.",
          variant: 'destructive',
          className: 'bg-destructive text-destructive-foreground border-accent',
        })
      }
    } catch (error) {
      toast({
        title: "❌ Transmission Failed",
        description: (error as Error).message || "There was an error sending your message.",
        variant: 'destructive',
        className: 'bg-destructive text-destructive-foreground border-accent',
      })
    }
  }

  return (
    <section id="contact" className="w-full">
      <div className="text-center mb-12">
        <h2 className="font-headline text-4xl md:text-5xl font-bold text-primary drop-shadow-sm">
          {content.title}
        </h2>
        <p className="text-lg text-gray-400 mt-2">{content.description}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-accent font-headline">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your alias" {...field} className="bg-card/80 backdrop-blur-sm border border-accent/40 focus:ring-2 focus:ring-accent/70" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-accent font-headline">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your-secure@email.com" {...field} className="bg-card/80 backdrop-blur-sm border border-accent/40 focus:ring-2 focus:ring-accent/70" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-accent font-headline">Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your encrypted message here..." {...field} className="bg-card/80 backdrop-blur-sm min-h-[150px] border border-accent/40 focus:ring-2 focus:ring-accent/70" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/80 text-primary-foreground font-bold font-headline shadow-lg shadow-accent/20">
                <Send className="mr-2 h-4 w-4" />
                Send Transmission
              </Button>

              {/* PGP Key Button + Info */}
              <div className="flex flex-col flex-1 items-center relative">
                <Button asChild variant="outline" size="lg" className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-bold font-headline">
                  <a href="/pgp-key.asc" download>
                    <Key className="mr-2 h-4 w-4" />
                    Download PGP Key
                  </a>
                </Button>

                <div className="mt-2 flex items-center justify-center w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        className="text-xs text-muted-foreground hover:text-accent flex items-center gap-1 focus:outline-none underline underline-offset-2"
                        type="button"
                      >
                        What is this?
                        <Info className="w-3 h-3" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-gray-900/95 border border-accent/50 text-gray-200 shadow-xl max-w-xs text-sm font-sans leading-relaxed space-y-3 rounded-lg p-4">
                      <div className="font-bold text-accent mb-2">PGP Key Explained 🔐</div>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <UserCheck className="w-4 h-4 text-accent mt-1" />
                          <p><b>Proof of Identity:</b> Messages signed with my key are verifiably mine.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Lock className="w-4 h-4 text-accent mt-1" />
                          <p><b>Encryption:</b> You can send me confidential info (like offers) that only I can decrypt.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <ShieldCheck className="w-4 h-4 text-accent mt-1" />
                          <p><b>Security Mindset:</b> Including this key shows I value privacy & secure communication.</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-3">
                        Curious how to use it? Just ask me — happy to guide. 😊
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </motion.div>
    </section>
  )
}
