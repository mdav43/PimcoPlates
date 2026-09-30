import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type * as OpenApiPlugin from 'docusaurus-plugin-openapi-docs';
import projects from './projects/projects.json';

/**
 * Every entry in projects/projects.json becomes:
 *  - its own docs plugin instance, served at /<id>/
 *  - an OpenAPI spec (projects/<id>/openapi.yaml) rendered to /<id>/api/
 *  - a navbar entry under "Projects"
 * Adding a project = add a folder + a registry entry. No config edits required.
 */

const projectDocsPlugins = projects.map((p) => [
  '@docusaurus/plugin-content-docs',
  {
    id: p.id,
    path: `projects/${p.id}/docs`,
    routeBasePath: p.id,
    sidebarPath: `./projects/${p.id}/sidebars.ts`,
    docItemComponent: '@theme/ApiItem',
    editUrl: 'https://github.com/mdav43/pimcoplates/tree/demo-bank/',
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
        specPath: `static/openapi/${p.id}.yaml`, // bundled from projects/<id>/openapi.yaml
        outputDir: `projects/${p.id}/docs/api`,
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
          label: 'Projects',
          position: 'left',
          items: projects.map((p) => ({label: p.name, to: `/${p.id}/intro`})),
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
          title: 'Projects',
          items: projects.map((p) => ({label: p.name, to: `/${p.id}/intro`})),
        },
        {
          title: 'API Reference',
          items: projects.map((p) => ({label: `${p.name} API`, to: `/${p.id}/api`})),
        },
        {
          title: 'Platform',
          items: [
            {label: 'Overview', to: '/platform/intro'},
            {label: 'API Standards', to: '/platform/api-standards'},
            {label: 'Service Map', to: '/platform/service-map'},
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
