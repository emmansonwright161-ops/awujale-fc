import {createFileRoute} from '@tanstack/react-router';
import {FixturesPage} from '@/components/club/content';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/fixtures')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:()=>pageHead('Fixtures and results','Discover Fixtures and results and official AWUJALE BOYZ FC records from Ijebu-Ode, Nigeria.'),component:FixturesPage});
