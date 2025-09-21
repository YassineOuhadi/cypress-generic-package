# Approaches Overview

This section explains the two main ways to use the Cypress Generic Package:

1. [Extend POM Objects](./approach-1-pom.md) – Start with ready-to-use generic Page Object Model (POM) classes and extend them to fit your application. This approach provides **fine-grained control** over forms, menus, fields, and buttons, allowing full customization, but requires more manual setup.  

2. [BDD Pre-Implemented Steps](./approach-2-bdd.md) – Use pre-built Cucumber steps driven by JSON schemas for **higher-level abstraction and automation**. This approach reduces boilerplate code and accelerates BDD-style test development, making it ideal for quickly implementing end-to-end scenarios.