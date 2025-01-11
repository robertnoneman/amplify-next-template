"use client";

import {
    Column,
    Heading,
    Background,
    Carousel,
    Row
  } from "@/once-ui/components";




export default function Page() {
    return (
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
        <Column 
          fillWidth
          alignItems="center"
          gap="48"
          radius="xl"
          paddingTop="m"
          // paddingBottom="80"
          // background="accent-weak"
          // border="neutral-alpha-weak"
          position="relative">
          
          <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
            GAMES
          </Heading>
          HERE'S WHERE ALL THE AWESOME GAMES WILL BE!
        </Column>
      <Row style={{width: "50%"}} >
        <Carousel
          aspectRatio="1 / 1"
          indicator="line"
          sizes="l"
          images={[
            {
              alt: 'Darts',
              src: '/dartboard.png',
              link: '/dashboard/games/darts'
            },
            {
              alt: 'fooleyball',
              src: '/fooleyball.png',
              link: '/dashboard/games/fooleyball'
            },
            {
              alt: 'Tennis',
              src: '/tennis.png',
              link: '/dashboard/games/tennis'
            },
          ]}
        />
      </Row>
        
      </Column>
    )
  }