interface DashboardHeaderProps {
  heading: string;
  text?: string;
}

export function DashboardHeader({ heading, text }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="grid gap-1">
        <h1 className="font-heading text-2xl font-bold md:text-3xl">
          {heading}
        </h1>
        {text && <p className="text-muted-foreground text-sm">{text}</p>}
      </div>
    </div>
  );
}
