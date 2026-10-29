// Derived from the zerops.yml JSON schema.
export type ZeropsYamlSetup = {
  readonly setup: string;
  readonly build?: {
    readonly os?: "alpine" | "ubuntu";
    readonly base?:
      | "alpine/bun@1"
      | "alpine/bun@1.3"
      | "alpine/bun@1.4"
      | "alpine/bun@canary"
      | "alpine/bun@latest"
      | "alpine/bun@nightly"
      | "alpine/dotnet@10"
      | "alpine/dotnet@8"
      | "alpine/dotnet@9"
      | "alpine/dotnet@latest"
      | "alpine/elixir@1"
      | "alpine/elixir@1.16"
      | "alpine/elixir@1.16.3"
      | "alpine/elixir@latest"
      | "alpine/gleam@1"
      | "alpine/gleam@1.5"
      | "alpine/gleam@1.5.1"
      | "alpine/gleam@latest"
      | "alpine/go@1"
      | "alpine/go@1.22"
      | "alpine/go@latest"
      | "alpine/golang@1"
      | "alpine/golang@latest"
      | "alpine/java@17"
      | "alpine/java@21"
      | "alpine/java@latest"
      | "alpine/nodejs@20"
      | "alpine/nodejs@22"
      | "alpine/nodejs@24"
      | "alpine/nodejs@latest"
      | "alpine/php@8.1"
      | "alpine/php@8.3"
      | "alpine/php@8.4"
      | "alpine/php@8.5"
      | "alpine/php@latest"
      | "alpine/python@3.11"
      | "alpine/python@3.12"
      | "alpine/python@latest"
      | "alpine/ruby@3.3"
      | "alpine/ruby@3.4"
      | "alpine/ruby@4.0"
      | "alpine/rust@1"
      | "alpine/rust@latest"
      | "alpine/rust@nightly"
      | "alpine/rust@stable"
      | "alpine/zero@0.1"
      | "alpine/zero@nightly"
      | "alpine@3.21"
      | "alpine@3.22"
      | "alpine@3.23"
      | "alpine@3.24"
      | "alpine@latest"
      | "ubuntu/bun@1"
      | "ubuntu/bun@1.3"
      | "ubuntu/bun@1.4"
      | "ubuntu/bun@canary"
      | "ubuntu/bun@latest"
      | "ubuntu/bun@nightly"
      | "ubuntu/deno@2"
      | "ubuntu/deno@2.0"
      | "ubuntu/deno@2.0.0"
      | "ubuntu/deno@latest"
      | "ubuntu/dotnet@10"
      | "ubuntu/dotnet@8"
      | "ubuntu/dotnet@9"
      | "ubuntu/dotnet@latest"
      | "ubuntu/elixir@1"
      | "ubuntu/elixir@1.16"
      | "ubuntu/elixir@1.16.2"
      | "ubuntu/elixir@latest"
      | "ubuntu/gleam@1"
      | "ubuntu/gleam@1.5"
      | "ubuntu/gleam@1.5.1"
      | "ubuntu/gleam@latest"
      | "ubuntu/go@1"
      | "ubuntu/go@1.22"
      | "ubuntu/go@latest"
      | "ubuntu/golang@1"
      | "ubuntu/golang@latest"
      | "ubuntu/java@17"
      | "ubuntu/java@21"
      | "ubuntu/java@latest"
      | "ubuntu/nodejs@20"
      | "ubuntu/nodejs@22"
      | "ubuntu/nodejs@24"
      | "ubuntu/nodejs@latest"
      | "ubuntu/php@8.1"
      | "ubuntu/php@8.3"
      | "ubuntu/php@8.4"
      | "ubuntu/php@8.5"
      | "ubuntu/php@latest"
      | "ubuntu/python@3.11"
      | "ubuntu/python@3.12"
      | "ubuntu/python@3.14"
      | "ubuntu/python@latest"
      | "ubuntu/ruby@3.3"
      | "ubuntu/ruby@3.4"
      | "ubuntu/ruby@4.0"
      | "ubuntu/rust@1"
      | "ubuntu/rust@latest"
      | "ubuntu/rust@nightly"
      | "ubuntu/rust@stable"
      | "ubuntu/zero@0.1"
      | "ubuntu/zero@nightly"
      | "ubuntu@22.04"
      | "ubuntu@24.04"
      | "ubuntu@26.04"
      | "ubuntu@latest"
      | ReadonlyArray<
          | "alpine/bun@1"
          | "alpine/bun@1.3"
          | "alpine/bun@1.4"
          | "alpine/bun@canary"
          | "alpine/bun@latest"
          | "alpine/bun@nightly"
          | "alpine/dotnet@10"
          | "alpine/dotnet@8"
          | "alpine/dotnet@9"
          | "alpine/dotnet@latest"
          | "alpine/elixir@1"
          | "alpine/elixir@1.16"
          | "alpine/elixir@1.16.3"
          | "alpine/elixir@latest"
          | "alpine/gleam@1"
          | "alpine/gleam@1.5"
          | "alpine/gleam@1.5.1"
          | "alpine/gleam@latest"
          | "alpine/go@1"
          | "alpine/go@1.22"
          | "alpine/go@latest"
          | "alpine/golang@1"
          | "alpine/golang@latest"
          | "alpine/java@17"
          | "alpine/java@21"
          | "alpine/java@latest"
          | "alpine/nodejs@20"
          | "alpine/nodejs@22"
          | "alpine/nodejs@24"
          | "alpine/nodejs@latest"
          | "alpine/php@8.1"
          | "alpine/php@8.3"
          | "alpine/php@8.4"
          | "alpine/php@8.5"
          | "alpine/php@latest"
          | "alpine/python@3.11"
          | "alpine/python@3.12"
          | "alpine/python@latest"
          | "alpine/ruby@3.3"
          | "alpine/ruby@3.4"
          | "alpine/ruby@4.0"
          | "alpine/rust@1"
          | "alpine/rust@latest"
          | "alpine/rust@nightly"
          | "alpine/rust@stable"
          | "alpine/zero@0.1"
          | "alpine/zero@nightly"
          | "alpine@3.21"
          | "alpine@3.22"
          | "alpine@3.23"
          | "alpine@3.24"
          | "alpine@latest"
          | "ubuntu/bun@1"
          | "ubuntu/bun@1.3"
          | "ubuntu/bun@1.4"
          | "ubuntu/bun@canary"
          | "ubuntu/bun@latest"
          | "ubuntu/bun@nightly"
          | "ubuntu/deno@2"
          | "ubuntu/deno@2.0"
          | "ubuntu/deno@2.0.0"
          | "ubuntu/deno@latest"
          | "ubuntu/dotnet@10"
          | "ubuntu/dotnet@8"
          | "ubuntu/dotnet@9"
          | "ubuntu/dotnet@latest"
          | "ubuntu/elixir@1"
          | "ubuntu/elixir@1.16"
          | "ubuntu/elixir@1.16.2"
          | "ubuntu/elixir@latest"
          | "ubuntu/gleam@1"
          | "ubuntu/gleam@1.5"
          | "ubuntu/gleam@1.5.1"
          | "ubuntu/gleam@latest"
          | "ubuntu/go@1"
          | "ubuntu/go@1.22"
          | "ubuntu/go@latest"
          | "ubuntu/golang@1"
          | "ubuntu/golang@latest"
          | "ubuntu/java@17"
          | "ubuntu/java@21"
          | "ubuntu/java@latest"
          | "ubuntu/nodejs@20"
          | "ubuntu/nodejs@22"
          | "ubuntu/nodejs@24"
          | "ubuntu/nodejs@latest"
          | "ubuntu/php@8.1"
          | "ubuntu/php@8.3"
          | "ubuntu/php@8.4"
          | "ubuntu/php@8.5"
          | "ubuntu/php@latest"
          | "ubuntu/python@3.11"
          | "ubuntu/python@3.12"
          | "ubuntu/python@3.14"
          | "ubuntu/python@latest"
          | "ubuntu/ruby@3.3"
          | "ubuntu/ruby@3.4"
          | "ubuntu/ruby@4.0"
          | "ubuntu/rust@1"
          | "ubuntu/rust@latest"
          | "ubuntu/rust@nightly"
          | "ubuntu/rust@stable"
          | "ubuntu/zero@0.1"
          | "ubuntu/zero@nightly"
          | "ubuntu@22.04"
          | "ubuntu@24.04"
          | "ubuntu@26.04"
          | "ubuntu@latest"
        >;
    readonly prepareCommands?: ReadonlyArray<string>;
    readonly buildCommands?: ReadonlyArray<string>;
    readonly deploy?: string | ReadonlyArray<string>;
    readonly deployFiles: string | ReadonlyArray<string>;
    readonly cache?: boolean | string | ReadonlyArray<string>;
    readonly addToRunPrepare?: string | ReadonlyArray<string>;
    readonly envVariables?: Readonly<Record<string, string | number | boolean | null>>;
  };
  readonly deploy?: {
    readonly readinessCheck?: {
      readonly httpGet?: {
        readonly scheme?: string;
        readonly host?: string;
        readonly port: number;
        readonly path: string;
      };
      readonly exec?: {
        readonly command: string;
      };
      readonly failureTimeout?: number;
      readonly retryPeriod?: number;
    };
    readonly temporaryShutdown?: boolean;
  };
  readonly run?: {
    readonly initCommands?: ReadonlyArray<string>;
    readonly prepareCommands?: ReadonlyArray<string>;
    readonly os?: "alpine" | "ubuntu";
    readonly base?:
      | "alpine/bun@1"
      | "alpine/bun@1.3"
      | "alpine/bun@1.4"
      | "alpine/bun@canary"
      | "alpine/bun@latest"
      | "alpine/bun@nightly"
      | "alpine/docker@26"
      | "alpine/docker@26.1"
      | "alpine/docker@26.1.5"
      | "alpine/docker@latest"
      | "alpine/dotnet@10"
      | "alpine/dotnet@8"
      | "alpine/dotnet@9"
      | "alpine/dotnet@latest"
      | "alpine/elixir@1"
      | "alpine/elixir@1.16"
      | "alpine/elixir@1.16.3"
      | "alpine/elixir@latest"
      | "alpine/gleam@1"
      | "alpine/gleam@1.5"
      | "alpine/gleam@1.5.1"
      | "alpine/gleam@latest"
      | "alpine/go@1"
      | "alpine/go@1.22"
      | "alpine/go@latest"
      | "alpine/golang@1"
      | "alpine/golang@1.22"
      | "alpine/golang@latest"
      | "alpine/java@17"
      | "alpine/java@21"
      | "alpine/java@latest"
      | "alpine/nginx@1.22"
      | "alpine/nginx@latest"
      | "alpine/nodejs@20"
      | "alpine/nodejs@22"
      | "alpine/nodejs@24"
      | "alpine/nodejs@latest"
      | "alpine/php-apache@8.1"
      | "alpine/php-apache@8.1+2.4"
      | "alpine/php-apache@8.3"
      | "alpine/php-apache@8.3+2.4"
      | "alpine/php-apache@8.4"
      | "alpine/php-apache@8.4+2.4"
      | "alpine/php-apache@8.5"
      | "alpine/php-apache@8.5+2.4"
      | "alpine/php-apache@latest"
      | "alpine/php-nginx@8.3"
      | "alpine/php-nginx@8.3+1.22"
      | "alpine/php-nginx@8.4"
      | "alpine/php-nginx@8.4+1.22"
      | "alpine/php-nginx@8.5"
      | "alpine/php-nginx@8.5+1.28"
      | "alpine/php-nginx@latest"
      | "alpine/python@3.11"
      | "alpine/python@3.12"
      | "alpine/python@latest"
      | "alpine/ruby@3.3"
      | "alpine/ruby@3.4"
      | "alpine/ruby@4.0"
      | "alpine/ruby@latest"
      | "alpine/rust@1"
      | "alpine/rust@latest"
      | "alpine/rust@nightly"
      | "alpine/rust@stable"
      | "alpine/static"
      | "alpine/static@1.0"
      | "alpine/static@latest"
      | "alpine/zero@0.1"
      | "alpine/zero@latest"
      | "alpine/zero@nightly"
      | "alpine@3.21"
      | "alpine@3.22"
      | "alpine@3.23"
      | "alpine@3.24"
      | "alpine@latest"
      | "static"
      | "swarm"
      | "swarm-vm"
      | "swarm-vm@1"
      | "swarm@1"
      | "ubuntu/bun@1"
      | "ubuntu/bun@1.3"
      | "ubuntu/bun@1.4"
      | "ubuntu/bun@canary"
      | "ubuntu/bun@latest"
      | "ubuntu/bun@nightly"
      | "ubuntu/deno@2"
      | "ubuntu/deno@2.0"
      | "ubuntu/deno@2.0.0"
      | "ubuntu/deno@latest"
      | "ubuntu/dotnet@10"
      | "ubuntu/dotnet@8"
      | "ubuntu/dotnet@9"
      | "ubuntu/dotnet@latest"
      | "ubuntu/elixir@1"
      | "ubuntu/elixir@1.16"
      | "ubuntu/elixir@1.16.2"
      | "ubuntu/elixir@latest"
      | "ubuntu/gleam@1"
      | "ubuntu/gleam@1.5"
      | "ubuntu/gleam@1.5.1"
      | "ubuntu/gleam@latest"
      | "ubuntu/go@1"
      | "ubuntu/go@1.22"
      | "ubuntu/go@latest"
      | "ubuntu/golang@1"
      | "ubuntu/golang@1.22"
      | "ubuntu/golang@latest"
      | "ubuntu/java@17"
      | "ubuntu/java@21"
      | "ubuntu/java@latest"
      | "ubuntu/nginx@1.22"
      | "ubuntu/nginx@latest"
      | "ubuntu/nodejs@20"
      | "ubuntu/nodejs@22"
      | "ubuntu/nodejs@24"
      | "ubuntu/nodejs@latest"
      | "ubuntu/php-apache@8.1"
      | "ubuntu/php-apache@8.1+2.4"
      | "ubuntu/php-apache@8.3"
      | "ubuntu/php-apache@8.3+2.4"
      | "ubuntu/php-apache@8.4"
      | "ubuntu/php-apache@8.4+2.4"
      | "ubuntu/php-apache@8.5"
      | "ubuntu/php-apache@8.5+2.4"
      | "ubuntu/php-apache@latest"
      | "ubuntu/php-nginx@8.3"
      | "ubuntu/php-nginx@8.3+1.22"
      | "ubuntu/php-nginx@8.4"
      | "ubuntu/php-nginx@8.4+1.22"
      | "ubuntu/php-nginx@8.5"
      | "ubuntu/php-nginx@8.5+1.28"
      | "ubuntu/php-nginx@latest"
      | "ubuntu/python@3.11"
      | "ubuntu/python@3.12"
      | "ubuntu/python@3.14"
      | "ubuntu/python@latest"
      | "ubuntu/ruby@3.3"
      | "ubuntu/ruby@3.4"
      | "ubuntu/ruby@4.0"
      | "ubuntu/ruby@latest"
      | "ubuntu/rust@1"
      | "ubuntu/rust@latest"
      | "ubuntu/rust@nightly"
      | "ubuntu/rust@stable"
      | "ubuntu/static"
      | "ubuntu/static@1.0"
      | "ubuntu/static@latest"
      | "ubuntu/zero@0.1"
      | "ubuntu/zero@latest"
      | "ubuntu/zero@nightly"
      | "ubuntu@22.04"
      | "ubuntu@24.04"
      | "ubuntu@26.04"
      | "ubuntu@latest"
      | "zcp@1"
      | "zcp@latest";
    readonly start?: string;
    readonly documentRoot?: string;
    readonly siteConfigPath?: string;
    readonly envReplace?: {
      readonly target: string | ReadonlyArray<string>;
      readonly delimiter: string | ReadonlyArray<string>;
    };
    readonly healthCheck?: {
      readonly httpGet?: {
        readonly scheme?: string;
        readonly host?: string;
        readonly port: number;
        readonly path: string;
      };
      readonly exec?: {
        readonly command: string;
      };
      readonly failureTimeout?: number;
      readonly disconnectTimeout?: number;
      readonly recoveryTimeout?: number;
      readonly execPeriod?: number;
    };
    readonly routing?: {
      readonly root?: string;
      readonly cors?: string;
      readonly redirects?: ReadonlyArray<{
        readonly from: string;
        readonly to: string;
        readonly status?: number;
        readonly preservePath?: boolean;
        readonly preserveQuery?: boolean;
      }>;
      readonly headers?: ReadonlyArray<{
        readonly for: string;
        readonly values: Readonly<Record<string, string>>;
      }>;
    };
    readonly volume?: {
      readonly hostname: string;
      readonly mountPath?: string;
      readonly readOnly?: boolean;
    };
    readonly ports?: ReadonlyArray<{
      readonly protocol?: "tcp" | "udp";
      readonly port: number;
      readonly description?: string;
      readonly httpSupport?: boolean;
    }>;
    readonly envVariables?: Readonly<Record<string, string | number | boolean | null>>;
    readonly startCommands?: ReadonlyArray<{
      readonly name?: string;
      readonly command: string;
      readonly workingDir?: string;
      readonly user?: string;
      readonly initCommands?: ReadonlyArray<string>;
    }>;
    readonly crontab?: ReadonlyArray<{
      readonly timing: string;
      readonly command: string;
      readonly workingDir?: string;
      readonly allContainers: boolean;
    }>;
  };
  readonly extends?: string | ReadonlyArray<string>;
};
export type ZeropsYamlDoc = { readonly zerops: ReadonlyArray<ZeropsYamlSetup> };
