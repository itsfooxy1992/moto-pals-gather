import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/rides">Rides</Link>
    </nav>
  );
} 