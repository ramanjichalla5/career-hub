import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {inspectApplication} from '@/lib/agent';
export const dynamic='force-dynamic';
export async function POST(req:Request){
 const u=await getChatGPTUser();if(!u)return Response.json({error:'Sign in required'},{status:401});
 const o=req.headers.get('origin');if(o&&o!==new URL(req.url).origin)return Response.json({error:'Origin rejected'},{status:403});
 try{
 if(!env.DB)throw Error('Storage unavailable');
 const rows=await env.DB.prepare('SELECT id,kind,data FROM career_user_records WHERE user_id=?').bind(u.userId).all();
 const records=rows.results.map((r:any)=>({...r,data:JSON.parse(r.data)}));const profile=records.find((r:any)=>r.id==='candidate-profile')?.data||{};
 const results=records.filter((r:any)=>r.kind==='job'&&!['Applied','Interview','Offer','Rejected','Archived'].includes(r.data.status)).map((r:any)=>({jobId:r.id,company:r.data.company,title:r.data.title,...inspectApplication(r.data,profile)}));
 const id='agent-run-'+crypto.randomUUID(),data={type:'agent-run',startedAt:new Date().toISOString(),status:results.length?'Needs connection or information':'No queued jobs',results,submitted:0,runnerConnected:false};
 await env.DB.prepare('INSERT INTO career_user_records(user_id,id,kind,data,updated_at) VALUES(?,?,?,?,?)').bind(u.userId,id,'task',JSON.stringify(data),data.startedAt).run();
 return Response.json({run:data});
 }catch{return Response.json({error:'Agent could not read or save this run.'},{status:503});}
}
