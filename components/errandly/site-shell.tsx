'use client';
import {usePathname} from 'next/navigation';
import {Header, Footer} from './site';
import {B} from '@/components/errandly/config';
export default function SiteShell({children}:{children:React.ReactNode}) {
  const pathname=usePathname();
  return pathname.startsWith(B+'/workspace') ? <>{children}</> : <><Header/>{children}<Footer/></>;
}
