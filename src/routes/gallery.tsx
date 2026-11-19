import {createFileRoute} from '@tanstack/react-router';
import {GalleryPage} from '@/components/club/content';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/gallery')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:()=>pageHead('Photos and media','Discover Photos and media and official AWUJALE BOYZ FC records from Ijebu-Ode, Nigeria.'),component:GalleryPage});
