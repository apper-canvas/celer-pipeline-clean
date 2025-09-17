import activitiesData from "@/services/mockData/activities.json";
import { contactService } from "@/services/api/contactService";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.activities].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getById(id) {
    await this.delay();
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

  async create(activityData) {
    await this.delay();
    
    // Get contact name for the activity
    let contactName = "";
    try {
      const contact = await contactService.getById(activityData.contactId);
      contactName = contact.name;
    } catch (error) {
      console.warn("Could not find contact for activity");
    }
    
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      ...activityData,
      contactName,
      userId: "user1"
    };
    
    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async update(id, activityData) {
    await this.delay();
    
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }

    // Update contact name if contactId changed
    let contactName = this.activities[index].contactName;
    if (activityData.contactId && activityData.contactId !== this.activities[index].contactId) {
      try {
        const contact = await contactService.getById(activityData.contactId);
        contactName = contact.name;
      } catch (error) {
        console.warn("Could not find contact for activity");
      }
    }
    
    this.activities[index] = {
      ...this.activities[index],
      ...activityData,
      contactName,
      Id: parseInt(id)
    };
    
    return { ...this.activities[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Activity not found");
    }
    
    this.activities.splice(index, 1);
    return true;
  }
}

export const activityService = new ActivityService();