import { supabase } from '@/integrations/supabase/client';

export interface ClientProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  title?: string;
  organization?: string;
  address?: string;
  totalJobs: number;
  lastJobDate?: Date;
  firstJobDate?: Date;
  notes?: string;
  tags?: string[];
}

export class ClientProfileService {
  /**
   * Search for a client by email (for auto-fill)
   */
  static async getClientByEmail(email: string): Promise<ClientProfile | null> {
    if (!email || email.length < 3) return null;

    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error || !data) {
        console.log('No client profile found for email:', email);
        return null;
      }

      return this.mapToClientProfile(data);
    } catch (error) {
      console.error('Error fetching client profile:', error);
      return null;
    }
  }

  /**
   * Search clients by partial email or name (for auto-complete)
   */
  static async searchClients(searchTerm: string): Promise<ClientProfile[]> {
    if (!searchTerm || searchTerm.length < 2) return [];

    try {
      const searchLower = searchTerm.toLowerCase();
      
      // Search by email, first name, last name, or organization
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .or(`email.ilike.%${searchLower}%,first_name.ilike.%${searchLower}%,last_name.ilike.%${searchLower}%,organization.ilike.%${searchLower}%`)
        .order('last_job_date', { ascending: false })
        .limit(10);

      if (error || !data) {
        console.log('No clients found for search:', searchTerm);
        return [];
      }

      return data.map(this.mapToClientProfile);
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  }

  /**
   * Get top clients by job count (for reporting)
   */
  static async getTopClients(limit: number = 10): Promise<ClientProfile[]> {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .order('total_jobs', { ascending: false })
        .limit(limit);

      if (error || !data) {
        console.error('Error fetching top clients:', error);
        return [];
      }

      return data.map(this.mapToClientProfile);
    } catch (error) {
      console.error('Error fetching top clients:', error);
      return [];
    }
  }

  /**
   * Get recent clients (for quick access)
   */
  static async getRecentClients(limit: number = 5): Promise<ClientProfile[]> {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*')
        .order('last_job_date', { ascending: false })
        .limit(limit);

      if (error || !data) {
        console.error('Error fetching recent clients:', error);
        return [];
      }

      return data.map(this.mapToClientProfile);
    } catch (error) {
      console.error('Error fetching recent clients:', error);
      return [];
    }
  }

  /**
   * Get client statistics for reporting
   */
  static async getClientStats() {
    try {
      const { data, error } = await supabase
        .from('client_profiles')
        .select('*');

      if (error || !data) {
        console.error('Error fetching client stats:', error);
        return null;
      }

      const totalClients = data.length;
      const repeatClients = data.filter(c => c.total_jobs > 1).length;
      const totalJobs = data.reduce((sum, c) => sum + (c.total_jobs || 0), 0);
      const avgJobsPerClient = totalClients > 0 ? (totalJobs / totalClients).toFixed(2) : 0;

      // Get clients by organization
      const organizations = data
        .filter(c => c.organization)
        .reduce((acc, c) => {
          acc[c.organization] = (acc[c.organization] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

      const topOrganizations = Object.entries(organizations)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));

      return {
        totalClients,
        repeatClients,
        repeatRate: totalClients > 0 ? ((repeatClients / totalClients) * 100).toFixed(1) : 0,
        totalJobs,
        avgJobsPerClient,
        topOrganizations
      };
    } catch (error) {
      console.error('Error calculating client stats:', error);
      return null;
    }
  }

  /**
   * Map database row to ClientProfile interface
   */
  private static mapToClientProfile(data: any): ClientProfile {
    return {
      id: data.id,
      email: data.email,
      firstName: data.first_name,
      lastName: data.last_name,
      phone: data.phone,
      title: data.title,
      organization: data.organization,
      address: data.address,
      totalJobs: data.total_jobs || 0,
      lastJobDate: data.last_job_date ? new Date(data.last_job_date) : undefined,
      firstJobDate: data.first_job_date ? new Date(data.first_job_date) : undefined,
      notes: data.notes,
      tags: data.tags
    };
  }
}