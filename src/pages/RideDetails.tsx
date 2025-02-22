
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const RideDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ride, isLoading: rideLoading } = useQuery({
    queryKey: ["ride", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rides")
        .select(`
          *,
          creator:profiles!rides_creator_id_fkey(username, full_name),
          participants:ride_participants(
            user:profiles(username, full_name)
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: isParticipating } = useQuery({
    queryKey: ["ride-participation", id],
    queryFn: async () => {
      if (!session?.user) return false;
      const { data, error } = await supabase
        .from("ride_participants")
        .select()
        .eq("ride_id", id)
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!session?.user,
  });

  const joinMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("ride_participants")
        .insert({ ride_id: id, user_id: session!.user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride", id] });
      queryClient.invalidateQueries({ queryKey: ["ride-participation", id] });
      toast({
        title: "Success!",
        description: "You've joined the ride.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("ride_participants")
        .delete()
        .eq("ride_id", id)
        .eq("user_id", session!.user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ride", id] });
      queryClient.invalidateQueries({ queryKey: ["ride-participation", id] });
      toast({
        title: "Success!",
        description: "You've left the ride.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  if (rideLoading) {
    return <div className="min-h-screen pt-24">Loading...</div>;
  }

  if (!ride) {
    return <div className="min-h-screen pt-24">Ride not found</div>;
  }

  const spotsAvailable = ride.total_spots - ride.participants.length;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="aspect-[21/9] rounded-lg overflow-hidden bg-muted">
            {ride.image_url ? (
              <img
                src={ride.image_url}
                alt={ride.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                No image available
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold">{ride.title}</h1>
              <p className="text-muted-foreground">
                Organized by {ride.creator.full_name || ride.creator.username}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {ride.location}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(ride.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {spotsAvailable} spots available
              </div>
              <div className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                {ride.difficulty}
              </div>
            </div>

            {ride.description && (
              <p className="text-muted-foreground">{ride.description}</p>
            )}

            {session?.user && (
              <div>
                {isParticipating ? (
                  <Button
                    variant="destructive"
                    onClick={() => leaveMutation.mutate()}
                    disabled={leaveMutation.isPending}
                  >
                    {leaveMutation.isPending ? "Leaving..." : "Leave Ride"}
                  </Button>
                ) : (
                  <Button
                    onClick={() => joinMutation.mutate()}
                    disabled={joinMutation.isPending || spotsAvailable === 0}
                  >
                    {joinMutation.isPending
                      ? "Joining..."
                      : spotsAvailable === 0
                      ? "No spots available"
                      : "Join Ride"}
                  </Button>
                )}
              </div>
            )}

            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Participants</h2>
              <div className="space-y-2">
                {ride.participants.length > 0 ? (
                  ride.participants.map((participant: any) => (
                    <div
                      key={participant.user.username}
                      className="flex items-center space-x-2"
                    >
                      <span>
                        {participant.user.full_name || participant.user.username}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No participants yet</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RideDetails;
