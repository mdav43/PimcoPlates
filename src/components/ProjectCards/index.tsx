import React from 'react';
import Link from '@docusaurus/Link';
import {useCatalog} from '@site/src/hooks/useCatalog';
import styles from './styles.module.css';

export default function ProjectCards() {
  const projects = useCatalog();
  const byId = Object.fromEntries(projects.map((p) => [p.id, p.name]));
  return (
    <div className={styles.grid}>
      {projects.map((p) => (
        <div key={p.id} className={styles.card}>
          <div className={styles.head}>
            <span className={styles.domain}>{p.domain}</span>
            <span>
              {p.origin !== 'curated' && <span className={`${styles.status} ${styles.auto}`} title={`Auto-documented from ${p.source}`}>AUTO</span>}{' '}
              <span className={`${styles.status} ${p.status === 'GA' ? styles.ga : styles.beta}`}>{p.status}</span>
            </span>
          </div>
          <h3><Link to={`/${p.id}/intro`}>{p.name}</Link></h3>
          <p>{p.summary}</p>
          <dl className={styles.meta}>
            <dt>Owner</dt><dd>{p.owner}</dd>
            <dt>Version</dt><dd>v{p.version}</dd>
            <dt>Endpoints</dt><dd>{p.operations.length}</dd>
            <dt>Depends on</dt>
            <dd>
              {p.dependsOn.length
                ? p.dependsOn.map((d, i) => (
                    <React.Fragment key={d}>{i > 0 && ', '}<Link to={`/${d}/intro`}>{byId[d]}</Link></React.Fragment>
                  ))
                : '—'}
            </dd>
          </dl>
          <div className={styles.actions}>
            <Link className="button button--primary button--sm" to={`/${p.id}/intro`}>{p.hasGuides ? 'Guides' : 'Overview'}</Link>
            <Link className="button button--secondary button--sm" to={`/${p.id}/api`}>API Reference</Link>
          </div>
        </div>
      ))}
    </div>
  );
}
