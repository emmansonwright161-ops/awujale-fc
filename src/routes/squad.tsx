import {createFileRoute} from '@tanstack/react-router';
import {SquadPage} from '@/components/club/content';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/squad')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:()=>pageHead('First-team squad','Discover First-team squad and official AWUJALE BOYZ FC records from Ijebu-Ode, Nigeria.'),component:SquadPage});
