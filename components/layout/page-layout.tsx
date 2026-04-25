interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export default function PageLayout({
  title,
  description,
  actions,
  children,
}: PageLayoutProps) {
  return (
    <div className="flex h-full flex-col gap-6 p-2">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-semibold md:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>

        {/* Actions */}
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {/* Children */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
