import {auth} from "auth";
import {SessionProvider} from "next-auth/react";
import ClientComponent from "@/components/ClientComponent";

export default async function ClientPage(){
    const session = await auth()
    // if(session?.user){
    //     se
    // }
    
    
    return (
        <SessionProvider session={session}>
            <ClientComponent />
        </SessionProvider>
    )
}
