import { useState } from "react";

import { Dialog } from "../../components/ui/Dialog";
import { Button } from "../../components/ui/Button";
import { TextField } from "../../components/ui/TextField";
import { TextArea } from "../../components/ui/TextArea";
import { Select } from "../../components/ui/Select";

export interface CreateProjectDialogProps {

    open:boolean;

    busy?:boolean;

    onClose():void;

    onCreate(data:{
        name:string;
        description:string;
        platform:"YouTube"|"TikTok"|"Both";
    }):Promise<void>;
}

export function CreateProjectDialog({

    open,

    busy=false,

    onClose,

    onCreate

}:CreateProjectDialogProps){

    const [name,setName]=useState("");

    const [description,setDescription]=useState("");

    const [platform,setPlatform]=useState<"YouTube"|"TikTok"|"Both">("Both");

    async function submit(){

        if(!name.trim()) return;

        await onCreate({

            name,

            description,

            platform

        });

        setName("");

        setDescription("");

        setPlatform("Both");

        onClose();

    }

    return(

        <Dialog

            open={open}

            title="إنشاء مشروع"

            onClose={onClose}

        >

            <div
                style={{
                    display:"flex",
                    flexDirection:"column",
                    gap:18
                }}
            >

                <TextField

                    label="اسم المشروع"

                    value={name}

                    onChange={e=>setName(e.target.value)}

                />

                <TextArea

                    label="الوصف"

                    value={description}

                    onChange={e=>setDescription(e.target.value)}

                />

                <Select

                    label="المنصة"

                    value={platform}

                    onChange={e=>setPlatform(e.target.value as any)}

                >

                    <option value="Both">YouTube + TikTok</option>

                    <option value="YouTube">YouTube</option>

                    <option value="TikTok">TikTok</option>

                </Select>

                <div

                    style={{

                        display:"flex",

                        justifyContent:"flex-end",

                        gap:12

                    }}

                >

                    <Button

                        variant="secondary"

                        onClick={onClose}

                    >

                        إلغاء

                    </Button>

                    <Button

                        disabled={busy}

                        onClick={submit}

                    >

                        إنشاء المشروع

                    </Button>

                </div>

            </div>

        </Dialog>

    );

}

export default CreateProjectDialog;
