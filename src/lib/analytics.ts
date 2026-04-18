import { logger } from '@shared/utils/logger';

export function trackAuth(action: 'signup' | 'login' | 'logout'): void {
  logger.info('[analytics] auth', { action });
}

export function trackMutation(
  entity: string,
  action: 'create' | 'update' | 'delete',
  success: boolean,
): void {
  logger.info('[analytics] mutation', { entity, action, success });
}

export function trackRoutineGenerated(skinType: string, productCount: number): void {
  logger.info('[analytics] routine_generated', { skinType, productCount });
}

export function trackSubscriptionPurchased(productId: string): void {
  logger.info('[analytics] subscription_purchased', { productId });
}
