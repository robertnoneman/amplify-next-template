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
  const { width, height } = useWindowSize()

  useEffect(() => {
    if (!isRobDay()) {
      setIsRedirectDialogOpen(true);
    }
  }, []);

  function onRedirect() {
    console.log("Redirecting to itsnotrobday.com");
  }

  return (
    <Column fillWidth paddingY="0" paddingX="0" alignItems="center" flex={1}>
      {/* <Confetti
      width={width}
      height={height}
      recycle={false}
      // numberOfPieces={1000}
      tweenDuration={10000}
      /> */}
      <Column
        overflow="hidden"
        as="main"
        // maxWidth="l"
        position="relative"
        // radius="xl"
        alignItems="flex-start"
        // border="neutral-alpha-weak"
        fillWidth
      >
      <Pride autorun={{ speed: 60, duration: 5000 }} />
    {/* <main className="flex min-h-screen flex-col p-0 bg-gray-800 bg-opacity-90"> */}
        <Row height={5} fillWidth background="accent-strong" alignItems="flex-end" justifyContent='space-between'>
        {/* <div className="flex h-20 shrink-0 items-end rounded-lg bg-[#bb4444] text-white md:bg-opacity-90 p-4 justify-between md:h-52"> */}
            <RobLogo />
        {/* </div> */}
        </Row>
        {/* <Row position="absolute" background='accent-medium' fillWidth height={800} style={{zIndex: -20}}/> */}
        
          {/* <Image
                src={robdaycropblur}
                // width={1500}
                // height={160}
                sizes="100vh"
                // style={{
                //     objectFit: "contain",
                //     zIndex: -1,
                //     position: "fixed",
                //     }}
                // fill={false}
                alt="The Robs"
                // style={{transform: translate(0, 20)}}
                // className="hidden md:block"
                className="absolute inset-0 -z-10 size-full object-contain object-top md:object-top translate-y-20 opacity-20"
            /> */}
        {/* </Row> */}
        {/* <SmartImage 
          src="/robdaycropblur.jpeg"
          objectFit='cover'
          position='absolute'
          height={30}
          paddingRight="xl"
          // aspectRatio='16:9'
          style={{opacity: 50, objectFit: 'fill', height: '100vh', transform: 'translateX(-20%)'}}
        /> */}
        <div className="">
            {/* <Image
                src={robdaycropblur}
                // width={1500}
                // height={160}
                sizes="100vh"
                // style={{
                //     objectFit: "contain",
                //     zIndex: -1,
                //     position: "fixed",
                //     }}
                // fill={false}
                alt="The Robs"
                // className="hidden md:block"
                className="absolute inset-0 -z-10 size-full object-cover object-top md:object-top"
            /> */}
            {/* <div className="mt-4 flex grow flex-col gap-4 md:flex-row z-20"> */}
            <Column fillHeight justifyContent='center' padding="m">
                {/* <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 bg-opacity-80 px-6 py-10 md:w-2/5 md:px-20"> */}
                <Column height="m" justifyContent='center' radius="s" paddingX="4" paddingY="12" gap="4" alignItems="left" style={{backgroundColor: "rgba(255, 255, 255, 0.8)"}} border="surface">
                    <p
                        className={`${roboto.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
                    >
                        <b>Happy Robday!</b><br></br> {' '}
                        <Text>
                        When it's not Robday, try <br></br>
                        </Text>
                        <SmartLink href="https://itsnotrobday.com" style={{color: "#0070f3"}}>
                        itsnotrobday.com
                        </SmartLink>
                        {/* <a href="https://itsnotrobday.com" className="text-blue-500">
                            itsnotrobday.com
                        </a> */}
                    </p>
                    {/* <Link
                        href="/dashboard"
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        <span>Explore</span> <ArrowRightIcon className="w-5 md:w-6" />
                    </Link> */}
                    <br></br>
                    <Button
                      id="trigger"
                      variant="primary"
                      size="l"
                      href="/dashboard"
                      style={{backgroundColor: "#0070f3"}}
                    >
                      <Flex fillHeight>
                        Explore
                        <Arrow
                          trigger="#trigger"
                          color="onBackground"
                        />
                      </Flex>
                    </Button>
                </Column>
                {/* </div> */}
                {/* <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12"> */}
                    {/* Add Hero Images Here */}
                    {/* <Image
                        // src={robdaycropblur}
                        src="/robday.jpeg"
                        width={1500}
                        height={1600}
                        // sizes="100vh"
                        // style={{
                            //     objectFit: "cover",
                        //     zIndex: -1,
                        //     position: "fixed",
                        //   }}s
                        fill={false}
                        alt="Screenshots of the dashboard project showing desktop version"
                        className="hidden md:block"
                        />
                        <Image
                        src="/S+RGroupPics-122.jpg"
                        width={560}
                        height={620}
                        alt="Screenshot of the dashboard project showing mobile version"
                        className="block md:hidden"
                        /> */}
                {/* </div> */}
            {/* </div> */}
            </Column>
        </div>
        {/* <Flex fillWidth border="neutral-medium" background="page">
        
        </Flex> */}
    {/* </main> */}
      </Column>
      <Dialog
          isOpen={!isRobDay()}
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
        >
          <Flex
            fillWidth
            alignItems='center'
            justifyContent='center'
          >
            <CountdownToMonday/>
          </Flex>
        </Dialog>
    </Column>
  );
}