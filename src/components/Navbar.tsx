
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MapPin, Users, Plus } from "lucide-react";

const Navbar = () => {
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
          <Button asChild variant="default" size="sm">
            <Link to="/create-ride" className="flex items-center space-x-1">
              <Plus size={18} />
              <span>Create Ride</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
