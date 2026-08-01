import MainLayout from "./layouts/MainLayout";
import Sidebar from "./layouts/Sidebar";
import TopBar from "./layouts/TopBar";

interface Props{

    title:string;

    children:React.ReactNode;

}

export default function AppShell({

    title,
    children,

}:Props){

    return(

        <MainLayout

            sidebar={

                <Sidebar>

                    <div
                        style={{
                            fontSize:26,
                            fontWeight:700,
                            color:"#ffffff"
                        }}
                    >
                        CreatorOS
                    </div>

                </Sidebar>

            }

            header={

                <TopBar
                    title={title}
                />

            }

        >

            {children}

        </MainLayout>

    );

}
