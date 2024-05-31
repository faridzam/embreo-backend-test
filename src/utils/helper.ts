export const extractAuthHeader = (authHeader: string | undefined) => {
  const token = authHeader && authHeader.split(' ')[1];
  return token || ""
}