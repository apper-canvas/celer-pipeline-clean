import { useState, useEffect } from "react";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import ActivityModal from "@/components/organisms/ActivityModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load activities. Please try again.");
      console.error("Activities loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAdd = () => {
    setShowModal(true);
  };

  const handleSave = async (activityData) => {
    try {
      const newActivity = await activityService.create(activityData);
      setActivities(prev => [newActivity, ...prev]);
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <Loading rows={5} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (activities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Activities</h1>
            <p className="text-secondary mt-1">Track all your customer interactions and communications.</p>
          </div>
        </div>

        <Empty
          title="No activities logged"
          message="Start tracking your customer interactions by logging your first activity."
          actionLabel="Log Activity"
          onAction={handleAdd}
          icon="Activity"
        />

        <ActivityModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          contacts={contacts}
          deals={deals}
          onSave={handleSave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Activities</h1>
          <p className="text-secondary mt-1">Track all your customer interactions and communications.</p>
        </div>
      </div>

      <ActivityFeed 
        activities={activities}
        onAdd={handleAdd}
        title="All Activities"
      />

      <ActivityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        contacts={contacts}
        deals={deals}
        onSave={handleSave}
      />
    </div>
  );
};

export default Activities;