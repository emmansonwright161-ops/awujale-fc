import {createFileRoute} from '@tanstack/react-router';
import {EngagementPage} from '@/components/club/forms';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/fans')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:()=>pageHead('Fan zone','Connect with AWUJALE BOYZ FC and the football community of Ijebu-Ode.'),component:()=> <EngagementPage fans={true}/>});
