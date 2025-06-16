
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GraduationCap, User, Lock } from "lucide-react";

interface LoginProps {
  onLogin: (user: { id: string; name: string; role: 'teacher' | 'student' }) => void;
}

const Login = ({ onLogin }: LoginProps) => {
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

export default Login;
