// cypress/support/utils/logger.ts
export const Logger = {
  info: (message: string) => cy.log(`ℹ️ [INFO] ${message}`),
  warn: (message: string) => cy.log(`⚠️ [WARNING] ${message}`),
  error: (message: string) => cy.log(`❌ [ERROR] ${message}`),
  tip: (message: string) => cy.log(`💡 [TIP] ${message}`),
};