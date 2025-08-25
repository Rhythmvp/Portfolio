# Portfolio

A modern, responsive portfolio website built with Next.js, featuring AI-powered content personalization and secure communication options.

## Features

### 🎨 **Modern Design**
- Responsive design with dark theme
- Tailwind CSS with custom components
- Framer Motion animations
- Custom cursor effects
- Glow shadows and backdrop blur effects

### 📧 **Contact System**
- Contact form with validation using React Hook Form and Zod
- Server-side email sending via Nodemailer
- SMTP integration for reliable email delivery
- Toast notifications for user feedback

### 🔐 **Security Features**
- PGP public key download for secure communication
- Interactive PGP explanation popup for visitors
- Secure email transmission capabilities

### 🛠 **Technical Stack**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion
- **AI**: Google Gemini API
- **Email**: Nodemailer with SMTP
- **Validation**: Zod schema validation
- **Forms**: React Hook Form
- **TypeScript**: Full type safety

### 📱 **Components**
- Responsive header with navigation
- Hero section with animated content
- Skills showcase with interactive elements
- Projects gallery
- Contact form with real-time validation
- Custom UI components (buttons, cards, forms, etc.)


## Project Structure

```
src/
├── app/
│   ├── api/contact/          # Email sending API route
│   ├── actions.ts            # Server actions
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── contact.tsx          # Contact form
│   ├── header.tsx           # Navigation header
│   ├── hero.tsx             # Hero section
│   ├── projects.tsx         # Projects showcase
│   └── skills.tsx           # Skills section
├── hooks/                   # Custom React hooks
└── lib/
    ├── types.ts             # TypeScript definitions
    └── utils.ts             # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
