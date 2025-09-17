import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ActivityItem from "@/components/molecules/ActivityItem";
import { cn } from "@/utils/cn";

const ActivityFeed = ({ activities, onAdd, title = "Recent Activities" }) => {
  const [filter, setFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const filterOptions = [
    { value: "all", label: "All Activities", icon: "Activity" },
    { value: "call", label: "Calls", icon: "Phone" },
    { value: "email", label: "Emails", icon: "Mail" },
    { value: "meeting", label: "Meetings", icon: "Calendar" },
    { value: "note", label: "Notes", icon: "FileText" }
  ];

  const filteredActivities = activities
    .filter(activity => filter === "all" || activity.type === filter)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const displayedActivities = showAll ? filteredActivities : filteredActivities.slice(0, 10);

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {filterOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center space-x-1",
                    filter === option.value
                      ? "bg-white text-primary shadow-sm"
                      : "text-secondary hover:text-gray-900"
                  )}
                >
                  <ApperIcon name={option.icon} className="h-3 w-3" />
                  <span className="hidden sm:inline">{option.label}</span>
                </button>
              ))}
            </div>
            
            <Button onClick={onAdd} size="sm" className="flex items-center space-x-2">
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>Log Activity</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {displayedActivities.length > 0 ? (
          <>
            {displayedActivities.map(activity => (
              <ActivityItem 
                key={activity.Id} 
                activity={activity}
                className="hover:bg-gray-50 transition-colors"
              />
            ))}
            
            {filteredActivities.length > 10 && !showAll && (
              <div className="p-4 text-center border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={() => setShowAll(true)}
                  className="text-sm"
                >
                  Show {filteredActivities.length - 10} more activities
                  <ApperIcon name="ChevronDown" className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center text-secondary">
            <ApperIcon name="Activity" className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">No activities found</p>
            <p className="mb-4">
              {filter === "all" 
                ? "Get started by logging your first activity."
                : `No ${filter} activities found. Try a different filter.`
              }
            </p>
            <Button onClick={onAdd} className="flex items-center space-x-2 mx-auto">
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>Log Activity</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;