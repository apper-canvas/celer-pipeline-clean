import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const DealModal = ({ 
  isOpen, 
  onClose, 
  deal, 
  contacts,
  onSave, 
  onDelete,
  defaultStage = "Lead"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    contactId: "",
    stage: defaultStage,
    amount: "",
    probability: "",
    expectedCloseDate: "",
    notes: ""
  });
  const [loading, setLoading] = useState(false);

  const stages = [
    { value: "Lead", label: "Lead" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal", label: "Proposal" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closed Lost", label: "Closed Lost" }
  ];

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || "",
        contactId: deal.contactId || "",
        stage: deal.stage || "Lead",
        amount: deal.amount?.toString() || "",
        probability: deal.probability?.toString() || "",
        expectedCloseDate: deal.expectedCloseDate?.split("T")[0] || "",
        notes: deal.notes || ""
      });
    } else {
      setFormData({
        title: "",
        contactId: "",
        stage: defaultStage,
        amount: "",
        probability: "",
        expectedCloseDate: "",
        notes: ""
      });
    }
  }, [deal, isOpen, defaultStage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Deal title is required");
      return;
    }

    if (!formData.contactId) {
      toast.error("Please select a contact");
      return;
    }

    if (!formData.amount || isNaN(formData.amount) || parseFloat(formData.amount) < 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const probability = parseInt(formData.probability);
    if (isNaN(probability) || probability < 0 || probability > 100) {
      toast.error("Probability must be between 0 and 100");
      return;
    }

    setLoading(true);
    try {
      const dealData = {
        ...formData,
        amount: parseFloat(formData.amount),
        probability: probability,
        expectedCloseDate: formData.expectedCloseDate || null
      };
      
      await onSave(dealData);
      onClose();
      toast.success(deal ? "Deal updated successfully" : "Deal created successfully");
    } catch (error) {
      toast.error("Failed to save deal");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    setLoading(true);
    try {
      await onDelete(deal.Id);
      onClose();
      toast.success("Deal deleted successfully");
    } catch (error) {
      toast.error("Failed to delete deal");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg relative"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {deal ? "Edit Deal" : "New Deal"}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="h-5 w-5 text-secondary" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Deal Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter deal title"
                required
              />

              <FormField
                label="Contact"
                type="select"
                value={formData.contactId}
                onChange={(e) => setFormData(prev => ({ ...prev, contactId: e.target.value }))}
                required
              >
                <option value="">Select a contact...</option>
                {contacts.map(contact => (
                  <option key={contact.Id} value={contact.Id}>
                    {contact.name} - {contact.company}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Stage"
                type="select"
                value={formData.stage}
                onChange={(e) => setFormData(prev => ({ ...prev, stage: e.target.value }))}
                options={stages}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Amount ($)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />

                <FormField
                  label="Probability (%)"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => setFormData(prev => ({ ...prev, probability: e.target.value }))}
                  placeholder="50"
                  required
                />
              </div>

              <FormField
                label="Expected Close Date"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expectedCloseDate: e.target.value }))}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes about this deal..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center justify-between space-x-3 pt-4">
                {deal && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex items-center space-x-2"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                )}
                
                <div className="flex space-x-3 ml-auto">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : (deal ? "Update" : "Create")}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default DealModal;