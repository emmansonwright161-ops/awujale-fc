import {createFileRoute} from '@tanstack/react-router';
import {AboutPage} from '@/components/club/content';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/about')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:()=>pageHead('The club','Discover The club and official AWUJALE BOYZ FC records from Ijebu-Ode, Nigeria.'),component:AboutPage});
