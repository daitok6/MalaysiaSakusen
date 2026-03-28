import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  icon: string;
  label: string;
  value: string | React.ReactNode;
  subtitle?: string;
  className?: string;
};

export function StatCard({ icon, label, value, subtitle, className = "" }: StatCardProps) {
  return (
    <Card className={`${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold text-navy mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}
