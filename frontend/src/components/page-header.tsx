import { Fragment, ReactNode } from "react";

interface PageHeaderProps {
    title?: string;
    subtitle?: string;
    rightAction?: ReactNode;
    renderPageHeader?: ReactNode
  }
  
const PageHeader = ({ title, subtitle, rightAction,renderPageHeader }: PageHeaderProps) => {
    return (
      <div className="w-full pb-20 pt-4 px-4 sm:px-6 lg:px-8 bg-[#1a1e2a] text-white">
        <div className="w-full max-w-[var(--max-width)] mx-auto">
          {renderPageHeader 
          ? <Fragment>{renderPageHeader}</Fragment> 
          : (
            <div className="w-full flex flex-col gap-4 items-start sm:flex-row sm:items-center sm:justify-between">
              {(title || subtitle) && (
                <div className="space-y-1 min-w-0">
                  {title && <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight truncate">{title}</h2>}
                  {subtitle && <p className="text-white/60 text-sm truncate">{subtitle}</p>}
                </div>
              )}
              {rightAction && <div className="shrink-0">{rightAction}</div>}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PageHeader