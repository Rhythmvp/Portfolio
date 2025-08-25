'use client';

import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-white/10"
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <Terminal className="h-8 w-8 text-accent group-hover:animate-pulse" />
          <span className="text-xl font-bold font-headline text-gray-50 group-hover:text-accent transition-colors">
            Portfolio
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="#skills" className="text-gray-300 hover:text-accent transition-colors">/skills</Link>
            <Link href="#projects" className="text-gray-300 hover:text-accent transition-colors">/projects</Link>
            <Link href="#contact" className="text-gray-300 hover:text-accent transition-colors">/contact</Link>
          </nav>
        </div>
      </div>
    </motion.header>
  );
}
