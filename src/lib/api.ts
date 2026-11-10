// Where the website's forms are sent. Staff read them in the admin portal.
export const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://internal-core-api.taxstreem.com/api/v1'
// The preview is a showpiece: its forms confirm on screen and send nothing.
export const SENDS = process.env.NEXT_PUBLIC_FLAT !== '1'
