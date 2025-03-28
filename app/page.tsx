"use client";

import RobLogo from '@/app/ui/rob-logo';
import { useState, useEffect } from "react";
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana, roboto } from '@/app/ui/fonts';
import Image from 'next/image';
import robdaycropblur from '@/public/robdaycropblur.jpeg';
import CountdownToMonday from './ui/CountdownToMonday';
import Banner from './ui/banner';
import { 
    Background, 
    Heading,
    Fade, 
    Logo, 
    Button, 
    StyleOverlay, 
    IconButton,
    Icon,
    Row, 
    Text, 
    Input, 
    Column, 
    Flex,
    SmartImage,
    Switch,
    Dialog,
    Textarea,
    TagInput,
    TiltFx,
    Chip,
    Tag,
    RevealFx,
    SmartLink
  } from "@/once-ui/components";
import { isRobDay } from "@/app/lib/utils";
import { Arrow } from '@/once-ui/components/Arrow';
import { useWindowSize } from 'react-use';
import Confetti from 'react-confetti';
import Pride from "react-canvas-confetti/dist/presets/pride";

export default function Page() {
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [todayIsRobDay, setTodayIsRobDay] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    checkIfRobDay();
    console.log("Today is Robday?:", todayIsRobDay);
    if (todayIsRobDay) {
      setIsRedirectDialogOpen(true);
    }
  }, []);

  function onRedirect() {
    console.log("Redirecting to itsnotrobday.com");
  };

  function checkIfRobDay() {
    setTodayIsRobDay(isRobDay());
  };

  return (
    <Column fillWidth paddingY="0" paddingX="0" alignItems="center" flex={1}>
      <Column
        overflow="hidden"
        as="main"
        // maxWidth="l"
        position="relative"
        // radius="xl"
        // alignItems="flex-start"
        // border="neutral-alpha-weak"
        fillWidth
        fillHeight
      >
        <Row height={5} fillWidth background="accent-strong" alignItems="flex-end" justifyContent='space-between'>
            <RobLogo />
        </Row>
        <Column 
          fillHeight 
          justifyContent='flex-end' 
          // fillWidth 
          // minHeight={5}
        >
          <Column 
            // height={50} 
            background="surface" 
            justifyContent='flex-end' 
            paddingX="0" paddingY="0" gap="0" alignItems="left"
          >
            <Column paddingX="12" paddingY="12">
              <Text variant="display-default-m" onSolid="brand-strong">
                Happy Robday!<br></br><br/>
              </Text>
              <Text>
                When it's not Robday, try <br/>
              </Text>
              <SmartLink href="https://itsnotrobday.com" style={{color: "#0070f3", margin: 0}}>
                <b>itsnotrobday.com</b>
              </SmartLink>
                <br></br>
                <Button
                  id="trigger"
                  variant="primary"
                  size="l"
                  href="/dashboard"
                  style={{backgroundColor: "#0070f3"}}
                >
                  <Flex fillHeight justifyContent='center' alignItems='center'>
                    Explore
                    <Arrow
                      trigger="#trigger"
                      color="onBackground"
                      />
                  </Flex>
                </Button>
            </Column>
          </Column>
        </Column>
        
        {todayIsRobDay && (
          <Pride autorun={{ speed: 60, duration: 5000 }} />
        )}
      </Column>

      {!todayIsRobDay && (
      <Column 
        fillWidth
        fillHeight
        background="surface"
        position='absolute'
        alignItems='center'
        justifyContent='space-around'
        >
        {/* <Dialog
        isOpen={true}
        onClose={() => setIsRedirectDialogOpen(false)}
        title="It's not Robday 🙁"
        description="Bummer man."
        fillHeight
        footer={
          <>
            <Button variant="secondary" onClick={() => onRedirect()}>
              Take me to itsnotrobday.com
            </Button>
          </>
        }
      > */}
      <Column paddingTop="xl">
        <Heading as='h1' variant="display-default-l" onSolid="brand-strong">
          It's not Robday 🙁
        </Heading>
        <Text
          variant="body-default-s"
          onBackground="neutral-strong"
        >
          Bummer man.
        </Text>
      </Column>
        <Column
          fillWidth
          alignItems='center'
          justifyContent='center'
        >
          <CountdownToMonday/>
        </Column>
      {/* </Dialog> */}
        <Button 
          variant="secondary" 
          onClick={() => onRedirect()}
          href="https://itsnotrobday.com"
          arrowIcon
          >
          Take me to itsnotrobday.com
        </Button>
      </Column>
      )}

    </Column>
  );
}