import MDXComponents from '@theme-original/MDXComponents';
import ApiRef, {OperationTable, SchemaRef} from '@site/src/components/ApiRef';
import ProjectCards from '@site/src/components/ProjectCards';
import ServiceMap from '@site/src/components/ServiceMap';

// Make portal components available in every MD/MDX file without imports.
export default {...MDXComponents, ApiRef, OperationTable, SchemaRef, ProjectCards, ServiceMap};
