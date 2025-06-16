
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Plus, 
  Eye,
  LogOut,
  User
} from "lucide-react";
import StudentsView from './StudentsView';
import SubjectsView from './SubjectsView';
import GradesView from './GradesView';
import AddGrade from './AddGrade';

interface DashboardProps {
  user: { id: string; name: string; role: 'teacher' | 'student' };
  onLogout: () => void;
}

type ViewType = 'overview' | 'students' | 'subjects' | 'grades' | 'add-grade';

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<ViewType>('overview');

  const renderContent = () => {
    switch (currentView) {
      case 'students':
        return <StudentsView userRole={user.role} />;
      case 'subjects':
        return <SubjectsView userRole={user.role} />;
      case 'grades':
        return <GradesView userRole={user.role} userId={user.id} />;
      case 'add-grade':
        return <AddGrade onBack={() => setCurrentView('grades')} />;
      default:
        return <OverviewCards userRole={user.role} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Grade Viewer</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={user.role === 'teacher' ? 'default' : 'secondary'} className="capitalize">
                {user.role}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto py-4">
            <Button
              variant={currentView === 'overview' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('overview')}
              size="sm"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </Button>
            {user.role === 'teacher' && (
              <Button
                variant={currentView === 'students' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('students')}
                size="sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Students
              </Button>
            )}
            <Button
              variant={currentView === 'subjects' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('subjects')}
              size="sm"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Subjects
            </Button>
            <Button
              variant={currentView === 'grades' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('grades')}
              size="sm"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Grades
            </Button>
            {user.role === 'teacher' && (
              <Button
                variant={currentView === 'add-grade' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('add-grade')}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Grade
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

const OverviewCards = ({ userRole, onNavigate }: { userRole: string; onNavigate: (view: ViewType) => void }) => {
  const stats = [
    { label: 'Total Students', value: '156', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Subjects', value: '8', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Total Grades', value: '1,248', icon: GraduationCap, color: 'bg-purple-500' },
    { label: 'Average Score', value: '85.2%', icon: BarChart3, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          {userRole === 'teacher' 
            ? 'Manage your students, subjects, and grades' 
            : 'View your academic progress and grades'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onNavigate('grades')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              View Grades
            </CardTitle>
            <CardDescription>
              {userRole === 'teacher' 
                ? 'View and manage all student grades' 
                : 'Check your grades and academic progress'
              }
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onNavigate('subjects')}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              Subjects
            </CardTitle>
            <CardDescription>
              {userRole === 'teacher' 
                ? 'Manage subjects and curriculum' 
                : 'View available subjects'
              }
            </CardDescription>
          </CardHeader>
        </Card>

        {userRole === 'teacher' && (
          <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer" onClick={() => onNavigate('students')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Students
              </CardTitle>
              <CardDescription>
                Manage student profiles and information
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
