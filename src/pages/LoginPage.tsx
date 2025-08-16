import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Container from "@/components/ui/Container";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demo purposes, redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-canvas">
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
              <Link to="/" className="text-text-on-dark/80 hover:text-text-on-dark">Home</Link>
              <Link to="/dashboard" className="text-text-on-dark/80 hover:text-text-on-dark">Dashboard</Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Login Form */}
      <section className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <Container>
          <div className="max-w-md mx-auto">
            <Card className="bg-surface border-border-glass shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-h2 text-text-on-dark">Welcome Back</CardTitle>
                <CardDescription className="text-text-on-dark/70">
                  Sign in to access your trade intelligence dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-text-on-dark">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-text-on-dark/60" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-background/50 border-border-glass"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-text-on-dark">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-text-on-dark/60" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-background/50 border-border-glass"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full cta-gradient text-white">
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-text-on-dark/70">
                    Don't have an account?{" "}
                    <Link to="/dashboard" className="text-primary hover:underline font-medium">
                      Get started for free
                    </Link>
                  </p>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/" className="text-text-on-dark/60 hover:text-text-on-dark text-sm">
                    ← Back to home
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default LoginPage;