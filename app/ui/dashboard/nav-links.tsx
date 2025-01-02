'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { GiDart } from "react-icons/gi";
import { TbTargetArrow } from "react-icons/tb";
import { GiBullseye, GiTennisRacket } from "react-icons/gi";
import { IconContext } from "react-icons";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { lusitana, robotoFlex } from '@/app/ui/fonts';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Darts',
    href: '/dashboard/darts',
    icon: GiBullseye,
  },
  { name: 'Tennis', href: '/dashboard/tennis', icon: GiTennisRacket },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <div className={robotoFlex.className}>
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-[#ea4444] hover:text-white md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-[#bb4444] text-white': pathname === link.href,
              },
            )}
          >
            <IconContext.Provider value={{ size: "3em" }}>
              <LinkIcon className="w-6" />
            </IconContext.Provider>
            <p className="hidden md:block">{link.name}</p>
          </Link>
          </div>
        );
      })}
    </>
  );
}