import {createFileRoute} from '@tanstack/react-router';
import {DetailPage} from '@/components/club/content';
import {clubQuery} from '@/lib/club.queries';
import {pageHead} from '@/lib/club';
export const Route=createFileRoute('/news/$slug')({loader:({context})=>context.queryClient.ensureQueryData(clubQuery),head:({loaderData,params})=>{const r=loaderData?.find(r=>r.kind==='news'&&(r.id===params.slug||r.slug===params.slug));return pageHead(r?.title||'Record unavailable',r?.details.excerpt||'Official AWUJALE BOYZ FC news record.');},component:Detail});
function Detail(){const params=Route.useParams();return <DetailPage kind="news" id={params.slug}/>;}
