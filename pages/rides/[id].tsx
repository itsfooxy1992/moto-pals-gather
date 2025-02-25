import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface Ride {
  id: number;
  title: string;
  location: string;
  date: string;
  difficulty: string;
  spots: number;
  image: string;
  description?: string;
}

export default function RideDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchRide = async () => {
        try {
          const { data, error } = await supabase
            .from('rides')
            .select('*')
            .eq('id', id)
            .single();

          if (error) throw error;
          setRide(data);
        } catch (err) {
          console.error('Error fetching ride:', err);
          setError('Failed to load ride details');
        } finally {
          setLoading(false);
        }
      };

      fetchRide();
    }
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ride) return <div>Ride not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/rides">
            <Button variant="ghost">← Back to Rides</Button>
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img
              src={ride.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e'}
              alt={ride.title}
              className="object-cover w-full h-full"
            />
          </div>
          
          <div>
            <h1 className="text-4xl font-bold mb-4">{ride.title}</h1>
            <div className="space-y-4">
              <div className="flex items-center">
                <span className="font-semibold w-24">Location:</span>
                <span>{ride.location}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Date:</span>
                <span>{new Date(ride.date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Difficulty:</span>
                <span>{ride.difficulty}</span>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24">Spots:</span>
                <span>{ride.spots} available</span>
              </div>
            </div>
            
            {ride.description && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{ride.description}</p>
              </div>
            )}
            
            <div className="mt-8">
              <Button size="lg">Join Ride</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 