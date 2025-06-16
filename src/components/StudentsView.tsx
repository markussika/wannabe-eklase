
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, User, GraduationCap, Mail, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string;
  gradeCount: number;
  averageGrade: number;
  status: 'active' | 'inactive';
  subjects: string[];
}

interface StudentsViewProps {
  userRole: string;
}

const StudentsView = ({ userRole }: StudentsViewProps) => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Johnson',
      email: 'alice.johnson@school.edu',
      enrollmentDate: '2024-01-15',
      gradeCount: 15,
      averageGrade: 88.5,
      status: 'active',
      subjects: ['Mathematics', 'English Literature', 'Physics']
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Smith',
      email: 'bob.smith@school.edu',
      enrollmentDate: '2024-01-20',
      gradeCount: 12,
      averageGrade: 82.3,
      status: 'active',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    },
    {
      id: '3',
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie.brown@school.edu',
      enrollmentDate: '2024-02-01',
      gradeCount: 18,
      averageGrade: 91.7,
      status: 'active',
      subjects: ['Mathematics', 'English Literature', 'History']
    },
    {
      id: '4',
      firstName: 'Diana',
      lastName: 'Wilson',
      email: 'diana.wilson@school.edu',
      enrollmentDate: '2024-01-10',
      gradeCount: 20,
      averageGrade: 94.2,
      status: 'active',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology']
    },
    {
      id: '5',
      firstName: 'Edward',
      lastName: 'Davis',
      email: 'edward.davis@school.edu',
      enrollmentDate: '2024-02-15',
      gradeCount: 8,
      averageGrade: 76.8,
      status: 'active',
      subjects: ['English Literature', 'History']
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'firstName' | 'lastName' | 'averageGrade' | 'enrollmentDate'>('firstName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '',
    status: 'active' as 'active' | 'inactive'
  });

  // Filter and sort students
  const filteredAndSortedStudents = students
    .filter(student => {
      const matchesSearch = 
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'firstName':
          comparison = a.firstName.localeCompare(b.firstName);
          break;
        case 'lastName':
          comparison = a.lastName.localeCompare(b.lastName);
          break;
        case 'averageGrade':
          comparison = a.averageGrade - b.averageGrade;
          break;
        case 'enrollmentDate':
          comparison = new Date(a.enrollmentDate).getTime() - new Date(b.enrollmentDate).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleAddStudent = () => {
    if (newStudent.firstName && newStudent.lastName && newStudent.email) {
      const student: Student = {
        id: Math.random().toString(36).substr(2, 9),
        ...newStudent,
        enrollmentDate: new Date().toISOString().split('T')[0],
        gradeCount: 0,
        averageGrade: 0,
        subjects: []
      };
      setStudents([...students, student]);
      setNewStudent({ firstName: '', lastName: '', email: '', status: 'active' });
      setIsAddDialogOpen(false);
      console.log('Added new student:', student);
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
    console.log('Deleted student with ID:', id);
  };

  const getAverageGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (userRole !== 'teacher') {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only teachers can manage student information.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students Management</h2>
          <p className="text-gray-600">Manage all student profiles and academic information</p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="text-sm">
              {filteredAndSortedStudents.length} students shown
            </Badge>
            <Badge variant="outline" className="text-sm">
              {students.filter(s => s.status === 'active').length} active
            </Badge>
          </div>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
              <DialogDescription>
                Enter the student's information to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={newStudent.firstName}
                    onChange={(e) => setNewStudent({...newStudent, firstName: e.target.value})}
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={newStudent.lastName}
                    onChange={(e) => setNewStudent({...newStudent, lastName: e.target.value})}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newStudent.status} onValueChange={(value: 'active' | 'inactive') => setNewStudent({...newStudent, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStudent} className="bg-blue-600 hover:bg-blue-700">
                Add Student
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Sort by</Label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="firstName">First Name</SelectItem>
                  <SelectItem value="lastName">Last Name</SelectItem>
                  <SelectItem value="averageGrade">Average Grade</SelectItem>
                  <SelectItem value="enrollmentDate">Enrollment Date</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Order</Label>
              <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active Only</SelectItem>
                  <SelectItem value="inactive">Inactive Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <div className="grid gap-4">
        {filteredAndSortedStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {student.firstName[0]}{student.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      {student.firstName} {student.lastName}
                      <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                        {student.status}
                      </Badge>
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span>{student.email}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Enrolled: {new Date(student.enrollmentDate).toLocaleDateString()}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {student.gradeCount} grades
                      </Badge>
                      <Badge className={`text-xs ${getAverageGradeColor(student.averageGrade)}`}>
                        Avg: {student.averageGrade.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <GraduationCap className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        Subjects: {student.subjects.join(', ') || 'None assigned'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteStudent(student.id)}
                    className="text-red-600 hover:text-red-700 hover:border-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedStudents.length === 0 && (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
          <p className="text-gray-600">
            {searchTerm || filterStatus !== 'all' 
              ? 'Try adjusting your search terms or filters.' 
              : 'Add your first student to get started.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default StudentsView;
