import { FaceSmileIcon, GlobeAltIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import { roboto } from '@/app/ui/fonts';
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
    RevealFx
  } from "@/once-ui/components";

export default function RobLogo({
    isRobDay,
  }: {
    isRobDay: boolean;
  }) {
  return (
    isRobDay ? (
    <Row alignItems='center'>
    {/* <div
      className={`${roboto.className} flex flex-row items-center leading-none`}
    > */}
      <FaceSmileIcon className="h-6 w-6 md:h-12 md:w-12 rotate-[-15deg]" />
      {/* <p className="text-[28px] md:text-[44px] ">ROBDAY</p> */}
      <Text variant="display-default-s" >ROBDAY</Text>
      <FaceSmileIcon className="h-6 w-6 md:h-12 md:w-12 rotate-[15deg]" />
    {/* </div> */}
    </Row>
    ) : (
        <Row alignItems='center'>
    {/* <div
      className={`${roboto.className} flex flex-row items-center leading-none`}
    > */}
      <FaceFrownIcon className="h-6 w-6 md:h-12 md:w-12 rotate-[-15deg]" />
      {/* <p className="text-[28px] md:text-[44px] ">ROBDAY</p> */}
      <Text variant="display-default-s" >NOT ROBDAY</Text>
      <FaceFrownIcon className="h-6 w-6 md:h-12 md:w-12 rotate-[15deg]" />
    {/* </div> */}
    </Row>
    )
  );
}