import type {Metadata} from 'next'
import {GeistSans} from 'geist/font/sans'
import {GeistMono} from 'geist/font/mono'
import {Analytics} from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Color Generator',
    description: 'Easy code generator',
    keywords: ["Color", "Colors", "Generator"],
    authors: [{name: "Michael Gesenhues"}],
    icons: {
        icon: "/Logo.png",
    },
    openGraph: {
        title: "Color Generator",
        description: "Easy color generator",
        type: "website",
        locale: "de_DE",
        images: [
            {
                url: "/Logo.png",
                width: 800,
                height: 600,
                alt: "Color Generator Logo",
            },
        ],
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics/>
        </body>
        </html>
    )
}
