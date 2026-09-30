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
  const auto = projects.filter((p) => p.origin !== 'curated').length;
  return (
    <Layout title="Home" description="Central documentation portal for every Meridian project and API.">
      <header className={styles.hero}>
        <div className="container">
          <h1>Meridian Developer Portal</h1>
          <p>Every API in the bank, documented automatically from its OpenAPI spec — plus team guides and architecture where they exist. Searchable, cross-linked, rebuilt nightly.</p>
          <div className={styles.stats}>
            <div><strong>{projects.length}</strong><span>projects</span></div>
            <div><strong>{ops}</strong><span>API operations</span></div>
            <div><strong>{domains}</strong><span>business domains</span></div>
            <div><strong>{auto}</strong><span>auto-documented</span></div>
          </div>
          <div className={styles.cta}>
            <Link className="button button--secondary button--lg" to="/catalog">Browse the API catalog</Link>
            <Link className="button button--outline button--lg" to="/platform/intro">Platform standards</Link>
          </div>
        </div>
      </header>
      <main className="container margin-vert--lg">
        <h2>APIs</h2>
        <ProjectCards />
      </main>
    </Layout>
  );
}
