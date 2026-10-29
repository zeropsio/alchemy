import { Resource } from "alchemy";
import type * as Redacted from "effect/Redacted";
import type { Project } from "./Project.ts";
import type { Providers } from "./Providers.ts";
import type { ZeropsRef } from "./ref.ts";
import type { KnownServiceType } from "./client/serviceTypes.gen.ts";
import type { ServiceStackRecord } from "./client/operations/ServiceStack.ts";
import type { Autoscaling } from "./internal/Autoscaling.ts";
import type { DeployProps } from "./internal/Deploy.ts";
import type { TimeoutOptions } from "./Config.ts";

export interface ServiceProps extends DeployProps {
  /** Parent project or an existing project ID. */
  project: Project | string;
  /** Private hostname; omitted names are generated per physical instance. */
  hostname?: string;
  /** Runtime settings catalogue identifier. */
  type: KnownServiceType | (string & {});
  /** Availability mode; defaults to NON_HA. */
  mode?: "NON_HA" | "HA";
  /** Environment visibility policy, fixed at creation. */
  envIsolation?: string;
  /** SSH visibility policy, fixed at creation. */
  sshIsolation?: string;
  /** Start without an app; defaults to false (READY_TO_DEPLOY without source). */
  startWithoutCode?: boolean;
  /** Horizontal and vertical resource bounds. */
  autoscaling?: Autoscaling;
  /** Desired final lifecycle state; omitted leaves state unmanaged. */
  state?: "running" | "stopped";
  /** Environment keys exclusively owned by this resource. */
  env?: Record<string, string | Redacted.Redacted<string> | ZeropsRef>;
  /** Enable or disable generated HTTP access after deployment. */
  subdomain?: boolean;
  /** Lifecycle deadlines. */
  timeouts?: TimeoutOptions;
}
export interface ServiceAttributes {
  serviceId: string;
  projectId: string;
  hostname: string;
  type: string;
  mode?: "NON_HA" | "HA";
  status: string;
  /** Observable configured scaling, not effective usage or transient resource metrics. */
  autoscaling: ServiceStackRecord["customAutoscaling"] | null;
  appVersionId?: string;
  /** Live active version; appVersionId remains the last version deployed by this resource. */
  activeAppVersionId?: string;
  sourceHash?: string;
  gitCommit?: string;
  subdomainUrls?: string[];
  envDigests: Record<string, string>;
}
export type Service = Resource<"Zerops.Service", ServiceProps, ServiceAttributes, never, Providers>;
export const Service = Resource<Service>("Zerops.Service");
