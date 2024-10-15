import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHub from "next-auth/providers/github"
import {addUser, getUser} from "@/lib/redis";

export const {handlers, auth, signIn, signOut} = NextAuth({
    providers: [
        CredentialsProvider({
            name: '登录或注册',
            credentials: {
                username: {
                    label: 'email', type: 'text', placeholder: 'please input your email'
                },
                password: {
                    label: 'password', type: 'password', placeholder: 'please input your password'
                }
            },
            async authorize (credentials, req) {
                let user = null;
                user = await getUser(credentials.username, credentials.password)
    
                if (user === 1) {
                    return null
                }
    
                if (user === 0) {
                    user = await addUser(credentials.username, credentials.password)
                }
    
                if (!user) {
                    throw new Error('User was not found and could not be created.')
                }
    
                return user
            }
        }),
        GitHub,
    ],
    pages:{
        signIn: '/auth/signin'
    },
    callbacks: {
        authorized({request, auth}) {
            const {pathname} = request.nextUrl
            if (pathname.startsWith('/note/edit')) {
                return !!auth
            }
            return true;
        }
    },
}) 

