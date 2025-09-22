import contactsData from "@/services/mockData/contacts.json";

class ContactService {
  constructor() {
    this.contacts = [...contactsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.contacts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay();
    const contact = this.contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  }

  async create(contactData) {
    await this.delay();
    
    const newContact = {
      Id: Math.max(...this.contacts.map(c => c.Id), 0) + 1,
      ...contactData,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString()
    };
    
    this.contacts.push(newContact);
    return { ...newContact };
  }

  async update(id, contactData) {
    await this.delay();
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts[index] = {
      ...this.contacts[index],
      ...contactData,
      Id: parseInt(id)
    };
    
    return { ...this.contacts[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    this.contacts.splice(index, 1);
    return true;
  }

  // Bulk operations
  async bulkUpdateTags(ids, tags) {
    await this.delay();
    
    ids.forEach(id => {
      const contactIndex = this.contacts.findIndex(c => c.Id === id);
      if (contactIndex !== -1) {
        this.contacts[contactIndex] = {
          ...this.contacts[contactIndex],
          tags: [...new Set([...(this.contacts[contactIndex].tags || []), ...tags])]
        };
      }
    });
    
    return { success: true, count: ids.length };
  }

  async bulkUpdateStatus(ids, status) {
    await this.delay();
    
    ids.forEach(id => {
      const contactIndex = this.contacts.findIndex(c => c.Id === id);
      if (contactIndex !== -1) {
        this.contacts[contactIndex] = {
          ...this.contacts[contactIndex],
          status
        };
      }
    });
    
    return { success: true, count: ids.length };
  }

  async bulkDelete(ids) {
    await this.delay();
    
    this.contacts = this.contacts.filter(c => !ids.includes(c.Id));
    
    return { success: true, count: ids.length };
  }
}

export const contactService = new ContactService();