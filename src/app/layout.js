import './globals.css'

export const metadata = {
  title: 'Octofriendly',
  description: 'Follow all members of an organization',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
