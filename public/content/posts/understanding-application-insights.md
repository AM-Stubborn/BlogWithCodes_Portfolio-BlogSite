# Understanding Azure Application Insights

Azure Application Insights helps developers and IT teams monitor application performance and health in real time. It tracks requests, dependencies, exceptions, and metrics as part of Azure Monitor.

## Why use it?

- Track performance bottlenecks
- Detect failures early
- Understand user interactions
- Inspect dependency health
- Alert on threshold breaches

## How it works

1. Instrument the app with an SDK
2. Collect telemetry (requests, errors, dependencies, performance)
3. Store and analyze in Log Analytics
4. Visualize with dashboards, charts, and reports

## Key features

Live Metrics, request tracking, exception tracking, dependency tracking, user telemetry, alerts, and integrations with Azure DevOps / Power BI.

## Quick .NET setup

```bash
Install-Package Microsoft.ApplicationInsights.AspNetCore
```

Create an Application Insights resource in Azure, set the instrumentation key/connection string, deploy, then monitor in the portal.

## Useful KQL starters

```kusto
requests
| take 10
```

```kusto
requests
| where success == false
```

```kusto
exceptions
| where timestamp > ago(24h)
```

```kusto
dependencies
| where duration > 500ms
```

## Best practices

Enable sampling, emit custom events for business metrics, correlate logs across services, automate alerts, keep queries tight, and wire monitoring into CI/CD.

*Migrated from [Blog with Codes](https://blogwithcodes.blogspot.com/2025/02/understanding-of-application-insights.html).*
