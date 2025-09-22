import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import SearchBar from "@/components/molecules/SearchBar";
import { formatDate, formatRelativeDate } from "@/utils/formatters";
import { cn } from "@/utils/cn";

const ContactList = ({ contacts, onEdit, onDelete, onAdd, loading, selectedContacts = [], onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  
  const filteredContacts = contacts
    .filter(contact => 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      if (sortBy === "lastContact") return new Date(b.lastContact) - new Date(a.lastContact);
      return 0;
    });

useEffect(() => {
    if (!onSelectionChange) return;
    
    // Clear selection if no contacts match current selection
    const validSelectedContacts = selectedContacts.filter(id => 
      contacts.some(contact => contact.Id === id)
    );
    
    if (validSelectedContacts.length !== selectedContacts.length) {
      onSelectionChange(validSelectedContacts);
    }
  }, [contacts, selectedContacts, onSelectionChange]);

  const handleSelectAll = (checked) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      const allIds = filteredContacts.map(contact => contact.Id);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectContact = (contactId, checked) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      onSelectionChange([...selectedContacts, contactId]);
    } else {
      onSelectionChange(selectedContacts.filter(id => id !== contactId));
    }
  };

  const isAllSelected = filteredContacts.length > 0 && 
    filteredContacts.every(contact => selectedContacts.includes(contact.Id));
  
  const isPartiallySelected = selectedContacts.length > 0 && 
    !isAllSelected && 
    filteredContacts.some(contact => selectedContacts.includes(contact.Id));

  const ContactRow = ({ contact }) => (
    <tr className="hover:bg-gray-50 transition-colors">
{onSelectionChange && (
        <td className="px-4 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedContacts.includes(contact.Id)}
            onChange={(e) => handleSelectContact(contact.Id, e.target.checked)}
            className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
        </td>
      )}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gradient-to-r from-primary to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {contact.name.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
            <div className="text-sm text-secondary">{contact.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{contact.company}</div>
        <div className="text-sm text-secondary">{contact.title}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{contact.phone}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-wrap gap-1">
          {contact.tags.map(tag => (
            <Badge key={tag} variant="primary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary">
        {formatRelativeDate(contact.lastContact)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onEdit(contact)}
          >
            <ApperIcon name="Edit" className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(contact)}
            className="text-error hover:text-error"
          >
            <ApperIcon name="Trash2" className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
          <div className="flex-1 max-w-md">
            <SearchBar 
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="name">Sort by Name</option>
              <option value="company">Sort by Company</option>
              <option value="lastContact">Sort by Last Contact</option>
            </select>
            
            <Button onClick={onAdd} className="flex items-center space-x-2">
              <ApperIcon name="Plus" className="h-4 w-4" />
              <span>Add Contact</span>
            </Button>
          </div>
        </div>
      </div>

<div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isPartiallySelected;
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                </th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                Last Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
{filteredContacts.map(contact => (
              <ContactRow key={contact.Id} contact={contact} />
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredContacts.length === 0 && !loading && (
        <div className="p-8 text-center text-secondary">
          {searchTerm ? "No contacts match your search." : "No contacts found."}
        </div>
      )}
    </div>
  );
};

export default ContactList;