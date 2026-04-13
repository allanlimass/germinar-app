interface DashboardHeaderProps {
  title: string;
  description: string;
}

export function DashboardHeader({ title, description }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </header>
  );
}
