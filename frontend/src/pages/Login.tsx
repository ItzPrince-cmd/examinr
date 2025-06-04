import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, user, isAuthenticated } = useAuth();
  // Redirect if user is already logged in
  useEffect(() => {
    console.log('Login useEffect triggered', { user, isAuthenticated });
    if (user && isAuthenticated) {
      const from = location.state?.from?.pathname || (user.role === 'teacher' ? '/teacher/dashboard' : '/dashboard');
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [user, isAuthenticated, navigate, location]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      console.log('Login successful');
      // Force immediate navigation after successful login
      // The login function should have updated the user state
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || "Invalid email or password");
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
            Welcome to Exam<span className="text-primary">inr</span>
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </motion.div>
        {error && (
          <motion.div variants={item}>
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        <motion.form variants={item} className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="block text-sm font-medium">
                  Password
                </Label>
                <div className="text-sm">
                  <Button variant="link" className="p-0" onClick={() => navigate("/forgot-password")}>
                    Forgot your password?
                  </Button>
                </div>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
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
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </motion.form>
        <motion.div variants={item} className="text-sm text-center mt-4">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account? </span>
          <Link to="/signup">
            <Button variant="link" className="p-0 font-medium">
              Sign up
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
