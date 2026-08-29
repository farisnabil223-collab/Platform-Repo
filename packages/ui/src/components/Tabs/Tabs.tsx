import * as React from 'react';
import { cn } from '../../index';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  defaultTabId?: string;
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  className,
  tabs,
  defaultTabId,
  activeTabId,
  onTabChange,
  ...props
}) => {
  const [localTab, setLocalTab] = React.useState(defaultTabId || (tabs[0]?.id || ''));
  const currentTab = activeTabId !== undefined ? activeTabId : localTab;

  const handleTabClick = (id: string) => {
    if (activeTabId === undefined) {
      setLocalTab(id);
    }
    onTabChange?.(id);
  };

  const activeContent = tabs.find((t) => t.id === currentTab)?.content;

  return (
    <div className={cn('flex flex-col gap-4 w-full', className)} {...props}>
      {/* Tab List Header */}
      <div
        role="tablist"
        aria-label="Tabs Content"
        className="flex border-b border-border/60 overflow-x-auto scrollbar-none select-none"
      >
        {tabs.map((tab) => {
          const isActive = tab.id === currentTab;
          return (
            <button
              key={tab.id}
              id={`tab-control-${tab.id}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tab-panel-${tab.id}`}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 -mb-[2px] transition-all duration-150 focus-visible:outline-none whitespace-nowrap font-heading',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {tabs.map((tab) => {
        const isActive = tab.id === currentTab;
        return (
          <div
            key={tab.id}
            id={`tab-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-control-${tab.id}`}
            hidden={!isActive}
            className="focus-visible:outline-none"
            tabIndex={0}
          >
            {isActive && <div className="animate-fadeIn">{tab.content}</div>}
          </div>
        );
      })}
    </div>
  );
};
export default Tabs;
