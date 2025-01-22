"use client";

import {
    Column,
    Heading,
    Background
  } from "@/once-ui/components";


export default function Page() {
    return (
      <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
        <Column
        overflow="hidden"
        as="main"
        maxWidth="l"
        position="relative"
        radius="xl"
        alignItems="center"
        border="neutral-alpha-weak"
        fillWidth
      >
        <Column
          fillWidth
          alignItems="center"
          gap="48"
          radius="xl"
          paddingTop="80"
          position="relative"
          background="surface"
        >
          {/* <Background
            mask={{
              x: 0,
              y: 48,
            }}
            position="absolute"
            grid={{
              display: true,
              width: "0.25rem",
              color: "neutral-alpha-medium",
              height: "0.25rem",
            }}
          /> */}
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 200,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: -35,
              height: 50,
              width: 75,
              x: 100,
              y: 40,
              colorStart: "accent-solid-medium",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 100,
              y: 0,
              radius: 200,
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 100,
              tilt: -35,
              height: 20,
              width: 120,
              x: 120,
              y: 35,
              colorStart: "brand-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
            ROBDAY MEMORIES
          </Heading>
          </Column>
        </Column>
        <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
          HERE'S WHERE ALL THE PRETTY PICTURES WILL BE!
        </Column>
      </Column>
    )
  }