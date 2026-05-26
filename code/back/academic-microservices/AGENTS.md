# AGENTS.md

# Academic Event Driven Platform

Event-driven academic platform built with NestJS, Nx Monorepo, RabbitMQ, and PostgreSQL.

---

# Architecture Overview

This project follows an event-driven microservices architecture focused on asynchronous communication, resiliency, and eventual consistency.

## Main Technologies

- NestJS
- Nx Monorepo
- RabbitMQ
- PostgreSQL
- Docker
- Docker Compose
- TypeORM

---

# Services

## API Gateway

Main synchronous entrypoint responsible for:

- HTTP APIs
- Student registration
- Enrollment operations
- Database persistence
- Event publishing

The API Gateway publishes events to RabbitMQ after completing the main transaction.

---

## Notification Service

Asynchronous microservice responsible for:

- Consuming events
- Processing notifications
- Simulating background jobs
- Demonstrating asynchronous processing

---

## Audit Service

Asynchronous microservice responsible for:

- Event auditing
- Traceability
- Processing logs
- Metrics persistence

---

# Event-Driven Architecture

The system communicates asynchronously using RabbitMQ.

## Main Events

- `student.created`
- `enrollment.created`

## Architectural Goals

- Reduce coupling between services
- Improve resiliency
- Support eventual consistency
- Enable retry and fault tolerance
- Demonstrate asynchronous communication

---

# Monorepo Structure

```txt
apps/
├── api-gateway/
├── notification-service/
└── audit-service/

libs/
├── contracts/
├── rabbitmq/
└── shared/
```

---

# Shared Libraries

## libs/contracts

Contains shared event contracts and DTOs.

Examples:

- student-created.event.ts
- enrollment-created.event.ts

---

## libs/rabbitmq

Contains:

- RabbitMQ configuration
- Exchanges
- Queue configuration
- Shared messaging utilities

---

## libs/shared

Contains shared utilities:

- constants
- helpers
- logger
- common DTOs

---

# Database Strategy

This project uses a centralized PostgreSQL database for simplicity in the academic context.

Even though production-grade microservices commonly use database-per-service architecture, this project prioritizes:

- reduced operational complexity
- faster development
- simplified local environment

Decoupling is primarily achieved through asynchronous messaging rather than database isolation.

---

# RabbitMQ Strategy

RabbitMQ is the central messaging broker.

The architecture must support:

- durable queues
- persistent messages
- retry strategy
- dead letter queues (DLQ)
- asynchronous consumers

---

# Required Demonstrations

The system must demonstrate:

- message publication
- asynchronous consumption
- queue persistence
- consumer unavailability
- retry behavior
- dead letter queue flow
- eventual consistency
- processing time metrics

---

# Logging & Observability

All services should generate structured logs containing:

- timestamps
- event names
- correlation IDs
- processing duration
- retry attempts
- error traces

---

# Development Guidelines

## General Rules

- Prefer modular and decoupled architecture
- Avoid tight coupling between services
- Use events instead of direct service-to-service communication whenever possible
- Keep services independently executable
- Keep contracts centralized in shared libraries

---

## Event Naming Convention

Use dot notation:

```txt
student.created
enrollment.created
notification.sent
```

---

## Queue Naming Convention

```txt
student.created.queue
notification.queue
audit.queue
```

---

## Exchange Naming Convention

```txt
academic.events.exchange
```

---

# Docker Guidelines

All infrastructure components must run through Docker Compose.

Required containers:

- rabbitmq
- postgres
- api-gateway
- notification-service
- audit-service

---

# Testing Strategy

The project should support:

- unit tests
- integration tests
- event flow validation
- retry validation
- queue persistence validation

---

# Important Architectural Concepts

## Eventual Consistency

The system intentionally accepts temporary inconsistency between services while asynchronous processing completes.

---

## Retry Strategy

Failed message processing should retry automatically before reaching DLQ.

---

## Dead Letter Queue

Messages that exceed retry attempts should be redirected to a DLQ for analysis.

---

# Nx Workspace Guidelines

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

---

# Project Goals

This project is focused on demonstrating:

- asynchronous communication
- event-driven architecture
- messaging systems
- resiliency
- eventual consistency
- architectural trade-offs

The focus is architectural quality rather than feature quantity.
