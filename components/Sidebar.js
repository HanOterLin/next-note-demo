import Link from "next/link";
import SidebarNoteList from '@/components/SidebarNoteList'
import EditButton from "@/components/EditButton";
import {Suspense} from "react";
import NoteListSkeleton from "@/components/NoteListSkeleton";
import SidebarSearchField from "@/components/SidebarSearchField";
import SidebarImport from "@/components/SidebarImport";

export default async function Sidebar() {
    return (
        <>
            <section className="col sidebar">
                <Link href={'/'} className="link--unstyled">
                    <section className="sidebar-header">
                        <img
                            className="logo"
                            src="/logo.svg"
                            width="22px"
                            height="20px"
                            alt=""
                            role="presentation"
                        />
                        <strong>React Notes</strong>
                    </section>
                </Link>
                <section className="sidebar-menu" role="menubar">
                    <SidebarSearchField ></SidebarSearchField>
                    <EditButton noteId={null}>New</EditButton>
                </section>
                <nav>
                    <Suspense fallback={<NoteListSkeleton />}>
                        <SidebarNoteList />
                    </Suspense>
                </nav>
                <SidebarImport></SidebarImport>
            </section>
        </>
    )
}
