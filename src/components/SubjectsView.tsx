
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Subject {
  id: string;
  name: string;
  description: string;
  teacherName: string;
  studentCount: number;
  averageGrade: number;
}

interface SubjectsViewProps {
  userRole: string;
}

const SubjectsView = ({ userRole }: SubjectsViewProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: '1',
      name: 'Mathematics',
      description: 'Advanced algebra and calculus concepts',
      teacherName: 'Dr. Smith',
      studentCount: 45,
      averageGrade: 87.5
    },
    {
      id: '2',
      name: 'English Literature',
      description: 'Classic and modern literature analysis',
      teacherName: 'Ms. Johnson',
      studentCount: 38,
      averageGrade: 82.3
    },
    {
      id: '3',
      name: 'Physics',
      description: 'Mechanics, thermodynamics, and electromagnetism',
      teacherName: 'Prof. Wilson',
      studentCount: 42,
      averageGrade: 78.9
    },
    {
      id: '4',
      name: 'Chemistry',
      description: 'Organic and inorganic chemistry fundamentals',
      teacherName: 'Dr. Brown',
      studentCount: 35,
      averageGrade: 85.1
    }
  ]);

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

export default SubjectsView;
