import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const BulkActionToolbar = ({ 
  selectedItems, 
  onClearSelection, 
  actions,
  className 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedItems || selectedItems.length === 0) {
    return null;
  }

  const handleAction = async (action) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await action.handler(selectedItems);
      onClearSelection();
    } catch (error) {
      console.error('Bulk action error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={cn(
      "bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4 animate-in slide-in-from-top-2",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-primary font-medium">
            <ApperIcon name="CheckSquare" size={18} />
            <span>{selectedItems.length} selected</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={onClearSelection}
            disabled={isProcessing}
          >
            Clear selection
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={() => handleAction(action)}
              disabled={isProcessing}
              className={action.className}
            >
              <ApperIcon name={action.icon} size={16} className="mr-1" />
              {action.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BulkActionToolbar;