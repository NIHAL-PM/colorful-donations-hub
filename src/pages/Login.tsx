
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AnimatedBackground from '@/components/AnimatedBackground';
import { User, Lock, Mail, Key, ArrowRight, EyeIcon, EyeOffIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Checkbox } from "@/components/ui/checkbox";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      navigate('/');
    } catch (err) {
      setError((err as Error).message || 'Failed to log in');
      toast({
        title: "Sign in failed",
        description: (err as Error).message || 'Failed to log in',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use Supabase Auth directly for signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      if (data.user) {
        setActiveTab('signin');
        setError('');
        setPassword('');
        setConfirmPassword('');
        toast({
          title: "Account created!",
          description: "Please check your email to confirm your account, then sign in.",
        });
      }
    } catch (err) {
      setError((err as Error).message || 'Failed to sign up');
      toast({
        title: "Sign up failed",
        description: (err as Error).message || 'Failed to sign up',
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatedBackground />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md p-0 overflow-hidden rounded-2xl shadow-2xl bg-white/10 backdrop-blur-md border border-white/20"
      >
        <div className="bg-gradient-to-r from-donation-primary to-donation-secondary p-6 text-white">
          <div className="text-center">
            <h1 className="text-3xl font-bold font-display">
              <span className="drop-shadow-md">HappyDonation</span>
            </h1>
            <p className="text-white/90 mt-2">
              {activeTab === 'signin' ? 'Sign in to your account' : 'Create a new account'}
            </p>
          </div>
        </div>
        
        <div className="p-8">
          <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="signin" className="data-[state=active]:bg-donation-primary data-[state=active]:text-white">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-donation-primary data-[state=active]:text-white">Sign Up</TabsTrigger>
            </TabsList>
            
            <AnimatePresence mode="wait">
              <TabsContent value="signin" key="signin">
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.form 
                  onSubmit={handleSignIn} 
                  className="space-y-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-gray-700 font-medium block">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail size={18} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-donation-primary/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-gray-700 font-medium block">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock size={18} />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 border-gray-300 focus:border-donation-primary/50"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="remember" 
                        checked={rememberMe} 
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)} 
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Remember me
                      </label>
                    </div>
                    <button
                      type="button"
                      className="text-sm text-donation-primary hover:underline"
                      onClick={() => toast({
                        title: "Password Reset",
                        description: "Check your email for password reset instructions.",
                      })}
                    >
                      Forgot password?
                    </button>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full relative group overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(90deg, #4F9D69 0%, #8FCFD1 100%)',
                      boxShadow: '0 4px 6px -1px rgba(79, 157, 105, 0.2)'
                    }}
                    disabled={isLoading}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      {isLoading ? 'Signing in...' : 'Sign In'}
                      {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </span>
                    <div className="absolute bg-white/20 skew-x-[-20deg] -translate-x-full group-hover:translate-x-full w-full h-full transition-transform duration-1000 ease-in-out"></div>
                  </Button>
                </motion.form>
              </TabsContent>
              
              <TabsContent value="signup" key="signup">
                {error && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-red-50 text-red-600 p-3 rounded-md mb-6 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                
                <motion.form 
                  onSubmit={handleSignUp} 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-gray-700 font-medium block">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <User size={18} />
                      </div>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-donation-primary/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email-signup" className="text-gray-700 font-medium block">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail size={18} />
                      </div>
                      <Input
                        id="email-signup"
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-donation-primary/50"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password-signup" className="text-gray-700 font-medium block">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Key size={18} />
                      </div>
                      <Input
                        id="password-signup"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="pl-10 pr-10 border-gray-300 focus:border-donation-primary/50"
                        minLength={6}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="confirm-password" className="text-gray-700 font-medium block">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock size={18} />
                      </div>
                      <Input
                        id="confirm-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="pl-10 border-gray-300 focus:border-donation-primary/50"
                        minLength={6}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full relative group overflow-hidden"
                      style={{ 
                        background: 'linear-gradient(90deg, #4F9D69 0%, #8FCFD1 100%)',
                        boxShadow: '0 4px 6px -1px rgba(79, 157, 105, 0.2)'
                      }}
                      disabled={isLoading}
                    >
                      <span className="relative z-10 flex items-center justify-center">
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                        {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                      </span>
                      <div className="absolute bg-white/20 skew-x-[-20deg] -translate-x-full group-hover:translate-x-full w-full h-full transition-transform duration-1000 ease-in-out"></div>
                    </Button>
                  </div>
                </motion.form>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
          
          <div className="mt-8 text-center">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-gray-300 absolute w-full"></div>
              <span className="bg-white px-2 text-sm text-gray-500 relative z-10">Test accounts</span>
            </div>
            <div className="mt-4 text-sm text-gray-600 grid grid-cols-2 gap-2">
              <div className="p-2 rounded bg-gray-50">
                <div className="font-medium">User</div>
                <div className="text-gray-500">user@happydonation.com</div>
                <div className="text-gray-500">user123</div>
              </div>
              <div className="p-2 rounded bg-gray-50">
                <div className="font-medium">Admin</div>
                <div className="text-gray-500">admin@happydonation.com</div>
                <div className="text-gray-500">admin123</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
