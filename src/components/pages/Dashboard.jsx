import { useState, useEffect } from "react";
import MetricCard from "@/components/molecules/MetricCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import ActivityModal from "@/components/organisms/ActivityModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { formatCurrency } from "@/utils/formatters";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showActivityModal, setShowActivityModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
      console.error("Dashboard loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveActivity = async (activityData) => {
    try {
      const newActivity = await activityService.create(activityData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <Loading rows={6} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  // Calculate metrics
  const totalDeals = deals.length;
  const pipelineValue = deals
    .filter(deal => !["Closed Won", "Closed Lost"].includes(deal.stage))
    .reduce((sum, deal) => sum + deal.amount, 0);
    
  const closedWonDeals = deals.filter(deal => deal.stage === "Closed Won");
  const wonValue = closedWonDeals.reduce((sum, deal) => sum + deal.amount, 0);
  
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyActivities = activities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    return activityDate.getMonth() === thisMonth && activityDate.getFullYear() === thisYear;
  });

  // Calculate trends (mock data for demo)
  const pipelineTrend = deals.length > 5 ? "up" : "down";
  const activitiesTrend = monthlyActivities.length > 10 ? "up" : "down";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Welcome back!</h1>
          <p className="text-secondary mt-1">Here&apos;s what&apos;s happening with your pipeline today.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={contacts.length}
          icon="Users"
          color="primary"
          trend="up"
          trendValue="+12%"
        />
        
        <MetricCard
          title="Active Deals"
          value={totalDeals}
          icon="GitBranch"
          color="info"
          trend={pipelineTrend}
          trendValue={pipelineTrend === "up" ? "+8%" : "-3%"}
        />
        
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(pipelineValue)}
          icon="DollarSign"
          color="success"
          trend="up"
          trendValue="+24%"
        />
        
        <MetricCard
          title="This Month"
          value={monthlyActivities.length}
          icon="Activity"
          color="warning"
          trend={activitiesTrend}
          trendValue={activitiesTrend === "up" ? "+15%" : "-5%"}
        />
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Overview</h2>
          <div className="space-y-4">
            {["Lead", "Qualified", "Proposal", "Closed Won"].map(stage => {
              const stageDeals = deals.filter(deal => deal.stage === stage);
              const stageValue = stageDeals.reduce((sum, deal) => sum + deal.amount, 0);
              const percentage = totalDeals > 0 ? (stageDeals.length / totalDeals) * 100 : 0;
              
              return (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">{stage}</span>
                      <span className="text-sm text-secondary">
                        {stageDeals.length} deals • {formatCurrency(stageValue)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-primary to-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
              <div>
                <p className="text-sm text-success font-medium">Won This Month</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(wonValue)}</p>
              </div>
              <div className="h-10 w-10 bg-success/20 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">{closedWonDeals.length}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
              <div>
                <p className="text-sm text-primary font-medium">Avg Deal Size</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(totalDeals > 0 ? pipelineValue / totalDeals : 0)}
                </p>
              </div>
              <div className="h-10 w-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">$</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <ActivityFeed 
        activities={activities.slice(0, 10)}
        onAdd={() => setShowActivityModal(true)}
        title="Recent Activities"
      />

      {/* Activity Modal */}
      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        contacts={contacts}
        deals={deals}
        onSave={handleSaveActivity}
      />
    </div>
  );
};

export default Dashboard;