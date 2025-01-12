import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./app.css";
import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import CountdownToMonday from './ui/CountdownToMonday';
import dynamic from 'next/dynamic'
import { Header } from "@/app/ui/header";
import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";
import { Background, Flex, ToastProvider } from "@/once-ui/components";
import { baseURL, style, meta, og, schema, social } from "@/once-ui/resources/config";
import classNames from "classnames";
import { Raleway, Roboto_Mono, Roboto } from "next/font/google";


const primary = Roboto({
  variable: '--font-primary',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100']
});

const secondary = Roboto({
  variable: '--font-secondary',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '400']
});

const tertiary = Roboto({
  variable: '--font-secondary',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '400']
});

const code = Roboto_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

type FontConfig = {
  variable: string;
};

// const inter = Inter({ subsets: ["latin"] });
const NoSSR = dynamic(() => import('./ui/CountdownToMonday'), { ssr: false })

export const metadata: Metadata = {
  title: "It's Robday!",
  description: "Happy Robday",
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": schema.type,
  url: "https://" + baseURL,
  logo: schema.logo,
  name: schema.name,
  description: schema.description,
  email: schema.email,
  sameAs: Object.values(social).filter(Boolean),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <html lang="en">
    <Flex
        as="html"
        lang="en"
        fillHeight
        background="page"
        data-neutral={style.neutral}
        data-brand={style.brand}
        data-accent={style.accent}
        data-border={style.border}
        data-theme={style.theme}
        data-solid={style.solid}
        data-solid-style={style.solidStyle}
        data-surface={style.surface}
        data-transition={style.transition}
        data-scaling={style.scaling}
        className={classNames(
          primary.variable,
          code.variable,
          secondary ? secondary.variable : "",
          tertiary ? tertiary.variable : "",
        )}
      >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData),
          }}
        />
      </head>
      {/* <body className={`${inter.className} antialiased`}> */}
        {/* <Header /> */}
        {/* {children} */}
      {/* <footer className="">
        <div className="bg-[#bb4444]">
            <NoSSR />
        </div>
      </footer> */}
      {/* </body> */}

      <ToastProvider>
          <Flex as="body" fillWidth direction="column" margin="0" padding="0" className={`antialiased`}>
            <Background
              position="absolute"
              mask={{
                x: 100,
                y: 0,
                radius: 100,
              }}
              gradient={{
                display: true,
                x: 100,
                y: 60,
                width: 70,
                height: 50,
                tilt: -40,
                opacity: 90,
                colorStart: "accent-background-strong",
                colorEnd: "page-background",
              }}
              grid={{
                display: true,
                opacity: 100,
                width: "0.25rem",
                color: "neutral-alpha-medium",
                height: "0.25rem",
              }}
            />
            {/* <Flex
						  fillWidth
						  minHeight="16">
					  </Flex> */}
            {/* <Header /> */}
            {children}
          </Flex>
        </ToastProvider>
    {/* </html> */}
    </Flex>
  );
}
