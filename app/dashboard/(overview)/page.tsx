// "use client";


import CardWrapper from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import Image from "next/image";
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { roboto } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import {
  Column,
  Heading,
} from "@/once-ui/components";
import { Sidebar } from "@/once-ui/modules";
import styles from '@/app/dashboard/(overview)/styles.module.css';
import robday from '@/public/robday.jpeg';
import robdaycropblur from '@/public/robdaycropblur.jpeg';


export default async function Page() {
  return (
    <main>
      {/* <Sidebar /> */}
      <div className={`${styles.bgWrap} hidden md:block`}>
        <Image
          alt="Mountains"
          src={robdaycropblur}
          quality={100}
          placeholder="blur"
          fill={false}
          sizes="100vh"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <Column fillWidth alignItems="center" gap="32" padding="32" position="relative">
        <Heading wrap="balance" variant="display-default-l" align="center" marginBottom="16">
          DASHBOARD
        </Heading>
        HERE'S WHERE ALL THE STATS WILL BE!
      </Column>
      {/* <h1 className={`${roboto.className} text-white mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1> */}
      {/* <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className={`${roboto.className} mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8`}>
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoicesSkeleton />
        </Suspense>
      </div> */}
    </main>
  );
}