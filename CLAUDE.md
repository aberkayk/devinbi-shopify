@AGENTS.md

# Project: Shopify Storefront Frontend

A Next.js 16 e-commerce frontend using Shopify Storefront GraphQL API as the backend.

- **Store:** `devinbi.myshopify.com`
- **Stack:** Next.js 16, React 19, Tailwind CSS v4, TypeScript, shadcn/ui
- **Design doc:** `docs/superpowers/specs/2026-05-07-shopify-storefront-design.md`

## Core Principles

- The Shopify token **never** reaches the client — all API calls happen inside Server Components or Server Actions
- Cart data lives on Shopify; only the `cartId` is stored in an `httpOnly` cookie
- Use React 19 `useOptimistic` for optimistic UI feedback
- Cache strategy: static pages use ISR, dynamic pages (cart, account) use `cache: 'no-store'`

## Skill Usage Guide

| Skill | When to use |
|-------|-------------|
| `superpowers:brainstorming` | Before adding any new feature or page |
| `frontend-design:frontend-design` | When designing pages and components |
| `superpowers:writing-plans` | Before starting implementation — write a plan first |
| `superpowers:test-driven-development` | For critical business logic (cart, auth) |
| `superpowers:systematic-debugging` | When debugging unexpected behavior or errors |
| `superpowers:verification-before-completion` | Before claiming a task is done |
