import ApperIcon from "@/components/ApperIcon";
import { formatDate, formatRelativeDate, getActivityIcon } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ActivityItem = ({ activity, showContact = true, className }) => {
  const iconName = getActivityIcon(activity.type);
  
  const typeColors = {
    call: "text-primary bg-primary/10",
    email: "text-info bg-info/10", 
    meeting: "text-success bg-success/10",
    note: "text-warning bg-warning/10",
    task: "text-secondary bg-secondary/10"
  };
  
  const colorClass = typeColors[activity.type] || typeColors.note;

  return (
    <div className={cn("flex items-start space-x-3 p-4", className)}>
      <div className={cn(
        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
        colorClass
      )}>
        <ApperIcon name={iconName} className="h-4 w-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">
            {activity.description}
          </p>
          <div className="text-xs text-secondary">
            {formatDate(activity.timestamp)}
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
            {activity.type}
          </span>
          {showContact && activity.contactName && (
            <span className="text-xs text-secondary">
              • {activity.contactName}
            </span>
          )}
          <span className="text-xs text-secondary">
            • {formatRelativeDate(activity.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;