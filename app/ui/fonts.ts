import { Inter, Lusitana, Roboto, Roboto_Flex, Roboto_Slab } from 'next/font/google';

export const inter = Inter({ subsets: ['latin'] });

export const lusitana = Lusitana({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const roboto = Roboto({
    weight: ['100', "400"],
    subsets: ['latin'],
});

export const robotoFlex = Roboto_Flex({
    weight: ['100', '400'],
    subsets: ['latin'],
});

export const robotoSlab = Roboto_Slab({
    weight: ['100', '400'],
    subsets: ['latin'],
});