import { motion } from "framer-motion";
import { MapPin, Calendar, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Make sure you have this configured

interface Ride {
  id: number;
  title: string;
  location: string;
  date: string;
  difficulty: string;
  spots: number;
  image: string;
}

const Rides = () => {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const { data, error } = await supabase
          .from('rides')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setRides(data);
        }
      } catch (err) {
        console.error('Error fetching rides:', err);
        setError('Failed to load rides');
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return <div className="min-h-screen pt-24 pb-16 container mx-auto px-4">Loading rides...</div>;
  }

  if (error) {
    return <div className="min-h-screen pt-24 pb-16 container mx-auto px-4">Error: {error}</div>;
  }

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

        {rides.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No rides available at the moment.</p>
          </div>
        ) : (
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
                        src={ride.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'}
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
        )}
      </div>
    </div>
  );
};

export default Rides;
