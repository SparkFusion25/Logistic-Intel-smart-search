import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Container from "@/components/ui/Container";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, TrendingUp, Search, BarChart, Database } from "lucide-react";
import Typewriter from 'typewriter-effect';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const LoginPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("info@getb3acon.com");
  const [password, setPassword] = useState("7354$$");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message,
        });
      } else if (data.user) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/eb2815fc-aefa-4b9f-8e44-e6165942adbd.png" 
                alt="LOGISTIC INTEL"
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-white/80 hover:text-white transition-colors">Home</Link>
              <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">Dashboard</Link>
            </div>
          </div>
        </Container>
      </nav>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left Side - CTA & Typewriter */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Welcome Back to Your
                  <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Command Center
                  </span>
                </h1>
                
                <div className="text-xl text-slate-300 min-h-[60px] flex items-center justify-center lg:justify-start">
                  <span className="mr-2">Access your:</span>
                  <span className="text-blue-400 font-semibold">
                    <Typewriter
                      options={{
                        strings: [
                          'Trade Intelligence',
                          'CRM Dashboard',
                          'Analytics Reports',
                          'Market Insights',
                          'Campaign Tools'
                        ],
                        autoStart: true,
                        loop: true,
                        delay: 75,
                        deleteSpeed: 50,
                      }}
                    />
                  </span>
                </div>
              </div>

              {/* Feature Icons */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-sm">Analytics</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-indigo-400" />
                  </div>
                  <span className="text-sm">Intelligence</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <BarChart className="w-5 h-5 text-purple-400" />
                  </div>
                  <span className="text-sm">Reports</span>
                </div>
                <div className="flex items-center space-x-3 text-slate-300">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-sm">CRM</span>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="max-w-md mx-auto w-full">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-blue-500/10 transition-all duration-700 transform hover:scale-[1.02]">
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
                  <CardDescription className="text-slate-300">
                    Sign in to access your trade intelligence dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/50"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/50"
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>

                  <div className="text-center">
                    <p className="text-slate-300">
                      Don't have an account?{" "}
                      <Link to="/dashboard" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
                        Get started for free
                      </Link>
                    </p>
                  </div>

                  <div className="text-center">
                    <Link to="/" className="text-slate-400 hover:text-slate-300 text-sm transition-colors">
                      ← Back to home
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default LoginPage;