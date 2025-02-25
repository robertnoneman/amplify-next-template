// "use client";

import {
  Column,
  Row,
  Heading,
  Background,
  Dialog,
  Button,
  Flex,
  Input,
  Textarea,
  Switch,
  TagInput,
  Select,
  Skeleton
} from "@/once-ui/components";

import RobdayLog from "@/app/ui/dashboard/robday-log";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { data, type Schema } from "@/amplify/data/resource";
import outputs from "@/amplify_outputs.json"
import { act, useEffect, useState } from "react";
import { getUrl } from 'aws-amplify/storage';
import { uploadData } from 'aws-amplify/storage';
import { MediaUpload } from "@/once-ui/modules";
import RobdaylogWrapper from "@/app/ui/dashboard/robdaylog-wrapper";
import { Suspense } from "react";
import RobdayLogSelector from "@/app/ui/dashboard/gallery/robdaylog-selector";


export default async function Page() {
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
          <Background
            mask={{
              x: 0,
              y: 0,
              radius: 200,
            }}
            position="absolute"
            gradient={{
              display: true,
              tilt: 0,
              opacity: 50,
              height: 30,
              width: 275,
              x: 100,
              y: 40,
              colorStart: "accent-solid-strong",
              colorEnd: "static-transparent",
            }}
          />
          <Background
            mask={{
              x: 100,
              y: 0,
              radius: 50,
              cursor: true
            }}
            position="absolute"
            gradient={{
              display: true,
              opacity: 80,
              tilt: -90,
              height: 220,
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
        <Column fillWidth alignItems="center" gap="32" position="relative">
          {/* <RobdayLogSelector /> */}
          <Suspense fallback={<Skeleton shape="block" width="xl" height="m" />}>
            <RobdaylogWrapper />
          </Suspense>
        </Column>
      </Column>
    </Column>
  )
}