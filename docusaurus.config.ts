import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';
import fs from 'node:fs';
import type {CatalogProject} from './plugins/api-catalog';

// Built by `npm run sync` (scripts/sync-apis.mjs) from every discovered OpenAPI spec.
const REGISTRY = './generated/registry.json';
if (!fs.existsSync(REGISTRY)) throw new Error('Missing generated/registry.json – run `npm run sync` first.');
const projects: CatalogProject[] = JSON.parse(fs.readFileSync(REGISTRY, 'utf8'));

/**
 * Every discovered API becomes:
 *  - its own docs plugin instance, served at /<id>/
 *  - generated API reference at /<id>/api (from its bundled OpenAPI spec)
 *  - a navbar, footer, home page and catalog entry
 * No config edits are ever needed to add an API.
 */

const projectDocsPlugins = projects.map((p) => [
  '@docusaurus/plugin-content-docs',
  {
    id: p.id,
    path: p.docsPath,
    routeBasePath: p.id,
    sidebarPath: `./generated/sidebars/${p.id}.ts`,
    docItemComponent: '@theme/ApiItem',
    editUrl: p.hasGuides ? 'https://github.com/mdav43/pimcoplates/tree/demo-bank/' : undefined,
    showLastUpdateTime: false,
  },
]);

// One OpenAPI plugin instance per project, bound to that project's docs instance.
const projectOpenApiPlugins = projects.map((p) => [
  'docusaurus-plugin-openapi-docs',
  {
    id: `openapi-${p.id}`,
    docsPluginId: p.id,
    config: {
      [p.id]: {
        specPath: `static/openapi/${p.id}.yaml`, // bundled by scripts/sync-apis.mjs
        outputDir: `${p.docsPath}/api`,
        downloadUrl: `/openapi/${p.id}.yaml`,
        sidebarOptions: {groupPathsBy: 'tag', categoryLinkSource: 'tag'},
        showSchemas: true,
      } satisfies OpenApiPlugin.Options,
    },
  },
]);

const config: Config = {
  title: 'Meridian Developer Portal',
  tagline: 'One home for every API, service and runbook across the bank.',
  favicon: 'img/logo.svg',
  url: 'https://meridian-developer-portal.pages.dev',
  baseUrl: '/',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    mermaid: true,
    hooks: {onBrokenMarkdownLinks: 'throw'},
  },
  i18n: {defaultLocale: 'en', locales: ['en']},

  presets: [
    [
      'classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: 'platform',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {customCss: './src/css/custom.css'},
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    ...projectDocsPlugins,
    ...projectOpenApiPlugins,
    './plugins/api-catalog/index.ts',
  ],

  themes: [
    'docusaurus-theme-openapi-docs',
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: ['platform', ...projects.map((p) => p.id)],
        docsPluginIdForPreferredVersion: undefined,
        highlightSearchTermsOnTargetPage: true,
      },
    ],
  ],

  themeConfig: {
    colorMode: {respectPrefersColorScheme: true},
    navbar: {
      title: 'Meridian Developer Portal',
      logo: {alt: 'Meridian', src: 'img/logo.svg'},
      items: [
        {
          type: 'dropdown',
          label: 'APIs',
          position: 'left',
          items: [...projects].sort((a, b) => a.name.localeCompare(b.name)).map((p) => ({label: p.name, to: `/${p.id}/intro`})),
        },
        {to: '/catalog', label: 'API Catalog', position: 'left'},
        {type: 'docSidebar', sidebarId: 'platform', label: 'Platform Standards', position: 'left'},
        {href: 'https://github.com/mdav43/pimcoplates/tree/demo-bank', label: 'GitHub', position: 'right'},
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'APIs',
          items: [
            {label: `API Catalog (${projects.length} APIs)`, to: '/catalog'},
            ...projects.filter((p) => p.origin === 'curated').map((p) => ({label: `${p.name} API`, to: `/${p.id}/api`})),
          ],
        },
        {
          title: 'Platform',
          items: [
            {label: 'Overview', to: '/platform/intro'},
            {label: 'API Standards', to: '/platform/api-standards'},
            {label: 'Service Map', to: '/platform/service-map'},
            {label: 'Auto-documenting APIs', to: '/platform/auto-documentation'},
            {label: 'Add a Project', to: '/platform/add-a-project'},
          ],
        },
      ],
      copyright: `Meridian Bank (fictional demo) · Built with Docusaurus · Hosted on Cloudflare`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'yaml', 'java', 'python'],
    },
    languageTabs: [
      {highlight: 'bash', language: 'curl', logoClass: 'curl'},
      {highlight: 'python', language: 'python', logoClass: 'python'},
      {highlight: 'javascript', language: 'nodejs', logoClass: 'nodejs'},
      {highlight: 'java', language: 'java', logoClass: 'java', variant: 'unirest'},
    ],
  } satisfies Preset.ThemeConfig,
};

export default config;
