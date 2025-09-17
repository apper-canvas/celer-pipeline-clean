import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by adding your first item.", 
  actionLabel = "Add Item", 
  onAction, 
  icon = "Inbox",
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-blue-100 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-secondary mb-6 max-w-md">
        {message}
      </p>
      {onAction && (
        <Button onClick={onAction} className="flex items-center space-x-2">
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </Button>
      )}
    </div>
  );
};

export default Empty;