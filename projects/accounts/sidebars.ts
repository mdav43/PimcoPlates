import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';
import {projectSidebar} from '../../src/sidebars/projectSidebar';

export default {main: projectSidebar(__dirname)} satisfies SidebarsConfig;
