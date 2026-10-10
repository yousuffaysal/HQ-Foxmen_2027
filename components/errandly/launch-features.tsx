import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {B} from '@/components/errandly/config';

const features = [
  {label:'01 / ORGANIZE & APPROVE',title:'Your Downloads,\nwith a little more order.',copy:'Turn a folder full of loose files into a workspace that makes sense. Choose your folders, review the proposed moves, and approve the plan.',image:'organize',alt:'Errandly concept showing files sorted into suggested folders with an approval button.',href:B+'/features/files',link:'Explore file organization'},
  {label:'02 / RENAME WITH CONTEXT',title:'A proper name\nfor every file.',copy:'From “Report final (1)” to something you can actually find. Preview clear, consistent names before anything changes.',image:'rename',alt:'Errandly concept comparing original filenames with clearer suggested names.',href:B+'/features/files',link:'Bring clarity to your files'},
  {label:'03 / LOCAL BY DESIGN',title:'At home,\non your Mac.',copy:'Work with the files you choose, on the computer you own. Core AI tasks are designed to run locally, including offline after model setup.',image:'local-mac',alt:'A realistic launch concept of Errandly running locally on a silver Mac laptop.',href:B+'/features/local-ai',link:'Meet your on-device AI'},
];

export function InterfacePreview(){return <section className="interface-preview"><div className="interface-heading"><div><span className="eyebrow">A LITTLE SPACE TO THINK</span><h2>Meet your everyday workspace.</h2></div><p>Your conversations, files, and context.<br/>Together in one quiet place.</p></div><a href={B+"/launch/errandly-interface.png"} target="_blank" rel="noopener noreferrer" aria-label="View full-size Errandly interface"><img src={B+"/launch/errandly-interface.png"} width="3420" height="2140" alt="Actual Errandly beta interface with a Personal project sidebar, a new conversation, Shadow on-device model, and a conversation context panel." loading="lazy"/></a><div className="interface-caption"><span>Errandly for macOS · Beta interface</span><span>Open image to explore the details ↗</span></div></section>}

export function LaunchFeatures(){return <>
  <div className="wrap"><InterfacePreview/></div>
  <section className="features wrap launch-features" aria-label="Meet Errandly">
    {features.map((f,i)=><article className={`feature ${i===1?'reverse':''}`} key={f.image}>
      <div className="feature-copy"><span className="eyebrow">{f.label}</span><h2 style={{whiteSpace:'pre-line'}}>{f.title}</h2><p>{f.copy}</p><Link href={f.href} className="accent-link">{f.link}<ArrowUpRight size={15}/></Link></div>
      <figure className="launch-image"><img src={`${B}/launch/${f.image}.png`} alt={f.alt} width={1536} height={1024} loading="lazy"/><figcaption>Product concept · In development</figcaption></figure>
    </article>)}
  </section>
  <section className="everyday-work wrap"><div className="everyday-heading"><span className="eyebrow">A FEW WORDS. A USEFUL RESULT.</span><h2>Small errands.<br/>More room to think.</h2><p>A preview of the workflows we’re building.</p></div>
    <div className="errand-grid">{[
      ['/summarize','Get to the useful part.','Turn long documents into clear notes and key takeaways.',B+'/features/documents'],
      ['/analyze','See the story in your numbers.','Bring spreadsheet data into an understandable report.',B+'/features/reports'],
      ['/improve','Find the words.','Refine a rough message into a clear email, note, or explanation.',B+'/product'],
      ['/organize','Your folders. Your rules.','Ask to split work into Business and Personal, then review the plan.',B+'/features/files'],
    ].map(([command,title,copy,href])=><Link href={href} className="errand-card" key={title}><code>{command}</code><h3>{title}</h3><p>{copy}</p><ArrowUpRight size={18}/></Link>)}</div>
    <Link className="accent-link setup-link" href={B+"/help"}>Need a hand getting started on Mac? <ArrowUpRight size={15}/></Link>
  </section>
</>}
