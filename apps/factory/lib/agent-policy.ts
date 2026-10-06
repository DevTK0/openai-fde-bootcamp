export function agentPolicyArgs() {
  return [
    "-c",
    'default_permissions="factory"',
    "-c",
    'permissions.factory.filesystem={":minimal"="read",":workspace_roots"="write"}',
    "-c",
    "permissions.factory.network.enabled=false",
    "-c",
    'shell_environment_policy.inherit="none"',
    "-c",
    'shell_environment_policy.set={PATH="/usr/bin:/bin"}',
    "-c",
    "shell_environment_policy.experimental_use_profile=false",
    "-c",
    'approval_policy="never"',
  ]
}
