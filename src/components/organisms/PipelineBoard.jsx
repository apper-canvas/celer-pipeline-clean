import { useState, useEffect } from "react";
import DealCard from "@/components/molecules/DealCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const PipelineBoard = ({ deals, onDealMove, onDealEdit, onDealDelete, onDealAdd, selectedDeals = [], onSelectionChange }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const stages = [
    { id: "Lead", name: "Lead", color: "border-warning" },
    { id: "Qualified", name: "Qualified", color: "border-info" },
    { id: "Proposal", name: "Proposal", color: "border-primary" },
    { id: "Closed Won", name: "Closed Won", color: "border-success" },
    { id: "Closed Lost", name: "Closed Lost", color: "border-error" }
  ];

useEffect(() => {
    if (!onSelectionChange) return;
    
    // Clear selection if no deals match current selection
    const validSelectedDeals = selectedDeals.filter(id => 
      deals.some(deal => deal.Id === id)
    );
    
    if (validSelectedDeals.length !== selectedDeals.length) {
      onSelectionChange(validSelectedDeals);
    }
  }, [deals, selectedDeals, onSelectionChange]);

  const handleSelectDeal = (dealId, checked) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      onSelectionChange([...selectedDeals, dealId]);
    } else {
      onSelectionChange(selectedDeals.filter(id => id !== dealId));
    }
  };

  const getDealsForStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stage) => {
    return getDealsForStage(stage).reduce((sum, deal) => sum + deal.amount, 0);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e, stage) => {
    e.preventDefault();
    setDragOverStage(stage);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverStage(null);
    }
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    if (draggedDeal && draggedDeal.stage !== targetStage) {
      onDealMove(draggedDeal.Id, targetStage);
    }
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  const handleDragEnd = () => {
    setDraggedDeal(null);
    setDragOverStage(null);
  };

  return (
    <div className="flex space-x-6 overflow-x-auto pb-4">
      {stages.map(stage => {
        const stageDeals = getDealsForStage(stage.id);
        const stageValue = getStageValue(stage.id);
        const isDragOver = dragOverStage === stage.id;
        
        return (
          <div 
            key={stage.id}
            className={cn(
              "flex-shrink-0 w-80 bg-gray-50 rounded-lg transition-all duration-200",
              isDragOver && "bg-blue-50 ring-2 ring-primary ring-opacity-50"
            )}
            onDragOver={handleDragOver}
            onDragEnter={(e) => handleDragEnter(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
>
<div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <div className={cn("w-3 h-3 rounded-full mr-2", 
                    stage.color.replace("border-", "bg-")
                  )} />
                  {stage.name}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDealAdd(stage.id)}
                  className="text-xs"
                >
                  <ApperIcon name="Plus" className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary">
                  {stageDeals.length} deal{stageDeals.length !== 1 ? "s" : ""}
                </span>
                <span className="font-semibold gradient-text">
                  {formatCurrency(stageValue)}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {stageDeals.map(deal => (
<DealCard
                  key={deal.Id}
                  deal={deal}
                  onEdit={onDealEdit}
                  onDelete={onDealDelete}
                  isDragging={draggedDeal?.Id === deal.Id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal)}
                  onDragEnd={handleDragEnd}
                  isSelected={selectedDeals.includes(deal.Id)}
                  onSelect={onSelectionChange ? handleSelectDeal : undefined}
                />
              ))}
              
              {stageDeals.length === 0 && (
                <div className="text-center py-8 text-secondary">
                  <ApperIcon name="Inbox" className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No deals in this stage</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDealAdd(stage.id)}
                    className="mt-2 text-xs"
                  >
                    Add deal
                  </Button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;