import RobLogo from '@/app/ui/rob-logo';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana, roboto } from '@/app/ui/fonts';
import Image from 'next/image';
import robdaycropblur from '@/public/robdaycropblur.jpeg';
import CountdownToMonday from './ui/CountdownToMonday';
import Banner from './ui/banner';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col p-0 bg-gray-800 bg-opacity-90">
        <div className="flex h-20 shrink-0 items-end rounded-lg bg-[#bb4444] text-white md:bg-opacity-90 p-4 justify-between md:h-52">
            <RobLogo />
        </div>
        <div className="">
            <Image
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
            />
            <div className="mt-4 flex grow flex-col gap-4 md:flex-row z-20">
                <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 bg-opacity-80 px-6 py-10 md:w-2/5 md:px-20">
                    <p
                        className={`${roboto.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
                    >
                        <strong>Happy Robday!</strong><br></br> {' '}
                        If it's not Robday, try <br></br>
                        <a href="https://itsnotrobday.com" className="text-blue-500">
                            itsnotrobday.com
                        </a>
                    </p>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        <span>Explore</span> <ArrowRightIcon className="w-5 md:w-6" />
                    </Link>
                </div>
                <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
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
                </div>
            </div>
        </div>
    </main>
  );
}