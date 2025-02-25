import { IconType } from "react-icons";

import {
  HiChevronUp,
  HiChevronDown,
  HiChevronRight,
  HiChevronLeft,
  HiOutlineArrowPath,
  HiCheck,
  HiOutlineSun,
  HiOutlineMoon,
  HiMiniQuestionMarkCircle,
  HiMiniMinus,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiMiniPlus,
  HiMiniUser,
  HiMiniXMark,
  HiEyeDropper,
  HiOutlineClipboard,
  HiOutlineMagnifyingGlass,
  HiCalendar,
  HiOutlineLink,
  HiExclamationTriangle,
  HiArrowUpRight,
  HiInformationCircle,
  HiExclamationCircle,
  HiCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlinePencil,
  HiOutlineCalendarDays,
  HiOutlineTrophy,
  HiOutlinePlay,
  HiOutlineStop,
  HiOutlineLightBulb,
  HiLightBulb
} from "react-icons/hi2";

import {
	PiHouseDuotone,
	PiUserCircleDuotone,
	PiGridFourDuotone,
	PiBookBookmarkDuotone,
	PiImageDuotone,
  PiNotebookDuotone,
  PiTrendUpDuotone,
  PiRewindCircleDuotone
} from "react-icons/pi";

import { AiOutlineDashboard } from "react-icons/ai";

import { RiVisaLine } from "react-icons/ri";

import { GiTeamIdea } from "react-icons/gi"

import { FaDiscord, FaGithub, FaGoogle, FaSlash } from "react-icons/fa6";

import { RxCross1, RxCrossCircled } from "react-icons/rx";

import { LuBan, LuCircle, LuCircleOff, LuCircleSlash2 } from "react-icons/lu";

export const iconLibrary: Record<string, IconType> = {
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  refresh: HiOutlineArrowPath,
  check: HiCheck,
  light: HiOutlineSun,
  dark: HiOutlineMoon,
  helpCircle: HiMiniQuestionMarkCircle,
  infoCircle: HiInformationCircle,
  warningTriangle: HiExclamationTriangle,
  errorCircle: HiExclamationCircle,
  checkCircle: HiCheckCircle,
  eyeDropper: HiEyeDropper,
  clipboard: HiOutlineClipboard,
  // person: HiMiniUser,
  person: PiUserCircleDuotone,
  close: HiMiniXMark,
  openLink: HiOutlineLink,
  discord: FaDiscord,
  google: FaGoogle,
  github: FaGithub,
  arrowUpRight: HiArrowUpRight,
  minus: HiMiniMinus,
  plus: HiMiniPlus,
  calendar: HiCalendar,
  calendarDays: HiOutlineCalendarDays,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  search: HiOutlineMagnifyingGlass,
  visa: RiVisaLine,
  security: HiOutlineShieldCheck,
  sparkle: HiOutlineSparkles,
  gallery: PiImageDuotone,
  home: PiHouseDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  edit: HiOutlinePencil,
  game: HiOutlineTrophy,
  notebook: PiNotebookDuotone,
  trendUp: PiTrendUpDuotone,
  play: HiOutlinePlay,
  stop: HiOutlineStop,
  rewind: PiRewindCircleDuotone,
  dashboard: AiOutlineDashboard,
  idea: GiTeamIdea,
  lightbulb: HiLightBulb,
  single: FaSlash,
  double: RxCross1,
  singleClosed: RxCrossCircled,
  singleDoubleClosed: LuCircleSlash2,
  tripleClosed: LuCircle
};
