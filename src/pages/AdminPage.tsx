
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const { allReports, userReports, isAuthenticated } = useUser();
  const [deletingReports, setDeletingReports] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  console.log('AdminPage - All reports:', allReports);
  console.log('AdminPage - User reports:', userReports);
  console.log('AdminPage - Is authenticated:', isAuthenticated);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const handleRefreshReports = async () => {
    setRefreshing(true);
    try {
      // Force refresh of reports by invalidating the cache
      window.location.reload();
    } catch (error) {
      console.error('Failed to refresh reports:', error);
      toast({
        title: "Error",
        description: "Failed to refresh reports. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    setDeletingReports(prev => new Set(prev).add(reportId));
    
    try {
      console.log('Attempting to delete report with ID:', reportId);
      
      const { error } = await supabase
        .from('crime_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        console.error('Error deleting report:', error);
        toast({
          title: "Error",
          description: `Failed to delete the report: ${error.message}`,
          variant: "destructive",
        });
      } else {
        console.log('Report deleted successfully');
        toast({
          title: "Success",
          description: "Report has been deleted successfully.",
        });
        
        // Wait a moment then refresh to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
      toast({
        title: "Error",
        description: "Failed to delete the report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-8 px-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You must be logged in to access the admin panel.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            View and manage all crime reports
          </p>
        </div>
        <Button 
          onClick={handleRefreshReports} 
          disabled={refreshing}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Reports</CardTitle>
            <CardDescription>All reports in database</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{allReports.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Reports</CardTitle>
            <CardDescription>Reports by authenticated users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{userReports.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Anonymous Reports</CardTitle>
            <CardDescription>Reports with NULL user_id</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {allReports.filter(report => report.user_id === null).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Reports ({allReports.length})</CardTitle>
          <CardDescription>Complete list of all crime reports with management options</CardDescription>
        </CardHeader>
        <CardContent>
          {allReports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No reports found. This could indicate:</p>
              <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground space-y-1">
                <li>Database connection issues</li>
                <li>RLS policies blocking access</li>
                <li>No data in the database</li>
              </ul>
              <Button 
                onClick={handleRefreshReports} 
                className="mt-4"
                variant="outline"
              >
                Try Refreshing
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Reporter</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {report.title}
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        {report.location}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.type}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(report.severity)}>
                          {report.severity}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[120px] truncate">
                        {report.reportedBy}
                      </TableCell>
                      <TableCell>
                        {report.user_id ? (
                          <Badge variant="secondary" className="text-xs">
                            User
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Anonymous
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {report.created_at ? formatDate(report.created_at) : report.time}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={deletingReports.has(report.id)}
                              className="h-8 w-8 p-0"
                            >
                              {deletingReports.has(report.id) ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Trash2 className="h-3 w-3" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Report</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this report? This action cannot be undone.
                                <br />
                                <br />
                                <strong>Report:</strong> {report.title}
                                <br />
                                <strong>Location:</strong> {report.location}
                                <br />
                                <strong>ID:</strong> {report.id}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReport(report.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Report
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
