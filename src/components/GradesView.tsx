
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Edit, Trash2, GraduationCap, Filter } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface GradesViewProps {
  userRole: string;
  userId: string;
}

const GradesView = ({ userRole, userId }: GradesViewProps) => {
  const [grades, setGrades] = useState<Grade[]>([
    {
      id: '1',
      studentId: '1',
      studentName: 'Alice Johnson',
      subjectId: '1',
      subjectName: 'Mathematics',
      grade: 92,
      date: '2024-01-15',
      teacherName: 'Dr. Smith'
    },
    {
      id: '2',
      studentId: '1',
      studentName: 'Alice Johnson',
      subjectId: '2',
      subjectName: 'English Literature',
      grade: 88,
      date: '2024-01-18',
      teacherName: 'Ms. Johnson'
    },
    {
      id: '3',
      studentId: '2',
      studentName: 'Bob Smith',
      subjectId: '1',
      subjectName: 'Mathematics',
      grade: 78,
      date: '2024-01-15',
      teacherName: 'Dr. Smith'
    },
    {
      id: '4',
      studentId: '2',
      studentName: 'Bob Smith',
      subjectId: '3',
      subjectName: 'Physics',
      grade: 85,
      date: '2024-01-20',
      teacherName: 'Prof. Wilson'
    },
    {
      id: '5',
      studentId: '3',
      studentName: 'Charlie Brown',
      subjectId: '1',
      subjectName: 'Mathematics',
      grade: 95,
      date: '2024-01-15',
      teacherName: 'Dr. Smith'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  // For student role, filter grades to show only their own
  const filteredGrades = grades.filter(grade => {
    if (userRole === 'student') {
      // In a real app, you'd match by actual student ID
      // For demo, we'll show Alice Johnson's grades as an example
      return grade.studentName === 'Alice Johnson';
    }
    
    const matchesSearch = 
      grade.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = selectedSubject === 'all' || grade.subjectName === selectedSubject;
    const matchesStudent = selectedStudent === 'all' || grade.studentName === selectedStudent;
    
    return matchesSearch && matchesSubject && matchesStudent;
  });

  const uniqueSubjects = [...new Set(grades.map(g => g.subjectName))];
  const uniqueStudents = [...new Set(grades.map(g => g.studentName))];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'bg-green-100 text-green-800';
    if (grade >= 80) return 'bg-blue-100 text-blue-800';
    if (grade >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getGradeLetter = (grade: number) => {
    if (grade >= 90) return 'A';
    if (grade >= 80) return 'B';
    if (grade >= 70) return 'C';
    if (grade >= 60) return 'D';
    return 'F';
  };

  const handleDeleteGrade = (id: string) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Grades</h2>
          <p className="text-gray-600">
            {userRole === 'teacher' 
              ? 'View and manage all student grades' 
              : 'Your academic grades and progress'
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
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
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {uniqueSubjects.map(subject => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {userRole === 'teacher' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Student</label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Students" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    {uniqueStudents.map(student => (
                      <SelectItem key={student} value={student}>{student}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Grade Records
          </CardTitle>
          <CardDescription>
            {filteredGrades.length} grade{filteredGrades.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {userRole === 'teacher' && <TableHead>Student</TableHead>}
                  <TableHead>Subject</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Letter</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Teacher</TableHead>
                  {userRole === 'teacher' && <TableHead className="w-[100px]">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    {userRole === 'teacher' && (
                      <TableCell className="font-medium">
                        {grade.studentName}
                      </TableCell>
                    )}
                    <TableCell>{grade.subjectName}</TableCell>
                    <TableCell>
                      <Badge className={getGradeColor(grade.grade)}>
                        {grade.grade}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getGradeLetter(grade.grade)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(grade.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{grade.teacherName}</TableCell>
                    {userRole === 'teacher' && (
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteGrade(grade.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredGrades.length === 0 && (
            <div className="text-center py-12">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No grades found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedSubject !== 'all' || selectedStudent !== 'all'
                  ? 'Try adjusting your filters.'
                  : 'No grades have been recorded yet.'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GradesView;
