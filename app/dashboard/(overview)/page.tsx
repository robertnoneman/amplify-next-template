// "use client";


import {
  Column,
  Heading,
  Row,
  Text
} from "@/once-ui/components";
import RadialBar from '@/app/ui/dashboard/radial-bar';
import ActivitiesTable from '@/app/ui/dashboard/activities-table';


interface MyComponentProps {
  labels: string[];
  series: number[];
}


export default async function Page() {
  const myComponentProps = {
    labels: ["ROBDAYS COMPLETED"],
    series: [15]
  };

  return (
    <main>
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
        <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
          DASHBOARD
        </Heading>
        <Row mobileDirection="column">
          <RadialBar labels={["ROBDAYS COMPLETED"]} series={[15]} />
        </Row>
        <Row mobileDirection="column">
          <RadialBar labels={["AVERAGE ROBDAY RATING"]} series={[99]} height={200} fontSize="14px" />
          <RadialBar labels={["AVERAGE ROBDAY COST"]} series={[25]} colors={["#01CF38", "#FD6325"]} height={200} fontSize="14px" />
          <RadialBar labels={["UNIQUE ACTIVITIES DONE"]} series={[12]} colors={["#FD6325"]} height={200} fontSize="14px" />
        </Row>
        <ActivitiesTable />
      </Column>
    </main>
  );
}