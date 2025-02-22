
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MapPin, Users, Plus, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const { session, signOut } = useAuth();

  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-primary">MotoMate</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/rides" className="nav-link flex items-center space-x-1">
            <MapPin size={18} />
            <span>Rides</span>
          </Link>
          <Link to="/riders" className="nav-link flex items-center space-x-1">
            <Users size={18} />
            <span>Riders</span>
          </Link>
          {session ? (
            <>
              <Button asChild variant="default" size="sm">
                <Link to="/create-ride" className="flex items-center space-x-1">
                  <Plus size={18} />
                  <span>Create Ride</span>
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut size={18} className="mr-2" />
                Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="default" size="sm">
              <Link to="/auth" className="flex items-center space-x-1">
                <LogIn size={18} />
                <span>Sign in</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
