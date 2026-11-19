import {createFileRoute} from '@tanstack/react-router';
import {StandingsPage} from '@/components/club/content';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/standings')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:()=>pageHead('League standings','Discover League standings and official AWUJALE BOYZ FC records from Ijebu-Ode, Nigeria.'),component:StandingsPage});
