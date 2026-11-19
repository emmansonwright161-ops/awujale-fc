import {createFileRoute} from '@tanstack/react-router';
import {HonoursPage} from '@/components/club/content';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/honours')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:()=>pageHead('Club honours','Discover Club honours and official AWUJALE BOYZ FC records from Ijebu-Ode, Nigeria.'),component:HonoursPage});
