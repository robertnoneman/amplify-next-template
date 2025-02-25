"use client";

import RobLogo from '@/app/ui/rob-logo';
import { useState, useEffect, useRef } from "react";
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
// import Confetti from 'react-confetti';
import confetti from "canvas-confetti";
import Pride from "react-canvas-confetti/dist/presets/pride";
import ReactCanvasConfetti from "react-canvas-confetti";

export default function Page() {
  const [isRedirectDialogOpen, setIsRedirectDialogOpen] = useState(false);
  const [commonOptions, setCommonOptions] = useState({});
  const [commonOptions2, setCommonOptions2] = useState({});

  // const { width, height } = useWindowSize()

  const angles = [60, 120];
  const doubleAngles = angles.concat(angles);

  function onRedirect() {
    console.log("Redirecting to itsnotrobday.com");
  };

  const instance = useRef<any>(null);
  
  const onInit = ({ confetti }: { confetti: any }) => {
    instance.current = confetti;
  };
  
  const fire = () => {
    doubleAngles.forEach((angle, index) => {
      setTimeout(() => {
        instance.current && instance.current({
          ...commonOptions,
          angle
        });
      }, index * 200);
    });
    doubleAngles.forEach((angle, index) => {
      setTimeout(() => {
        instance.current && instance.current({
          ...commonOptions2,
          angle
        });
      }, index * 200);
    });
  };

  useEffect(() => {
    if (!isRobDay()) {
      setIsRedirectDialogOpen(true);
    };
    setCommonOptions({
      spread: 55,
      // ticks: 200,
      gravity: .8,
      // decay: 0.9,
      startVelocity: 20,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      particleCount: 3,
      shapes: [confetti.shapeFromText({text: "☹️"}), confetti.shapeFromText({text:"😒"})],
      scalar: 3,
      // flat: true,
      origin: {x: 0.0, y: 0.3 }
    });
    setCommonOptions2({
      spread: 55,
      // ticks: 200,
      gravity: .8,
      // decay: 0.9,
      startVelocity: 30,
      colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
      particleCount: 10,
      shapes: [confetti.shapeFromText({text: "☹️"}), confetti.shapeFromText({text: "😒"})],
      scalar: 2,
      origin: {x: 1.0, y: 0.3 },
      flat: true
    });
    // fire();
  }, []);


  return (
    <Column fillWidth paddingY="0" paddingX="0" alignItems="center" flex={1} onClick={() => fire()}>
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
        <Row height={10} fillWidth background="accent-strong" alignItems="flex-end" justifyContent='space-between'>
            <RobLogo isRobDay={isRobDay()}/>
        </Row>
        
        <Row style={{height: "95%"}} />
        
        <Row justifyContent='center' alignItems='center'>
          <CountdownToMonday/>
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
              // onClick={() => fire()}
              >
              <Row justifyContent='space-within' alignItems='center' paddingX="12" paddingY="12">
                <Column paddingX="12" paddingY="12">
                  <Text variant="display-default-m" onSolid="brand-strong">
                    {isRobDay() ? "Happy Robday!" : "It's not Robday ☹️"}
                    <br></br><br/>
                  </Text>
                  <Text>
                    {isRobDay() ? "It's Robday! 🎉" : "Bummer..."}<br/>
                    When it's Robday, try <br/>
                  </Text>
                  <SmartLink href="https://itsnotrobday.com" style={{color: "#0070f3", margin: 0}}>
                    <b>itsrobday.com</b>
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
              {/* <Column>
                <CountdownToMonday/>
              </Column> */}
            </Row>
          </Column>
        </Column>
        
        {/* <Pride autorun={{ speed: 60, duration: 5000, shapes: [confetti.shapeFromText({text: "☹️"})] }} /> */}
        <ReactCanvasConfetti onInit={onInit} />
      </Column>
      {/* <Dialog
          isOpen={isRobDay()}
          onClose={() => setIsRedirectDialogOpen(false)}
          title="It's not Robday "
          description="Bummer man."
          fillHeight
          footer={
            <>
              <Button variant="secondary" onClick={() => onRedirect()}>
                Take me to itsnotrobday.com
              </Button>
            </>
          }
        >
          <Flex
            fillWidth
            alignItems='center'
            justifyContent='center'
          >
            <CountdownToMonday/>
          </Flex>
        </Dialog> */}
    </Column>
  );
}