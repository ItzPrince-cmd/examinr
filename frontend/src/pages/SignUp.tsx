import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { register, loading } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setError(null);
    
    // Password validation
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      await register({
        name,
        email,
        password,
        role: 'student' // Default role for signup
      });
      navigate("/onboarding");
    } catch (err: any) {
      setError(err.message || "Failed to create account");
    }
  };

    const clearError = () => {
    setError(null);
  };

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };

  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-r from-primary/5 to-secondary/5">
      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="show" 
        className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
      >
        <motion.div variants={item} className="flex flex-col items-center">
          <div className="h-16 w-16 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl mb-4">
            <GraduationCap size={36} />
          </div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Join Exam<span className="text-primary">inr</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Create your account today
          </p>
        </motion.div>
      {(error || passwordError) && (
        <motion.div variants={item}>
          <Alert variant="destructive">
            <AlertDescription>
              {error || passwordError}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
      <motion.form variants={item} className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium">
              Full Name
            </Label>
            <Input 
              id="name" 
              name="name" 
              type="text" 
              autoComplete="name" 
              required 
              className="mt-1" 
              value={name} 
              onChange={(e) => {
                setName(e.target.value);
                clearError();
              }} 
            />
          </div>
          <div>
            <Label htmlFor="email" className="block text-sm font-medium">
              Email address
            </Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              autoComplete="email" 
              required 
              className="mt-1" 
              value={email} 
              onChange={(e) => {
                setEmail(e.target.value);
                clearError();
              }} 
            />
          </div>
          <div>
            <Label htmlFor="password" className="block text-sm font-medium">
              Password
            </Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              autoComplete="new-password" 
              required 
              className="mt-1" 
              value={password} 
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
                clearError();
              }} 
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters long
            </p>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="block text-sm font-medium">
              Confirm Password
            </Label>
            <Input 
              id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              autoComplete="new-password" 
              required 
              className="mt-1" 
              value={confirmPassword} 
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setPasswordError("");
                clearError();
              }} 
            />
          </div>
        </div>
        <div>
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary" 
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}
          </Button>
        </div>
      </motion.form>
      <motion.div variants={item} className="text-sm text-center mt-4">
        <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
        <Link to="/login">
          <Button variant="link" className="p-0 font-medium">
            Sign in
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  </div>
  );
}
