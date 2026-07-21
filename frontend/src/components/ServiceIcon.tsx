import {
  Armchair, Home, Building2, Store, ShoppingBag, Boxes, Sofa,
  LampDesk, Hammer, KeyRound, PaintRoller, Landmark,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Armchair, Home, Building2, Store, ShoppingBag, Boxes, Sofa,
  LampDesk, Hammer, KeyRound, PaintRoller, Landmark,
};

export default function ServiceIcon({ name, size = 26 }: { name: string; size?: number }) {
  const Icon = ICONS[name] || Armchair;
  return <Icon size={size} strokeWidth={1.2} />;
}
