'use client'
import{useSession, signIn, signOut} from "next-auth/react"
export default function Component(){
const {data: session}=useSession()
if(session) {
return(
<>
signed in as {session. user. email}<br/>
<button onclick={()=>signOut()}>sing out</button>
</>
)
}
return(
<>
not signed in <br/>
<button className="bg-orange-500 px-3 py-1 m-4 rounded"
onclick={()=>signIn()}>sign in</button>
</>
)
}
