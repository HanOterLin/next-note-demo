import {NextResponse} from "next/server";
import dayjs from "dayjs";
import {join} from 'path';
import {stat, mkdir, writeFile} from 'fs/promises'
import mime from 'mime'
import {addNote} from "@/lib/redis";
import {revalidatePath} from "next/cache";

export async function POST(request) {
    const formData = await request.formData()
    const file = formData.get('file')
    
    if(!file){
        return NextResponse.json(
            { error: "File is required." },
            { status: 400 }
        )
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
            return NextResponse.json(
                { error: "Something went wrong." },
                { status: 500 }
            )
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
        
        return NextResponse.json({
         fileUrl: `${relativeUploadDir}/${uniqueFilename}`, 
            uid: res
        })
        
    }catch (e) {
        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
    
}
