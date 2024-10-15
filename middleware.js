// export {auth as middleware} from 'auth'

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

import { NextResponse } from 'next/server'

// export async function middleware(request) {
//   return NextResponse.next()
// }

export default async function (request) {
  return NextResponse.next()
} 
