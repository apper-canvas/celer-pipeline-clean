import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ApperIcon name="Menu" className="h-5 w-5 text-secondary" />
          </button>
          <h1 className="text-2xl font-bold gradient-text">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="relative">
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-error rounded-full flex items-center justify-center text-xs text-white">
              3
            </span>
          </Button>
          
          <div className="h-8 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;