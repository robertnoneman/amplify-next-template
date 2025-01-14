"use client";

import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";
import { headers } from "next/headers";
import { Metadata } from "next";
import { Header } from "@/app/ui/header";

import { baseURL, style, meta, og, schema, social } from "@/once-ui/resources/config";

import { Background, Flex, ToastProvider } from "@/once-ui/components";

import { Inter } from "next/font/google";
import { Raleway, Roboto_Mono, Roboto } from "next/font/google";

// const primary = Inter({
//   variable: "--font-primary",
//   subsets: ["latin"],
//   display: "swap",
// });

const primary = Roboto({
  variable: '--font-primary',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100']
});

const code = Roboto_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  display: "swap",
});

type FontConfig = {
  variable: string;
};


/*
	Replace with code for secondary and tertiary fonts
	from https://once-ui.com/customize
*/
// const secondary: FontConfig | undefined = Roboto({
//   variable: "--font-secondary",
//   subsets: ["latin"],
//   display: "swap",
//   });
const secondary = Roboto({
  variable: '--font-secondary',
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '400']
});

// const tertiary = Roboto({
//   variable: '--font-tertiary',
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['100', '400']
// });

// const secondary: FontConfig | undefined = undefined;
const tertiary: FontConfig | undefined = undefined;

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
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <Flex
        as="main"
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
        <ToastProvider>
          {/* <head>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify(schemaData),
              }}
            />
          </head> */}
          <Flex fillWidth direction="column" margin="0" padding="0">
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
            <Flex
						  fillWidth
						  minHeight="16">
					  </Flex>
            <Header />
            {children}
          </Flex>
        </ToastProvider>
      </Flex>
    );
  }