'use server'

import {redirect} from "next/navigation";
import {addNote, delNote, updateNote,} from "@/lib/redis";
import {z} from 'zod'
import {sleep} from "@/lib/utils";
import {NextResponse} from "next/server";
import dayjs from "dayjs";
import {join} from "path";
import mime from "mime";
import {revalidatePath} from "next/cache";
import {stat, mkdir, writeFile} from 'fs/promises'


const schema = z.object({
    title:z.string(),
    content:z.string().min(1, 'please input content').max(100, 'max length is 100')
})

export async function saveNote(prevState, formData) {
    const noteId = formData.get('noteId')
    const data = {
        title: formData.get('title'),
        content: formData.get('body'),
        updateTime: new Date(),
    }
    
    const validated = schema.safeParse(data)
    if(!validated.success){
        return {
            error: validated.error.issues
        }
    }

    // await sleep(1000)

    if(noteId){
        updateNote(noteId, JSON.stringify(data))
        // redirect(`/note/${noteId}`)
    }else {
        const res = await addNote(JSON.stringify(data))
        // redirect(`/note/${res}`)
    }
    
    return {
        message: 'successfully!'
    }
}

export async function deleteNote(prevState, formData) {
    const noteId = formData.get('noteId')
    // await sleep(2000)

    delNote(noteId)
    // revalidatePath('/', 'layout')
    redirect('/')
}

export async function importNote(formData) {
    const file = formData.get('file')

    if(!file){
        return { error: "File is required." }
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const relativeUploadDir = `/uploads/${dayjs().format('YY-MM-DD')}`
    const uploadDir = join(global.process.cwd(), 'public', relativeUploadDir)

    try {
        await stat(uploadDir)
    }catch (e) {
        if(e.code === 'ENOENT'){
            await mkdir(uploadDir, {recursive: true})
        }else{
            console.error(e)
            return { error: "Something went wrong." }
        }
    }

    try {
        const uniqueSuffix = `${Math.random().toString(36).slice(-6)}`;
        const filename = file.name.replace(/\.[^/.]+$/, "")
        const uniqueFilename = `${filename}-${uniqueSuffix}.${mime.getExtension(file.type)}`;
        await writeFile(`${uploadDir}/${uniqueFilename}`, buffer);

        const res = await addNote(JSON.stringify({
            title: filename,
            content: buffer.toString('utf-8')
        }))

        revalidatePath('/', "layout")

        return ({
            fileUrl: `${relativeUploadDir}/${uniqueFilename}`,
            uid: res
        })

    }catch (e) {
        return { error: "Something went wrong." }
    }
}
