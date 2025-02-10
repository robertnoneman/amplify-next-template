import {
  Card,
  Row,
  Column,
  Text,
  Background,
  Heading,
  Line,
} from "@/once-ui/components";
import { Gallery } from 'next-gallery';


export default function RobDayLogCard(
  {
    images,
  }: {
    images: { src: string, aspect_ratio: number }[];
  }
) {
  const widths = [200];
  const ratios = [2.2, 4];
  return (
    <Card
      padding="m"
      gap="4"
      >
      <Background
        mask={{
          cursor: true
        }}
        radius="xl"
        position="absolute"
        gradient={{
          display: true,
          opacity: 30,
          tilt: 0,
          height: 200,
          width: 120,
          x: 0,
          y: 0,
          colorStart: "accent-solid-strong",
          colorEnd: "neutral-alpha-weak",
        }}
      />
      {/* <Line height={0.25}/> */}
      <Heading variant="display-default-m" align="center">
        ROBDAY #100
      </Heading>
      <Line height={0.25}/>
      <Text variant="body-default-xs">03/17/2025</Text>
      <Text variant="body-default-xs">Weather: Hot Hot Hot - 69°</Text>
      <Line height={0.1} />
      <Heading variant="display-default-xs" align="left">
        ACTIVITIES
      </Heading>
      <Line height={0.1} />
      <Row>
        <Column>
          <Text variant="display-default-xs">Sucked it</Text>
          <Text variant="body-default-xs">Location: Your Mom's House</Text>
          <Text variant="body-default-xs">Rating: 99</Text>
          <Text variant="body-default-xs">Cost: She paid me actually</Text>
        </Column>
        <Column>
          <Text>Notes</Text>
          <Text variant="body-default-xs">I've had better</Text>
          {/* <Text>Images: [Explicit content blocked]</Text> */}
        </Column>
      </Row>
      <Column fillWidth fillHeight>
        <Gallery {...{ images, widths, ratios }} lastRowBehavior="fill" />
      </Column>
    </Card>
  )
}