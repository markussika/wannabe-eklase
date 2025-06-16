
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

interface AddGradeProps {
  onBack: () => void;
}

const AddGrade = ({ onBack }: AddGradeProps) => {
  const [formData, setFormData] = useState({
    studentId: '',
    subjectId: '',
    grade: '',
    date: new Date().toISOString().split('T')[0]
  });

  const students = [
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Bob Smith' },
    { id: '3', name: 'Charlie Brown' }
  ];

  const subjects = [
    { id: '1', name: 'Mathematics' },
    { id: '2', name: 'English Literature' },
    { id: '3', name: 'Physics' },
    { id: '4', name: 'Chemistry' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.subjectId || !formData.grade) {
      toast.error("Please fill in all required fields");
      return;
    }

    const gradeValue = parseFloat(formData.grade);
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast.error("Please enter a valid grade between 0 and 100");
      return;
    }

    // In a real app, this would save to the database
    console.log('Adding grade:', formData);
    toast.success("Grade added successfully!");
    
    // Reset form
    setFormData({
      studentId: '',
      subjectId: '',
      grade: '',
      date: new Date().toISOString().split('T')[0]
    });
    
    // Go back to grades view
    onBack();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Add New Grade</h2>
          <p className="text-gray-600">Record a new grade for a student</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Grade Information
            </CardTitle>
            <CardDescription>
              Enter the grade details below. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="student">Student *</Label>
                  <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={formData.subjectId} onValueChange={(value) => setFormData({...formData, subjectId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="grade">Grade (0-100) *</Label>
                  <Input
                    id="grade"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    placeholder="Enter grade"
                  />
                  {formData.grade && (
                    <div className="text-sm text-gray-500">
                      Letter Grade: {getLetterGrade(parseFloat(formData.grade))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Grade
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Grade Scale Reference */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Grade Scale Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="font-semibold text-green-800">A</div>
                <div className="text-green-600">90-100</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold text-blue-800">B</div>
                <div className="text-blue-600">80-89</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="font-semibold text-yellow-800">C</div>
                <div className="text-yellow-600">70-79</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="font-semibold text-orange-800">D</div>
                <div className="text-orange-600">60-69</div>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="font-semibold text-red-800">F</div>
                <div className="text-red-600">0-59</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const getLetterGrade = (grade: number): string => {
  if (grade >= 90) return 'A';
  if (grade >= 80) return 'B';
  if (grade >= 70) return 'C';
  if (grade >= 60) return 'D';
  return 'F';
};

export default AddGrade;
