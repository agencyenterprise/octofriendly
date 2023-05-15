import Head from "next/head";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  title: "Octofriendly",
  description: "Follow all members of a GitHub organization",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>
          Octofriendly - Automatically follow users from a Github organization
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/logo.png" />
        <meta
          name="title"
          content="Octofriendly - Automatically follow users from a Github organization"
        />
        <meta
          name="description"
          content="Octofriendly is an app that makes it easy to find and follow users in your Github organization. Use the Github API to get up to date data and find new people to follow. Get started now!"
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://octofriendly.com/" />
        <meta
          property="og:title"
          content="Octofriendly - Automatically follow users from a Github organization"
        />
        <meta
          property="og:description"
          content="Octofriendly is an app that makes it easy to find and follow users in your Github organization. Use the Github API to get up to date data and find new people to follow. Get started now!"
        />
        <meta property="og:image" content="https://octofriendly.com/og.png" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://octofriendly.com/" />
        <meta
          property="twitter:title"
          content="Octofriendly - Automatically follow users from a Github organization"
        />
        <meta
          property="twitter:description"
          content="Octofriendly is an app that makes it easy to find and follow users in your Github organization. Use the Github API to get up to date data and find new people to follow. Get started now!"
        />
        <meta
          property="twitter:image"
          content="https://octofriendly.com/og.png"
        />
      </Head>
      <body>{children}</body>
      <Script
        async
        defer
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      ></Script>
    </html>
  );
}
