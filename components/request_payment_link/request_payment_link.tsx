import style from './style.module.css'
import { useState, useEffect } from 'react';
import { getTransactionStatus } from '../commons/commons';
import {useUser,useSupabaseClient} from '@supabase/auth-helpers-react';

const RequestPaymentLink = (props :any) => {


    const user = useUser();
    const supabaseClient = useSupabaseClient();

    const [id,setId] = useState<string>("");
    const [created_at,setCreated_at] = useState<string>("");
    const [source_group_id,setSource_group_id] = useState<string>("");
    const [target_group_id,setTarget_group_id] = useState<string>("");
    const [amount,setAmount] = useState<string>("");
    const [currency_type,setCurrency_type] = useState<string>("");
    const [transaction_status,setTransaction_status] = useState<string>("");
    const [description,setDescription] = useState<string>("");
    const [fabric_id,setFabric_id] = useState<string>("");
    const [source_user_id,setSource_user_id] = useState<string>("");
    const [target_user_id,setTarget_user_id] = useState<string>("");

    const [selectedTransactionStatus,setSelectedTransactionStatus] = useState<number>(1);

    const [paymentLink,setPaymentLink] = useState<string>("");


    useEffect(()=>{

        console.log("props",props.transaction);

        setId(props.transaction.id);
        setCreated_at(props.transaction.created_at);
        setSource_group_id(props.transaction.source_group_id);
        setTarget_group_id(props.transaction.target_group_id);
        setAmount(props.transaction.amount);
        setCurrency_type(props.transaction.currency_type);
        setTransaction_status(props.transaction.transaction_status);
        setDescription(props.transaction.description);
        setFabric_id(props.transaction.fabric_id);
        setSource_user_id(props.transaction.source_user_id);
        setTarget_user_id(props.transaction.target_user_id);

    },[props]);

    /*
        1:
            "支払いリンク発行依頼中";
        2:
            "支払いリンク発行済み";
        3:
            "支払い済み";
        4:
            "キャンセル";
    */

    /*
    
    ka_transaction_payment_links

    id bigint generated by default as identity not null,
    created_at timestamp with time zone null default now(),
    payment_link text null,
    source_group_id bigint null,
    source_user_id uuid null,
    target_group_id bigint null,
    target_user_id uuid null,

    */

    const issueLink = async () => {
        // ka_transaction_payment_linksにレコードを追加する
        let {data,error} = await supabaseClient.from('ka_transaction_payment_links').insert({
            source_group_id:source_group_id,
            source_user_id:source_user_id,
            target_group_id:target_group_id,
            target_user_id:target_user_id,
            payment_link:paymentLink
        }).select();

        if(data){
            console.log("data",data);
            alert('リンクを発行しました');
        }else{
            console.log("error",error);
            alert('リンクの発行に失敗しました');
        }

    }

    const updateTransactionStatus = async () => {

        if(user && id){
            console.log("updateTransactionStatus",selectedTransactionStatus);
            const {data,error} = await supabaseClient.from('ka_group_transactions').update({transaction_status:selectedTransactionStatus}).eq('id',id).select();
            if(data){
                console.log("data",data);

                alert('更新しました');

            }else{
                console.log("error",error);
                alert('更新に失敗しました');
            }

        }

    }


    return (
        <div className={style.container}>
            <div className={style.row}>
                <div className={style.col}>{id}</div>
                <div className={style.col}>{created_at}</div>
                <div className={style.col}>{source_group_id}</div>
                <div className={style.col}>{target_group_id}</div>
                <div className={style.col}>{amount}</div>
                <div className={style.col}>{currency_type}</div>
                <div className={style.col}>{getTransactionStatus(parseInt(transaction_status))}</div>
                <div className={style.col}>{description}</div>
                <div className={style.col}>{fabric_id}</div>
                <div className={style.col}>{source_user_id}</div>
                <div className={style.col}>{target_user_id}</div>
            </div>
            <div className={style.row}>
                {/* Transaction Statusをselectで選択し、selectedTransactionStatusに格納する */}
                <select onChange={(e)=>{setSelectedTransactionStatus(parseInt(e.target.value))}}>
                    <option value="1">支払いリンク発行依頼中</option>
                    <option value="2">支払いリンク発行済み</option>
                    <option value="3">支払い済み</option>
                    <option value="4">キャンセル</option>
                </select>

                <div className={style.button} onClick={updateTransactionStatus}>更新する</div>
            </div>
            <div className={style.row}>
                <input type="text" value={paymentLink} onChange={(e)=>{setPaymentLink(e.target.value)}}/>
                <div className={style.col}>{paymentLink}</div>
                <div className={style.button} onClick={issueLink}>リンクを発行する</div>
            </div>
        </div>);
}

export default RequestPaymentLink;