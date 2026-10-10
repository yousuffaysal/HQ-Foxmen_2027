import {ArrowUpRight} from 'lucide-react';

export function MacHelpVideo(){
  return <section className="mac-help" aria-labelledby="mac-help-title">
    <div><span className="eyebrow">MAC HELP</span><h2 id="mac-help-title">Mac won’t open Errandly?</h2><p>If macOS blocks Errandly when you first open it, this video walks through how to get started.</p><a href="https://youtu.be/xUxq7BIwb5c" target="_blank" rel="noopener noreferrer" className="accent-link">Watch on YouTube <ArrowUpRight size={15}/></a></div>
    <div className="help-player"><iframe src="https://www.youtube-nocookie.com/embed/xUxq7BIwb5c" title="Mac app help video" width="720" height="405" loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>
  </section>;
}
