"use client";

import {
    Column,
    Heading,
  } from "@/once-ui/components";


export default function Page() {
    return (
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
        <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
          GALLERY
        </Heading>
        HERE'S WHERE ALL THE PRETTY PICTURES WILL BE!
      </Column>
    )
  }