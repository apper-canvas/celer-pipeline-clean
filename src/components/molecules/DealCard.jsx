import { useState } from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatDate, getProbabilityColor, getStageColor } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const DealCard = ({ 
  deal, 
  onEdit, 
  onDelete, 
  isDragging = false,
  className,
  ...props 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleEdit = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit?.(deal);
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete?.(deal);
  };

  return (
    <Card 
      className={cn(
        "p-4 cursor-move select-none border-l-4 transition-all duration-200",
        getStageColor(deal.stage),
        isDragging && "dragging",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {deal.title}
          </h3>
          <p className="text-xs text-secondary mt-1">
            {deal.contactName}
          </p>
        </div>
        
        <div className="relative ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <ApperIcon name="MoreVertical" className="h-4 w-4 text-secondary" />
          </button>
          
          {isMenuOpen && (
            <div className="absolute right-0 top-8 w-32 bg-white border rounded-md shadow-lg z-10">
              <button
                onClick={handleEdit}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
              >
                <ApperIcon name="Edit" className="h-3 w-3" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-error flex items-center space-x-2"
              >
                <ApperIcon name="Trash2" className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold gradient-text">
            {formatCurrency(deal.amount)}
          </span>
          <Badge 
            variant="primary" 
            className={getProbabilityColor(deal.probability)}
          >
            {deal.probability}%
          </Badge>
        </div>
        
        {deal.expectedCloseDate && (
          <div className="flex items-center space-x-1 text-xs text-secondary">
            <ApperIcon name="Calendar" className="h-3 w-3" />
            <span>Close: {formatDate(deal.expectedCloseDate)}</span>
          </div>
        )}
        
        {deal.notes && (
          <p className="text-xs text-secondary truncate">
            {deal.notes}
          </p>
        )}
      </div>
    </Card>
  );
};

export default DealCard;