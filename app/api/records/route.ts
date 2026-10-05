import {env} from 'cloudflare:workers';
import {getChatGPTUser} from '@/app/chatgpt-auth';
import {roles,statuses} from '@/lib/career';
export const dynamic='force-dynamic';
const kinds=['job','message','contact','post','settings','task'];
function db(){if(!env.DB)throw new Error('Storage unavailable');return env.DB;}
export async function GET(){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required.'},{status:401});
 try{const r=await db().prepare('SELECT id,kind,data,updated_at FROM career_user_records WHERE user_id=? ORDER BY updated_at DESC').bind(user.userId).all();return Response.json({records:r.results.map((x:any)=>({id:x.id,kind:x.kind,data:JSON.parse(x.data),updatedAt:x.updated_at}))},{headers:{'Cache-Control':'private, no-store'}});}catch{return Response.json({error:'Saved records unavailable.'},{status:503});}
}
export async function POST(req:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:'Sign in required.'},{status:401});
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return Response.json({error:'Origin rejected'},{status:403});
 try{const raw=await req.text();if(raw.length>40000)return Response.json({error:'Record too large'},{status:400});const r=JSON.parse(raw);
 if(r.initialize)return Response.json({saved:true});
 if(typeof r.id!=='string'||!r.id||r.id.length>100||!kinds.includes(r.kind)||!r.data||typeof r.data!=='object'||Array.isArray(r.data))return Response.json({error:'Invalid record'},{status:400});
 if(r.kind==='job'){if(!roles.includes(r.data.role)||!statuses.includes(r.data.status)||!r.data.company||!r.data.title)return Response.json({error:'Invalid job'},{status:400});if(['Applied','Interview','Offer','Rejected'].includes(r.data.status)&&(!String(r.data.proof||'').trim()||!/^\d{4}-\d{2}-\d{2}$/.test(r.data.appliedAt||'')))return Response.json({error:'Actual submission date and confirmation evidence required.'},{status:400});}
 if(r.kind==='message'&&r.data.status==='Sent'&&!String(r.data.proof||'').trim())return Response.json({error:'Delivery evidence required.'},{status:400});
 await db().prepare('INSERT INTO career_user_records(user_id,id,kind,data,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(user_id,id) DO UPDATE SET kind=excluded.kind,data=excluded.data,updated_at=excluded.updated_at').bind(user.userId,r.id,r.kind,JSON.stringify(r.data),new Date().toISOString()).run();return Response.json({saved:true});
 }catch{return Response.json({error:'Could not save. Retry.'},{status:503});}
}
