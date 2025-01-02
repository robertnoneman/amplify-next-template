import { FaceSmileIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { roboto } from '@/app/ui/fonts';

export default function RobLogo() {
  return (
    <div
      className={`${roboto.className} flex flex-row items-center leading-none text-white`}
    >
      <FaceSmileIcon className="h-12 w-12 rotate-[-15deg]" />
      <p className="text-[44px] "><strong>ROBDAY</strong></p>
      <FaceSmileIcon className="h-12 w-12 rotate-[15deg]" />
    </div>
  );
}