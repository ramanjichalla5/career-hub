export type CandidateProfile={name?:string;email?:string;phone?:string;resumeUrl?:string;notice?:string;salary?:string;authorization?:string};
export function inspectApplication(job:any,profile:CandidateProfile){
 const missing=(['name','email','phone','resumeUrl','notice','salary','authorization'] as const).filter(k=>!String(profile[k]||'').trim());
 const level=String(job.level||'').toLowerCase();
 const allowed=/intern|fresher|trainee|0[–-]1|1[–-]2/.test(level+' '+String(job.title||'').toLowerCase())&&!/senior|lead|manager|[3-9]\s*(?:\+|[–-]\d)?\s*years|1[–-]3/.test(level);
 let validUrl=false;try{validUrl=new URL(job.url).protocol==='https:'}catch{}
 const blockers=[...(!allowed?['Experience requirement is outside the requested range or unverified.']:[]),...(!validUrl?['Verified employer HTTPS application URL required.']:[]),...(missing.length?['Complete factual profile: '+missing.join(', ')]:[])];
 return {eligible:!blockers.length,status:blockers.length?'Needs information':'Awaiting connected submission runner',blockers,submitted:false};
}
