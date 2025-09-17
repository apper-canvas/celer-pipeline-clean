import { useState, useEffect } from "react";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [defaultStage, setDefaultStage] = useState("Lead");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load pipeline data. Please try again.");
      console.error("Pipeline loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDealMove = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === dealId);
      if (!deal) return;

      const updatedDeal = await dealService.update(dealId, { stage: newStage });
      setDeals(prev => prev.map(d => d.Id === dealId ? updatedDeal : d));
    } catch (error) {
      console.error("Failed to move deal:", error);
    }
  };

  const handleDealAdd = (stage) => {
    setSelectedDeal(null);
    setDefaultStage(stage);
    setShowModal(true);
  };

  const handleDealEdit = (deal) => {
    setSelectedDeal(deal);
    setShowModal(true);
  };

  const handleDealSave = async (dealData) => {
    try {
      if (selectedDeal) {
        const updatedDeal = await dealService.update(selectedDeal.Id, dealData);
        setDeals(prev => prev.map(d => d.Id === selectedDeal.Id ? updatedDeal : d));
      } else {
        const newDeal = await dealService.create(dealData);
        setDeals(prev => [newDeal, ...prev]);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDealDelete = async (dealId) => {
    try {
      await dealService.delete(dealId);
      setDeals(prev => prev.filter(d => d.Id !== dealId));
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <Loading rows={4} />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (deals.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Sales Pipeline</h1>
            <p className="text-secondary mt-1">Track and manage your deals through each stage.</p>
          </div>
        </div>

        <Empty
          title="No deals in pipeline"
          message="Start tracking your sales opportunities by creating your first deal."
          actionLabel="Add Deal"
          onAction={() => handleDealAdd("Lead")}
          icon="GitBranch"
        />

        <DealModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          deal={selectedDeal}
          contacts={contacts}
          onSave={handleDealSave}
          onDelete={handleDealDelete}
          defaultStage={defaultStage}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Sales Pipeline</h1>
          <p className="text-secondary mt-1">Track and manage your deals through each stage.</p>
        </div>
      </div>

      <PipelineBoard
        deals={deals}
        onDealMove={handleDealMove}
        onDealEdit={handleDealEdit}
        onDealDelete={handleDealDelete}
        onDealAdd={handleDealAdd}
      />

      <DealModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        deal={selectedDeal}
        contacts={contacts}
        onSave={handleDealSave}
        onDelete={handleDealDelete}
        defaultStage={defaultStage}
      />
    </div>
  );
};

export default Pipeline;