import { useState, useEffect } from "react";
import ContactList from "@/components/organisms/ContactList";
import ContactModal from "@/components/organisms/ContactModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { contactService } from "@/services/api/contactService";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts. Please try again.");
      console.error("Contacts loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAdd = () => {
    setSelectedContact(null);
    setShowModal(true);
  };

  const handleEdit = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleSave = async (contactData) => {
    try {
      if (selectedContact) {
        const updatedContact = await contactService.update(selectedContact.Id, contactData);
        setContacts(prev => prev.map(c => c.Id === selectedContact.Id ? updatedContact : c));
      } else {
        const newContact = await contactService.create(contactData);
        setContacts(prev => [newContact, ...prev]);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(c => c.Id !== contactId));
    } catch (error) {
      throw error;
    }
  };

  if (loading) return <Loading rows={5} />;
  if (error) return <Error message={error} onRetry={loadContacts} />;
  if (contacts.length === 0) {
    return (
      <Empty
        title="No contacts yet"
        message="Start building your network by adding your first contact."
        actionLabel="Add Contact"
        onAction={handleAdd}
        icon="Users"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Contacts</h1>
          <p className="text-secondary mt-1">Manage your customer relationships and contacts.</p>
        </div>
      </div>

      <ContactList
        contacts={contacts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        loading={loading}
      />

      <ContactModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        contact={selectedContact}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default Contacts;