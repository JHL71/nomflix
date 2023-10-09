export function makeImagePath(id: string, format?: string) {
  return id !== "" 
    ? `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`
    : `https://www.themoviedb.org/assets/2/apple-touch-icon-cfba7699efe7a742de25c28e08c38525f19381d31087c69e89d6bcb8e3c0ddfa.png`
}