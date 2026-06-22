import { AloeIcon } from "./AloeIcon";
import { PearlIcon } from "./PearlIcon";
import { CollagenIcon } from "./CollagenIcon";
import { SeaweedIcon } from "./SeaweedIcon";
import { BlueberryIcon } from "./BlueberryIcon";
import { HyaluronicIcon } from "./HyaluronicIcon";
import { LemonIcon } from "./LemonIcon";
import { HoneyIcon } from "./HoneyIcon";
import { ChamomileIcon } from "./ChamomileIcon";
import { RoseIcon } from "./RoseIcon";
import { AvocadoIcon } from "./AvocadoIcon";
import { PomegranateIcon } from "./PomegranateIcon";
import { SheetMaskIcon } from "./SheetMaskIcon";

interface ProductIconProps {
  iconType: string;
  size?: number;
  className?: string;
}

export function ProductIcon({ iconType, size = 100, className = "" }: ProductIconProps) {
  switch (iconType) {
    case "aloe":         return <AloeIcon size={size} className={className} />;
    case "pearl":        return <PearlIcon size={size} className={className} />;
    case "collagen":     return <CollagenIcon size={size} className={className} />;
    case "seaweed":      return <SeaweedIcon size={size} className={className} />;
    case "blueberry":    return <BlueberryIcon size={size} className={className} />;
    case "hyaluronic":   return <HyaluronicIcon size={size} className={className} />;
    case "lemon":        return <LemonIcon size={size} className={className} />;
    case "honey":        return <HoneyIcon size={size} className={className} />;
    case "chamomile":    return <ChamomileIcon size={size} className={className} />;
    case "rose":         return <RoseIcon size={size} className={className} />;
    case "avocado":      return <AvocadoIcon size={size} className={className} />;
    case "pomegranate":  return <PomegranateIcon size={size} className={className} />;
    default:             return <SheetMaskIcon size={size} className={className} />;
  }
}
