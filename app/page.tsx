import {getChatGPTUser,chatGPTSignInPath} from './chatgpt-auth';
import MemberWorkspace from './member-workspace';
export const dynamic='force-dynamic';
export default async function Home(){const u=await getChatGPTUser();if(!u)return <main className="profile-detail" style={{maxWidth:640,margin:'12vh auto'}}><p className="eyebrow">CAREER HUB</p><h1>Your private job workspace</h1><p>Join to track your applications, notifications and recruiter conversations. Every account has its own private records.</p><a className="action-link" href={chatGPTSignInPath('/')} target="_top">Join / Sign in with ChatGPT</a></main>;return <MemberWorkspace name={u.displayName}/>;}
