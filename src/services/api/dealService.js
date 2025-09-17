import dealsData from "@/services/mockData/deals.json";
import { contactService } from "@/services/api/contactService";

class DealService {
  constructor() {
    this.deals = [...dealsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.deals].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await this.delay();
    const deal = this.deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  }

  async create(dealData) {
    await this.delay();
    
    // Get contact name for the deal
    let contactName = "";
    try {
      const contact = await contactService.getById(dealData.contactId);
      contactName = contact.name;
    } catch (error) {
      console.warn("Could not find contact for deal");
    }
    
    const newDeal = {
      Id: Math.max(...this.deals.map(d => d.Id), 0) + 1,
      ...dealData,
      contactName,
      createdAt: new Date().toISOString()
    };
    
    this.deals.push(newDeal);
    return { ...newDeal };
  }

  async update(id, dealData) {
    await this.delay();
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }

    // Update contact name if contactId changed
    let contactName = this.deals[index].contactName;
    if (dealData.contactId && dealData.contactId !== this.deals[index].contactId) {
      try {
        const contact = await contactService.getById(dealData.contactId);
        contactName = contact.name;
      } catch (error) {
        console.warn("Could not find contact for deal");
      }
    }
    
    this.deals[index] = {
      ...this.deals[index],
      ...dealData,
      contactName,
      Id: parseInt(id)
    };
    
    return { ...this.deals[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    this.deals.splice(index, 1);
    return true;
  }
}

export const dealService = new DealService();