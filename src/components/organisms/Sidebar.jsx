import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { name: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { name: "Contacts", path: "/contacts", icon: "Users" },
    { name: "Pipeline", path: "/pipeline", icon: "GitBranch" },
    { name: "Activities", path: "/activities", icon: "Activity" }
  ];

  const NavItem = ({ item }) => (
    <NavLink
      to={item.path}
      onClick={onClose}
      className={({ isActive }) => cn(
        "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-gradient-to-r from-primary/10 to-blue-50 text-primary border-r-2 border-primary" 
          : "text-secondary hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-primary"
      )}
    >
      {({ isActive }) => (
        <>
          <ApperIcon 
            name={item.icon} 
            className={cn(
              "h-5 w-5 transition-transform duration-200",
              isActive ? "text-primary scale-110" : "text-secondary group-hover:text-primary group-hover:scale-105"
            )} 
          />
          <span className={cn(
            "font-medium transition-all duration-200",
            isActive ? "text-primary font-semibold" : "text-secondary group-hover:text-primary"
          )}>
            {item.name}
          </span>
        </>
      )}
    </NavLink>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-16 flex-shrink-0 px-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold gradient-text">Pipeline Pro</h1>
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Zap" className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold gradient-text">Pipeline Pro</h1>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" className="h-5 w-5 text-secondary" />
                </button>
              </div>
              
              <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                  <NavItem key={item.name} item={item} />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;