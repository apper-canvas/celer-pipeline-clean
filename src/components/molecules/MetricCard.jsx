import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue, 
  color = "primary",
  className 
}) => {
  const colorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
    info: "text-info bg-info/10"
  };
  
  const getTrendIcon = () => {
    if (trend === "up") return "TrendingUp";
    if (trend === "down") return "TrendingDown";
    return "Minus";
  };
  
  const getTrendColor = () => {
    if (trend === "up") return "text-success";
    if (trend === "down") return "text-error";
    return "text-secondary";
  };

  return (
    <Card className={cn("p-6", className)} hover>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <p className="text-3xl font-bold gradient-text">{value}</p>
          {trendValue && (
            <div className="flex items-center mt-2">
              <ApperIcon 
                name={getTrendIcon()} 
                className={cn("h-4 w-4 mr-1", getTrendColor())} 
              />
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {trendValue}
              </span>
            </div>
          )}
        </div>
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;