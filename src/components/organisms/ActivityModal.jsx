import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ActivityModal = ({ 
  isOpen, 
  onClose, 
  activity, 
  contacts,
  deals,
  onSave
}) => {
  const [formData, setFormData] = useState({
    type: "call",
    description: "",
    contactId: "",
    dealId: "",
    timestamp: ""
  });
  const [loading, setLoading] = useState(false);

  const activityTypes = [
    { value: "call", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "note", label: "Note" },
    { value: "task", label: "Task" }
  ];

  useEffect(() => {
    if (activity) {
      setFormData({
        type: activity.type || "call",
        description: activity.description || "",
        contactId: activity.contactId || "",
        dealId: activity.dealId || "",
        timestamp: activity.timestamp?.split("T")[0] || ""
      });
    } else {
      const now = new Date();
      setFormData({
        type: "call",
        description: "",
        contactId: "",
        dealId: "",
        timestamp: now.toISOString().split("T")[0]
      });
    }
  }, [activity, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.description.trim()) {
      toast.error("Activity description is required");
      return;
    }

    if (!formData.contactId) {
      toast.error("Please select a contact");
      return;
    }

    setLoading(true);
    try {
      const activityData = {
        ...formData,
        timestamp: formData.timestamp ? new Date(formData.timestamp).toISOString() : new Date().toISOString()
      };
      
      await onSave(activityData);
      onClose();
      toast.success(activity ? "Activity updated successfully" : "Activity logged successfully");
    } catch (error) {
      toast.error("Failed to save activity");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredDeals = () => {
    if (!formData.contactId) return deals;
    return deals.filter(deal => deal.contactId === formData.contactId);
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
                {activity ? "Edit Activity" : "Log Activity"}
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
                label="Activity Type"
                type="select"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                options={activityTypes}
              />

              <FormField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what happened..."
                required
              />

              <FormField
                label="Contact"
                type="select"
                value={formData.contactId}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  contactId: e.target.value,
                  dealId: "" // Reset deal when contact changes
                }))}
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
                label="Related Deal (Optional)"
                type="select"
                value={formData.dealId}
                onChange={(e) => setFormData(prev => ({ ...prev, dealId: e.target.value }))}
              >
                <option value="">No related deal</option>
                {getFilteredDeals().map(deal => (
                  <option key={deal.Id} value={deal.Id}>
                    {deal.title}
                  </option>
                ))}
              </FormField>

              <FormField
                label="Date"
                type="date"
                value={formData.timestamp}
                onChange={(e) => setFormData(prev => ({ ...prev, timestamp: e.target.value }))}
                required
              />

              <div className="flex items-center justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : (activity ? "Update" : "Log Activity")}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default ActivityModal;