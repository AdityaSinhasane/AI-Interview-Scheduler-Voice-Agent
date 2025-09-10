"use client"
import { UserDetailContext } from '@/context/UserDetailContext';
import { supabase } from '@/services/supabaseClient'
import React, { useContext, useEffect, useState } from 'react'

function Provider({ children }) {
    const [user, setUser] = useState();

    useEffect(() => {
        CreateNewUser();
    }, []);

    const CreateNewUser = async () => {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log("User:", user, "Auth error:", userError);

        // if no user signed in, stop here
        if (!user) return;

        // check if user exists in Users table
        const { data: Users, error } = await supabase
        .from('Users')
        .select("*")
        .eq('email', user.email);

        console.log("Users:", Users, "Error:", error);

        // if not exists, insert new record
        if (!Users || Users.length === 0) {
            const { data, error } = await supabase.from("Users").insert([
            {
                name: user.user_metadata?.name,
                email: user.email,
                picture: user.user_metadata?.picture
            }
            ]);
            console.log("Inserted:", data, "Error:", error);
            setUser(data);
            return;
        }
        setUser(Users[0]);

    };

    return (
        <UserDetailContext.Provider value={{user, setUser}}>
            <div>{children}</div>
        </UserDetailContext.Provider>
    )
    
}

export default Provider;


export const useUser = () =>{
    const context = useContext(UserDetailContext);
    return context;
}


