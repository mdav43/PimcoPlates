import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import ProjectCards from '@site/src/components/ProjectCards';
import {useCatalog} from '@site/src/hooks/useCatalog';
import styles from './index.module.css';

export default function Home() {
  const projects = useCatalog();
  const ops = projects.reduce((n, p) => n + p.operations.length, 0);
  const domains = new Set(projects.map((p) => p.domain)).size;
  return (
    <Layout title="Home" description="Central documentation portal for every Meridian project and API.">
      <header className={styles.hero}>
        <div className="container">
          <h1>Meridian Developer Portal</h1>
          <p>One place for every team's guides, architecture and OpenAPI reference — searchable, cross-linked and versioned alongside the code.</p>
          <div className={styles.stats}>
            <div><strong>{projects.length}</strong><span>projects</span></div>
            <div><strong>{ops}</strong><span>API operations</span></div>
            <div><strong>{domains}</strong><span>business domains</span></div>
          </div>
          <div className={styles.cta}>
            <Link className="button button--secondary button--lg" to="/catalog">Browse the API catalog</Link>
            <Link className="button button--outline button--lg" to="/platform/intro">Platform standards</Link>
          </div>
        </div>
      </header>
      <main className="container margin-vert--lg">
        <h2>Projects</h2>
        <ProjectCards />
      </main>
    </Layout>
  );
}
