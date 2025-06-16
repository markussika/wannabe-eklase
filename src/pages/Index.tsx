
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, GraduationCap, BarChart3 } from "lucide-react";
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; role: 'teacher' | 'student' } | null>(null);

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />;
  }

  return <Dashboard user={currentUser} onLogout={() => setCurrentUser(null)} />;
};

export default Index;
