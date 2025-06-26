
import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPage = () => {
  const { allReports, userReports, isAuthenticated } = useUser();
  const [deletingReports, setDeletingReports] = useState<Set<string>>(new Set());
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

  const handleDeleteReport = async (reportId: string) => {
    setDeletingReports(prev => new Set(prev).add(reportId));
    
    try {
      const { error } = await supabase
        .from('crime_reports')
        .delete()
        .eq('id', reportId);

      if (error) {
        console.error('Error deleting report:', error);
        toast({
          title: "Error",
          description: "Failed to delete the report. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Report has been deleted successfully.",
        });
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

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-muted-foreground">
          View and manage all crime reports
        </p>
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
            </div>
          ) : (
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
                    <TableCell className="font-medium">{report.title}</TableCell>
                    <TableCell>{report.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{report.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getSeverityColor(report.severity)}>
                        {report.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>{report.reportedBy}</TableCell>
                    <TableCell>
                      {report.user_id ? (
                        <Badge variant="secondary">User</Badge>
                      ) : (
                        <Badge variant="outline">Anonymous</Badge>
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
                          >
                            <Trash2 className="h-4 w-4" />
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
