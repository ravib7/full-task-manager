import { NextRequest, NextResponse } from 'next/server'

const proxy = (req: NextRequest) => {
    const { pathname } = req.nextUrl // url madhi kay chalu hay ta shodan sathi pathname use karto

    const adminToken = req.cookies.get("ADMIN")?.value
    const employeeToken = req.cookies.get("EMPLOYEE")?.value
    console.log(pathname)

    if (pathname.startsWith("/admin") && !adminToken) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    if (pathname.startsWith("/employee") && !employeeToken) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/admin/:path*", "/employee/:path*"]
}
export default proxy