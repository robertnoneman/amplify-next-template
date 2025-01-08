"use client";

import React, { useState } from "react";

import {
  Heading,
  Text,
  Button,
  Icon,
  InlineCode,
  Logo,
  Input,
  Avatar,
  AvatarGroup,
  Textarea,
  PasswordInput,
  SegmentedControl,
  SmartLink,
  Dialog,
  Feedback,
  SmartImage,
  Line,
  LogoCloud,
  Background,
  Select,
  useToast,
  Card,
  Fade,
  StatusIndicator,
  DateRangePicker,
  DateRange,
  TiltFx,
  HoloFx,
  IconButton,
  TagInput,
  Switch,
  Column,
  Row,
  StyleOverlay,
  Flex,
  DateInput,
  Skeleton,
} from "@/once-ui/components";
import { CodeBlock, MediaUpload } from "@/once-ui/modules";
import Link from 'next/link';
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx';
import { roboto } from '@/app/ui/fonts';
import { usePathname } from 'next/navigation';
import { getNextRobDay } from "@/app/lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', current: true },
  { name: 'Activities', href: '/dashboard/activities', current: false },
  { name: 'Planner', href: '/dashboard/planner', current: false },
  { name: 'Archive', href: '#', current: false },
]

export default function Page() {
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange>();
  const [isFirstDialogOpen, setIsFirstDialogOpen] = useState(false);
  const [isSecondDialogOpen, setIsSecondDialogOpen] = useState(false);
  const [firstDialogHeight, setFirstDialogHeight] = useState<number>();
  // const { addToast } = useToast();
  const [intro, setIntro] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tags, setTags] = useState<string[]>(["UX / UI", "Design systems", "AI / ML"]);
  const [twoFA, setTwoFA] = useState(false);

  const handleSelect = (value: string) => {
    console.log("Selected option:", value);
    setSelectedValue(value);
  };

  const pathname = usePathname();
  return (
    <Column fillWidth paddingY="80" paddingX="s" alignItems="center" flex={1}>
      <Fade
        zIndex={3}
        pattern={{
          display: true,
          size: "4",
        }}
        position="fixed"
        top="0"
        left="0"
        to="bottom"
        height={5}
        fillWidth
        blur={0.25}
      />
      <Row position="fixed" top="0" fillWidth justifyContent="center" zIndex={3}>
        <Row
          data-border="rounded"
          justifyContent="space-between"
          maxWidth="l"
          paddingRight="64"
          paddingLeft="32"
          paddingY="20"
        >
          <Logo size="m" icon={false} href="https://itsrobday.com" />
          <Row gap="12" hide="s">
            <Button
              href="https://github.com/robertnoneman/amplify-next-template"
              prefixIcon="github"
              size="s"
              label="GitHub"
              weight="default"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row>
          <Row gap="16" show="s" alignItems="center" paddingRight="24">
            <IconButton
              href="https://github.com/robertnoneman/amplify-next-template"
              icon="github"
              variant="tertiary"
            />
            <StyleOverlay top="20" right="24" />
          </Row>
        </Row>
      </Row>
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
        >
          <Background
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
          />
          <Background
            mask={{
              x: 80,
              y: 0,
              radius: 100,
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
              radius: 100,
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
          <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
            {/* <InlineCode radius="xl" shadow="m" fit paddingX="16" paddingY="8">
              Start by editing
              <Text onBackground="brand-medium" marginLeft="8">
                app/page.tsx
              </Text>
            </InlineCode> */}
            <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
              On the next Robday...
            </Heading>
          </Column>

          <Row
            padding="32"
            fillWidth
            gap="64"
            position="relative"
            mobileDirection="column"
            alignItems="center"
          >
            {/* <Background
              fill
              position="absolute"
              gradient={{
                display: true,
                opacity: 10,
                tilt: 0,
                height: 100,
                width: 100,
                x: 50,
                y: 0,
                colorStart: "brand-solid-strong",
                colorEnd: "static-transparent",
              }}
            /> */}
            <Column
              fillWidth
              background="surface"
              radius="xl"
              border="neutral-medium"
              overflow="hidden"
              padding="32"
              gap="40"
              position="relative"
            >
              <Row fillWidth justifyContent="center">
                <DateRangePicker
                  data-scaling="100"
                  size="l"
                  fitWidth
                  gap="40"
                  mobileDirection="column"
                  onChange={(range) => setSelectedRange(range)}
                  value={selectedRange}
                />
              </Row>
            </Column>
          </Row>
          {/* <Card fillWidth> */}
            <Row
              fillWidth 
              transition="macro-medium"
              padding="32"
              gap="64"
              position="relative"
            >
              <Column
                background="accent-alpha-weak"
                // direction="column"
                overflow="hidden"
                padding="32"
                gap="40"
                border="neutral-medium"
                radius="xl"
                fillWidth
                >
                <Row fillWidth justifyContent="space-between">
                  <DateInput
                    id="date-input"
                    label="Date"
                    value={getNextRobDay()}>
                  </DateInput>
                  <Icon
                    name="calendarDays"
                    size="l"
                    onBackground="neutral-medium"
                  />
                </Row>
                <Heading variant="display-default-m">
                  Activities
                </Heading>
                <Line/>
                <Row 
                  fillWidth
                  padding="32"
                  gap="64"
                  position="relative"
                  // border="brand-medium"
                  // radius="l"
                >
                  <Background
                    mask={{
                      cursor: true
                    }}
                    position="absolute"
                    border="brand-alpha-weak"
                    radius="xl"
                    gradient={{
                      colorEnd: 'static-transparent',
                      colorStart: 'accent-solid-strong',
                      display: true,
                      height: 100,
                      opacity: 50,
                      tilt: 0,
                      width: 150,
                      x: 0,
                      y: 0
                    }}
                  >
                    <Text
                      padding="12" align="center" onBackground="neutral-strong" variant="body-default-xs"
                    >
                      Activity 1
                    </Text>
                  </Background>
                </Row>
                <Row 
                  fillWidth
                  padding="32"
                  gap="64"
                  position="relative"
                  // border="brand-medium"
                  // radius="l"
                >
                  <Background
                    mask={{
                      cursor: true
                    }}
                    position="absolute"
                    border="brand-alpha-weak"
                    radius="xl"
                    gradient={{
                      colorEnd: 'static-transparent',
                      colorStart: 'accent-solid-strong',
                      display: true,
                      height: 100,
                      opacity: 50,
                      tilt: 0,
                      width: 150,
                      x: 0,
                      y: 0
                    }}
                  >
                    <Text
                      padding="12" align="center" onBackground="info-strong" variant="body-default-xs"
                    >
                      Activity 2
                    </Text>
                  </Background>
                </Row>
                {/* <Skeleton
                  shape="line"
                  width="m"
                  height="xl"/>
                <Skeleton
                  shape="line"
                  width="m"
                  height="xl"/> */}
              </Column>
              
            </Row>
          {/* </Card> */}
        </Column>
      </Column>
    </Column>
  );
}