
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Users, Shield } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
            Find Your Perfect Riding Partner
          </span>
          
          <h1 className="mt-6 hero-text">
            Connect with Fellow Motorcycle Enthusiasts
          </h1>
          
          <p className="mt-6 text-xl text-muted-foreground">
            Join MotoMate to discover amazing rides and connect with passionate riders in your area.
            Plan routes, share experiences, and make lasting friendships.
          </p>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/rides" className="flex items-center space-x-2">
                <span>Browse Rides</span>
                <ArrowRight size={18} />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/create-ride">Create a Ride</Link>
            </Button>
          </div>
        </motion.div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
              className="p-6 rounded-2xl bg-card card-hover"
            >
              <feature.icon className="w-12 h-12 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
              <p className="mt-2 text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: MapPin,
    title: "Discover Routes",
    description: "Find the perfect routes for your next adventure, from scenic countryside rides to challenging mountain passes."
  },
  {
    icon: Users,
    title: "Meet Riders",
    description: "Connect with a community of passionate riders who share your love for motorcycles and adventure."
  },
  {
    icon: Shield,
    title: "Ride Safely",
    description: "Join verified riders and enjoy peace of mind with our safety-first community guidelines."
  }
];

export default Index;
