import CatSprite from '@/components/cat/CatSprite';
import { Card } from "@/components/ui/card";

export default function MainContent() {
  return (
    <Card className="fixed left-0 bottom-0 w-48 h-8 bg-background backdrop-blur-sm transition-all duration-300 hover:h-72 rounded-t-lg border-t border-x border-border/50">
      <div className="p-2">
        <CatSprite />
      </div>
    </Card>
  );
}