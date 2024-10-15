'use client'

import {useRouter} from "next/navigation";
import {importNote} from "@/app/actions";
import {useRef} from "react";
import {useFormStatus} from "react-dom";

function Submit() {
    const {pending} = useFormStatus
    return (
        <button disabled={pending}>{pending ? 'Submitting' : 'Submit'}</button>
    )
}

export default function SidebarImport() {
    
    const router = useRouter()
    const formRef = useRef(null)
    
    const upload = async (formData) => {
        const file = formData.get('file')
        if(!file){
            console.warn('Files list is empty')
            return
        }
        
        // const formData = new FormData()
        // formData.append('file', file)
        
        try {
            // const response = await fetch('/api/upload', {
            //     method: 'POST',
            //     body:formData
            // })
            //
            // if (!response.ok) {
            //     console.error("something went wrong");
            //     return;
            // }
            const data = await importNote(formData)
            router.push(`/note/${data.uid}`);
        }catch (e){
            console.error("something went wrong");
        }

        formRef.current?.reset()
    }
    
    return (
        <form  style={{ textAlign: "center" }} action={upload} ref={formRef}>
            <div style={{textAlign: 'center'}}>
                <label htmlFor={'file'} style={{cursor: 'point'}}>Import .md File</label>
                <input accept={'.md'} type={'file'} id={'file'} name={'file'} style={{ position : "absolute", clip: "rect(0 0 0 0)"  }}  />
            </div>
            <div><Submit/></div>
        </form>
    )
}
