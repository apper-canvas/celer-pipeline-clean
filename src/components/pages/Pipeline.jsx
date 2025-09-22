import { useState, useEffect } from "react";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import DealModal from "@/components/organisms/DealModal";
import BulkActionToolbar from "@/components/organisms/BulkActionToolbar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";
const Pipeline = () => {
const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [selectedDeals, setSelectedDeals] = useState([]);
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

  const handleSelectionChange = (selectedIds) => {
    setSelectedDeals(selectedIds);
  };

  const handleClearSelection = () => {
    setSelectedDeals([]);
  };

  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

  const bulkActions = [
    {
      label: "Update Stage",
      icon: "ArrowRight",
      handler: async (selectedIds) => {
        const stage = prompt(`Select stage (${stages.join(', ')}):`);
        if (stage && stages.includes(stage)) {
          await dealService.bulkUpdateStage(selectedIds, stage);
          await loadData();
          toast.success(`Updated stage for ${selectedIds.length} deals`);
        }
      }
    },
    {
      label: "Add Tags",
      icon: "Tag",
      handler: async (selectedIds) => {
        const tags = prompt("Enter tags (comma separated):");
        if (tags) {
          await dealService.bulkUpdateTags(selectedIds, tags.split(',').map(t => t.trim()));
          await loadData();
          toast.success(`Updated tags for ${selectedIds.length} deals`);
        }
      }
    },
    {
      label: "Mark as Won",
      icon: "CheckCircle",
      variant: "success",
      handler: async (selectedIds) => {
        if (confirm(`Mark ${selectedIds.length} deals as won?`)) {
          await dealService.bulkClose(selectedIds, "Closed Won");
          await loadData();
          toast.success(`Marked ${selectedIds.length} deals as won`);
        }
      }
    },
    {
      label: "Mark as Lost",
      icon: "XCircle",
      variant: "outline",
      handler: async (selectedIds) => {
        if (confirm(`Mark ${selectedIds.length} deals as lost?`)) {
          await dealService.bulkClose(selectedIds, "Closed Lost");
          await loadData();
          toast.info(`Marked ${selectedIds.length} deals as lost`);
        }
      }
    },
    {
      label: "Delete",
      icon: "Trash2",
      variant: "destructive",
      handler: async (selectedIds) => {
        if (confirm(`Delete ${selectedIds.length} deals? This cannot be undone.`)) {
          await dealService.bulkDelete(selectedIds);
          await loadData();
          toast.success(`Deleted ${selectedIds.length} deals`);
        }
      }
    }
  ];
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
      
      <BulkActionToolbar
        selectedItems={selectedDeals}
        onClearSelection={handleClearSelection}
        actions={bulkActions}
      />

<PipelineBoard
        deals={deals}
        onDealMove={handleDealMove}
        onDealEdit={handleDealEdit}
        onDealDelete={handleDealDelete}
        onDealAdd={handleDealAdd}
        selectedDeals={selectedDeals}
        onSelectionChange={handleSelectionChange}
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