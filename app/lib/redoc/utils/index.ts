import { AvailableMethod } from '@/lib/redoc/types/shared';

export function checkOpenApiIsCorrectMethod(method: string): method is AvailableMethod {
  return ['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace'].includes(method);
}
