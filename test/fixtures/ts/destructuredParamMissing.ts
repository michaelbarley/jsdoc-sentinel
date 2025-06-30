/**
 * Greets a user.
 * @param id user id
 *           –– ⚠ “name” is **undocumented**
 * @returns greeting
 */
export const greet = ({ id, name }: { id: number; name: string }) =>
  `Hi ${name}!`;
