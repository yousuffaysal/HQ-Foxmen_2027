import Link from 'next/link';
import {B} from '@/components/errandly/config';
export default function NotFound(){return <main id="main" className="wrap"><section className="page-hero"><span className="eyebrow">404</span><h1>This errand took a wrong turn.</h1><p>The page you’re looking for isn’t here.</p><Link className="button" href={B}>Back to Errandly</Link></section></main>}
