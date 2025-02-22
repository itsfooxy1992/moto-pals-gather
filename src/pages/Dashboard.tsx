
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Edit2, ChevronRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    bio: "",
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data) {
        setProfileData({
          fullName: data.full_name || "",
          bio: data.bio || "",
        });
      }
    },
  });

  const { data: createdRides, isLoading: createdRidesLoading } = useQuery({
    queryKey: ["created-rides"],
    queryFn: async () => {
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from("rides")
        .select("*")
        .eq("creator_id", session.user.id)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: participatingRides, isLoading: participatingRidesLoading } = useQuery({
    queryKey: ["participating-rides"],
    queryFn: async () => {
      if (!session?.user) return [];
      const { data, error } = await supabase
        .from("ride_participants")
        .select(`
          ride:rides(
            *,
            creator:profiles!rides_creator_id_fkey(username, full_name)
          )
        `)
        .eq("user_id", session.user.id);
      if (error) throw error;
      return data.map(item => item.ride);
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profileData.fullName,
          bio: profileData.bio,
        })
        .eq("id", session.user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Your profile has been updated.",
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

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate();
  };

  const RideCard = ({ ride }: { ride: any }) => (
    <Card className="hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => navigate(`/rides/${ride.id}`)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold">{ride.title}</h3>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {ride.location}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(ride.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {ride.total_spots} spots
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );

  if (!session) {
    navigate("/auth");
    return null;
  }

  if (profileLoading || createdRidesLoading || participatingRidesLoading) {
    return <div className="min-h-screen pt-24">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your rider profile</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      value={profileData.fullName}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Bio</label>
                    <Textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={updateProfileMutation.isPending}
                  >
                    {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium">Full Name</h3>
                    <p className="text-muted-foreground">
                      {profile?.full_name || "Not set"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Bio</h3>
                    <p className="text-muted-foreground">
                      {profile?.bio || "No bio yet"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="participating" className="space-y-6">
            <TabsList>
              <TabsTrigger value="participating">Participating Rides</TabsTrigger>
              <TabsTrigger value="created">Created Rides</TabsTrigger>
            </TabsList>
            
            <TabsContent value="participating" className="space-y-4">
              {participatingRides?.length ? (
                participatingRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  You haven't joined any rides yet.
                  <br />
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => navigate("/rides")}
                  >
                    Find rides to join
                  </Button>
                </p>
              )}
            </TabsContent>
            
            <TabsContent value="created" className="space-y-4">
              {createdRides?.length ? (
                createdRides.map((ride) => (
                  <RideCard key={ride.id} ride={ride} />
                ))
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  You haven't created any rides yet.
                  <br />
                  <Button
                    variant="link"
                    className="mt-2"
                    onClick={() => navigate("/create-ride")}
                  >
                    Create your first ride
                  </Button>
                </p>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
