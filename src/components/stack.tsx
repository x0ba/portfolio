import { Icon } from "@iconify/react";
import type { StackItem } from "@/content";

interface StackProps {
  items: StackItem[];
}

export default function Stack({ items }: StackProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-xl sm:text-2xl">My Stack</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <div
            key={item.name}
            className="interactive-button flex items-center gap-1.5 text-sm text-muted-foreground bg-secondary px-2.5 py-1 rounded-md"
          >
            {item.iconName && (
              <Icon icon={item.iconName} width={16} height={16} />
            )}
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}
