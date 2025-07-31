import { useRef, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { categories } from "./settings.config";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [activeCategory, setActiveCategory] = useState('general');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target instanceof HTMLElement) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        threshold: 0.5,
        root: null,
        rootMargin: "-50% 0px -50% 0px"
      }
    );

    if (contentRef.current) {
      const sections = contentRef.current.querySelectorAll<HTMLDivElement>('[id]');
      sections.forEach((section) => {
        sectionRefs.current[section.id] = section;
        observer.observe(section);
      });
    }

    return () => observer.disconnect();
  }, []);

  const scrollToCategory = (categoryId: string) => {
    const ref = sectionRefs.current[categoryId];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r flex-shrink-0">
        <div className="p-4 space-y-2 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeCategory === category.id
                  ? 'bg-gray-100 dark:bg-gray-800'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Icon icon={category.icon} className={`w-5 h-5 ${category.iconColor}`} />
              <span className="font-medium">{category.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div 
          ref={contentRef}
          className="h-full p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 scrollbar-track-transparent"
        >
          <div className="max-w-3xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}