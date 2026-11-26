import { site } from '@/config/site';

/**
 * The site root sends visitors to their language (based on the browser language)
 * or to English by default. Search engines see a canonical link to /en/.
 */
export const metadata = {
  title: 'SNTURCO',
  alternates: { canonical: `${site.url}/en/` },
  robots: { index: false, follow: true },
};

const script = `(function(){var b=${JSON.stringify(site.basePath)};var l=((navigator.languages&&navigator.languages[0])||navigator.language||'en').slice(0,2).toLowerCase();var s=['en','de','tr','pt','it','ru','ar'];location.replace(b+'/'+(s.indexOf(l)>-1?l:'en')+'/');})();`;

export default function RootPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=${site.basePath}/en/`} />
      </noscript>
      <p style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
        <a href={`${site.basePath}/en/`}>SNTURCO – continue to the website</a>
      </p>
    </>
  );
}
