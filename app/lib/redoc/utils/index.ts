import { AvailableMethod } from '@/lib/redoc/types/shared';

export function checkIsCorrectMethod(method: string): method is AvailableMethod {
  return ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'].includes(method);
}
