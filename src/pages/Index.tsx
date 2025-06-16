
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  BookOpen, 
  Users, 
  GraduationCap, 
  BarChart3, 
  Plus, 
  Eye,
  LogOut,
  User,
  Lock,
  Search,
  Edit,
  Trash2,
  Mail,
  Calendar
} from "lucide-react";

// Types
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

interface Subject {
  id: string;
  name: string;
  description: string;
  teacherName: string;
  studentCount: number;
  averageGrade: number;
}

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  grade: number;
  date: string;
  teacherName: string;
}

interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
}

type ViewType = 'overview' | 'students' | 'subjects' | 'grades' | 'add-grade';

// Login Component
const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student'>('student');
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (name.trim()) {
      onLogin({
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        role: selectedRole
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-600 rounded-full">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Grade Viewer</h1>
          <p className="text-gray-600">Access your educational dashboard</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Select your role and enter your name to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedRole === 'student' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('student')}
                className="h-12 flex flex-col items-center gap-1"
              >
                <User className="h-4 w-4" />
                <span className="text-xs">Student</span>
              </Button>
              <Button
                variant={selectedRole === 'teacher' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('teacher')}
                className="h-12 flex flex-col items-center gap-1"
              >
                <GraduationCap className="h-4 w-4" />
                <span className="text-xs">Teacher</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <Button 
              onClick={handleLogin} 
              className="w-full h-11 bg-blue-600 hover:bg-blue-700"
              disabled={!name.trim()}
            >
              <Lock className="mr-2 h-4 w-4" />
              Continue as {selectedRole}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-gray-500">
          Demo Mode - No real authentication required
        </div>
      </div>
    </div>
  );
};

// Students View Component
const StudentsView = ({ userRole }: { userRole: string }) => {
  const [students, setStudents] = useState<Student[]>([]);
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
    }
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
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

// Subjects View Component
const SubjectsView = ({ userRole }: { userRole: string }) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSubject, setNewSubject] = useState({ name: '', description: '', teacherName: '' });

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.description && newSubject.teacherName) {
      const subject: Subject = {
        id: Math.random().toString(36).substr(2, 9),
        ...newSubject,
        studentCount: 0,
        averageGrade: 0
      };
      setSubjects([...subjects, subject]);
      setNewSubject({ name: '', description: '', teacherName: '' });
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteSubject = (id: string) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50';
    if (grade >= 80) return 'text-blue-600 bg-blue-50';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subjects</h2>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'Manage subjects and curriculum' 
              : 'View available subjects and their details'
            }
          </p>
        </div>
        {userRole === 'teacher' && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Create a new subject for your curriculum.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="subjectName">Subject Name</Label>
                  <Input
                    id="subjectName"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    placeholder="Enter subject name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                    placeholder="Enter subject description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherName">Teacher Name</Label>
                  <Input
                    id="teacherName"
                    value={newSubject.teacherName}
                    onChange={(e) => setNewSubject({...newSubject, teacherName: e.target.value})}
                    placeholder="Enter teacher name"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddSubject} className="bg-green-600 hover:bg-green-700">
                  Add Subject
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                {userRole === 'teacher' && (
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDeleteSubject(subject.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <CardTitle className="text-lg">{subject.name}</CardTitle>
              <CardDescription className="text-sm">
                {subject.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Teacher:</span>
                  <span className="font-medium">{subject.teacherName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <Badge variant="outline">{subject.studentCount}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Avg. Grade:</span>
                  <Badge className={getGradeColor(subject.averageGrade)}>
                    {subject.averageGrade}%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No subjects found</h3>
          <p className="text-gray-600">
            {searchTerm ? 'Try adjusting your search terms.' : 'Add your first subject to get started.'}
          </p>
        </div>
      )}
    </div>
  );
};

// Grades View Component
const GradesView = ({ userRole, userId }: { userRole: string; userId: string }) => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  const filteredGrades = grades.filter(grade => {
    const matchesSearch = 
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subjectName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || grade.subjectId === selectedSubject;
    const matchesStudent = selectedStudent === 'all' || grade.studentId === selectedStudent;
    
    return matchesSearch && matchesSubject && matchesStudent;
  });

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600 bg-green-50';
    if (grade >= 80) return 'text-blue-600 bg-blue-50';
    if (grade >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Grades</h2>
        <p className="text-gray-600">
          {userRole === 'teacher' 
            ? 'View and manage student grades' 
            : 'View your academic progress and grades'
          }
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Grades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search grades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {userRole === 'teacher' && (
              <div className="space-y-2">
                <Label>Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredGrades.map((grade) => (
          <Card key={grade.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {grade.subjectName}
                  </h3>
                  <p className="text-gray-600">{grade.studentName}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-500">
                      Date: {new Date(grade.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Teacher: {grade.teacherName}
                    </span>
                  </div>
                </div>
                <Badge className={`text-lg font-bold px-4 py-2 ${getGradeColor(grade.grade)}`}>
                  {grade.grade}%
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredGrades.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No grades found</h3>
          <p className="text-gray-600">
            {searchTerm || selectedSubject !== 'all' || selectedStudent !== 'all'
              ? 'Try adjusting your search terms or filters.' 
              : 'No grades have been added yet.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

// Add Grade Component
const AddGrade = ({ onBack }: { onBack: () => void }) => {
  const [studentId, setStudentId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [grade, setGrade] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = () => {
    if (studentId && subjectId && grade && date) {
      console.log('Adding grade:', { studentId, subjectId, grade, date });
      onBack();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Grade</h2>
          <p className="text-gray-600">Enter grade information for a student</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Grade Details</CardTitle>
          <CardDescription>
            Fill in the information below to add a new grade.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="student">Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">No students available</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="empty">No subjects available</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="grade">Grade (%)</Label>
              <Input
                id="grade"
                type="number"
                min="0"
                max="100"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                placeholder="Enter grade (0-100)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!studentId || !subjectId || !grade || !date}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Add Grade
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Overview Cards Component
const OverviewCards = ({ userRole, onNavigate }: { userRole: string; onNavigate: (view: ViewType) => void }) => {
  const stats = [
    { label: 'Total Students', value: '0', icon: Users, color: 'bg-blue-500' },
    { label: 'Active Subjects', value: '0', icon: BookOpen, color: 'bg-green-500' },
    { label: 'Total Grades', value: '0', icon: GraduationCap, color: 'bg-purple-500' },
    { label: 'Average Score', value: '0%', icon: BarChart3, color: 'bg-orange-500' },
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

// Dashboard Component
const Dashboard = ({ user, onLogout }: { user: User; onLogout: () => void }) => {
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

// Main Index Component
const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
};

export default Index;
