// "use client";


import {
  Column,
  Heading,
  Row,
  Text
} from "@/once-ui/components";
import RadialBar from '@/app/ui/dashboard/radial-bar';
import ActivitiesTable from '@/app/ui/dashboard/activities-table';


export default async function Page() {
  return (
    <main>
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
        <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
          DASHBOARD
        </Heading>
        
        <RadialBar />
        <ActivitiesTable />
        
      </Column>
    </main>
  );
}