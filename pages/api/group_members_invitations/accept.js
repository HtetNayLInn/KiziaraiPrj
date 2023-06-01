
import axios from "axios";
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (req, res) =>{

    if(req.method !== 'POST'){
        return res.status(405).end();
    }

    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    })

    const { data: { user }}    = await supabaseServerClient.auth.getUser()
    const { data: { session }} = await supabaseServerClient.auth.getSession()
   
    if(!!session && !!user){

        let {data:invitation_data, error:invitation_error}=await supabaseServerClient.from('ka_group_member_waitinglist').select().eq('id', req.body.id).eq('status',1).single();

        if(invitation_error){
            console.log('error',invitation_error);
            return res.status(400).json({ message: 'failed' });
        }else{
            if(invitation_data){
                 /*
                    id bigint generated by default as identity not null,
                    created_at timestamp with time zone null default now(),
                    status bigint null,
                    group_id bigint null,
                    admin_user_id uuid null,
                    target_user_email text null,
                    admin_user_email text null,

                    ka_view_user_emails
                */
      
                if(invitation_data.target_user_email==user.email){
                   //  ka_group_members_invitationsのstatusを2にする

                   let post_body  =  {
                        apikey: process.env.API_ROUTE_SECRET,
                        id:req.body.id,
                   }

                    const host = req.headers.host || 'localhost:3000';
                    const protocol = /^localhost/.test(host) ? 'http' : 'https';

                    let hostname = protocol + '://' + host;
                    await axios.post(hostname + '/api/group_members_invitations/accept_db',post_body)
                    .then((d)=>{
                        console.log('💫',d);
                        return res.status(200).json({ message: 'ok' });
                    }).catch((error)=>{
                        console.log('💫💫',error);
                        return res.status(400).json({ message: 'failed' });
                    });

                }
            }else{
                return res.status(400).json({ message: 'failed' });
            }
        }

    }else{    
        return  res.status(400).json({ message: 'not_authenticated' });
    }
}

export default handler;