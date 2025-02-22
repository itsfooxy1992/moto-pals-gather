
import { motion } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Temporary mock data - will be replaced with real data from backend
const rides = [
  {
    id: 1,
    title: "Mountain Pass Adventure",
    location: "Blue Ridge Mountains",
    date: "2024-03-20",
    difficulty: "Intermediate",
    spots: 3,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
  },
  {
    id: 2,
    title: "Coastal Highway Cruise",
    location: "Pacific Coast Highway",
    date: "2024-03-25",
    difficulty: "Beginner",
    spots: 5,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb"
  },
  {
    id: 3,
    title: "Forest Trail Expedition",
    location: "Redwood National Forest",
    date: "2024-03-30",
    difficulty: "Advanced",
    spots: 2,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
  }
];

const Rides = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Available Rides</h1>
            <p className="text-muted-foreground mt-2">
              Find your next adventure with fellow riders
            </p>
          </div>
          <Button asChild>
            <Link to="/create-ride">Create Ride</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map((ride, index) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link to={`/rides/${ride.id}`}>
                <div className="rounded-lg overflow-hidden bg-card border card-hover">
                  <div className="aspect-video relative">
                    <img
                      src={ride.image}
                      alt={ride.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full">
                      {ride.difficulty}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold">{ride.title}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-2" />
                        {ride.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(ride.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="w-4 h-4 mr-2" />
                        {ride.spots} spots available
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rides;
