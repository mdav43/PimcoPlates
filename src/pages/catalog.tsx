import React, {useMemo, useState} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {useCatalog} from '@site/src/hooks/useCatalog';
import styles from './catalog.module.css';

export default function Catalog() {
  const projects = useCatalog();
  const [q, setQ] = useState('');
  const [project, setProject] = useState('all');
  const [method, setMethod] = useState('all');
  const all = useMemo(() => projects.flatMap((p) => p.operations.map((o) => ({...o, projectName: p.name}))), [projects]);
  const rows = all.filter(
    (o) =>
      (project === 'all' || o.project === project) &&
      (method === 'all' || o.method === method) &&
      `${o.summary} ${o.path} ${o.operationId} ${o.tags.join(' ')}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <Layout title="API Catalog" description="Every operation across every Meridian API.">
      <main className="container margin-vert--lg">
        <h1>API Catalog</h1>
        <p>Every operation from every project's OpenAPI spec, generated at build time. Download a bundled spec:{' '}
          {projects.map((p, i) => (
            <React.Fragment key={p.id}>{i > 0 && ' · '}<a href={`/openapi/${p.id}.yaml`} download>{p.id}.yaml</a></React.Fragment>
          ))}
        </p>
        <div className={styles.filters}>
          <input className={styles.input} placeholder="Filter by path, summary, tag…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter operations" />
          <select className={styles.input} value={project} onChange={(e) => setProject(e.target.value)} aria-label="Project">
            <option value="all">All projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select className={styles.input} value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Method">
            <option value="all">All methods</option>
            {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <p className={styles.count}>{rows.length} of {all.length} operations</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead><tr><th>Project</th><th>Method</th><th>Path</th><th>Summary</th></tr></thead>
            <tbody>
              {rows.map((o) => (
                <tr key={o.url}>
                  <td><Link to={`/${o.project}/intro`}>{o.projectName}</Link></td>
                  <td><span className={`${styles.m} ${styles[o.method.toLowerCase()]}`}>{o.method}</span></td>
                  <td><code>{o.path}</code></td>
                  <td><Link to={o.url}>{o.summary}</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
}
