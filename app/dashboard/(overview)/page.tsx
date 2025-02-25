// "use client";


import {
  Column,
  Heading,
  Row,
  Grid,
  Text,
  Skeleton
} from "@/once-ui/components";
// import RadialBar from '@/app/ui/dashboard/radial-bar';
import RadialBarWrapper from "@/app/ui/dashboard/radial-bar-wrapper";
import ActivitiesTable from '@/app/ui/dashboard/activities-table';
import { Suspense } from "react";



export default async function Page() {
  

  return (
    <main>
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative" justifyContent="center">
        <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
          DASHBOARD
        </Heading>
        <Suspense fallback={<Skeleton shape="circle" width="xl" height="xl" />}>
          <RadialBarWrapper />
        </Suspense>
        <ActivitiesTable />
      </Column>
    </main>
  );
}