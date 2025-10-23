/**
 * Generic action response type for type-safe server actions
 * @template T - The type of data returned on success
 */
export type ActionResponse<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

/**
 * Creates a successful action response
 * @param data - The data to return on success
 * @returns ActionResponse with success: true and the provided data
 * 
 * @example
 * return successResponse({ userId: '123', email: 'user@example.com' })
 */
export function successResponse<T>(data: T): ActionResponse<T> {
  return { 
    success: true, 
    data 
  }
}

/**
 * Creates an error action response
 * @param error - The error message to return
 * @returns ActionResponse with success: false and the error message
 * 
 * @example
 * return errorResponse('User not found')
 */
export function errorResponse(error: string): ActionResponse<never> {
  return { 
    success: false, 
    error 
  }
}