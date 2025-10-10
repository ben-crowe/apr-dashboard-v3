import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClientProfileService, ClientProfile } from "@/services/ClientProfileService";
import { Building, Users, TrendingUp, DollarSign, Star, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const ClientReports = () => {
  const [topClients, setTopClients] = useState<ClientProfile[]>([]);
  const [recentClients, setRecentClients] = useState<ClientProfile[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClientData = async () => {
      setIsLoading(true);
      try {
        const [top, recent, clientStats] = await Promise.all([
          ClientProfileService.getTopClients(10),
          ClientProfileService.getRecentClients(10),
          ClientProfileService.getClientStats()
        ]);
        
        setTopClients(top);
        setRecentClients(recent);
        setStats(clientStats);
      } catch (error) {
        console.error('Error loading client reports:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClientData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-muted-foreground">Loading client reports...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              Unique clients served
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Clients</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.repeatClients || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.repeatRate || 0}% repeat rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Jobs/Client</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgJobsPerClient || 0}</div>
            <p className="text-xs text-muted-foreground">
              Client lifetime value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Organizations */}
      {stats?.topOrganizations && stats.topOrganizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Organizations</CardTitle>
            <CardDescription>Companies with the most appraisal requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.topOrganizations.map((org: any, index: number) => (
              <div key={org.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{org.name}</div>
                    <div className="text-xs text-muted-foreground">{org.count} clients</div>
                  </div>
                </div>
                <Badge variant="secondary">{org.count} jobs</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Client Lists */}
      <Tabs defaultValue="top" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top">Top Clients</TabsTrigger>
          <TabsTrigger value="recent">Recent Clients</TabsTrigger>
        </TabsList>

        <TabsContent value="top" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Clients by Volume</CardTitle>
              <CardDescription>Clients with the most appraisal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topClients.map((client, index) => (
                  <ClientRow key={client.id} client={client} rank={index + 1} showJobCount />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Clients</CardTitle>
              <CardDescription>Latest client submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClients.map((client) => (
                  <ClientRow key={client.id} client={client} showLastJob />
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ClientRowProps {
  client: ClientProfile;
  rank?: number;
  showJobCount?: boolean;
  showLastJob?: boolean;
}

const ClientRow: React.FC<ClientRowProps> = ({ client, rank, showJobCount, showLastJob }) => {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        {rank && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {rank}
          </div>
        )}
        <div className="flex flex-col">
          <div className="font-medium">
            {client.firstName} {client.lastName}
            {client.organization && (
              <span className="ml-2 text-muted-foreground">
                <Building className="inline h-3 w-3 mr-1" />
                {client.organization}
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{client.email}</div>
          {client.phone && (
            <div className="text-xs text-muted-foreground">{client.phone}</div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showJobCount && (
          <div className="text-right">
            <div className="font-medium">{client.totalJobs} jobs</div>
            <div className="text-xs text-muted-foreground">
              {client.firstJobDate && (
                <>Since {new Date(client.firstJobDate).getFullYear()}</>
              )}
            </div>
          </div>
        )}
        
        {showLastJob && client.lastJobDate && (
          <div className="text-right">
            <div className="text-sm">
              <Calendar className="inline h-3 w-3 mr-1" />
              {new Date(client.lastJobDate).toLocaleDateString()}
            </div>
            <div className="text-xs text-muted-foreground">Last job</div>
          </div>
        )}

        {client.totalJobs > 1 && (
          <Badge variant={client.totalJobs > 5 ? "default" : "secondary"}>
            {client.totalJobs > 5 ? "VIP" : "Repeat"}
          </Badge>
        )}
      </div>
    </div>
  );
};