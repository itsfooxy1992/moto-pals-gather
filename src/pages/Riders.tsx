
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Riders = () => {
  const { data: riders, isLoading } = useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen pt-24">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Riders</h1>
          <p className="text-muted-foreground mt-2">
            Meet our community of motorcycle enthusiasts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {riders?.map((rider) => (
            <motion.div
              key={rider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border rounded-lg p-6"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold truncate">
                    {rider.full_name || rider.username}
                  </p>
                  {rider.bio && (
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {rider.bio}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Riders;
