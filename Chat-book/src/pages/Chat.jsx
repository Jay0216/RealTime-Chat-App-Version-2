import { Button, Icon, IconButton, Input } from "@chakra-ui/react"
import "./Chat.css"
import { getFirestore, getDocs, collection, doc, query, where, addDoc, onSnapshot, serverTimestamp} from "firebase/firestore"
import { firebase_services } from "../utils/FirebaseServices"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import { getDownloadURL, getStorage, ref } from "firebase/storage"


 
const ChatArea = () => {



    


    const get_user_props = useLocation()
    const get_props = get_user_props.state

    


    const Db_Connection = getFirestore(firebase_services)
    const firebase_storage = getStorage()


    

    //const [downloadurl, setDownloadUrl] = useState("")

    //useEffect(() => {

        //const image_ref = ref(firebase_storage, `assets/Img-07.png`)


        //getDownloadURL(image_ref)

          //.then((url) => {
            //setDownloadUrl(url)
            
        //})
    //},[])
    

    const [friends, setFriends] = useState([])
    const [filtered_friends_data, setFilteredData] = useState([])
    const [friends_id, setFriendsID] = useState([])
    

    const fetch_added_friends_profiles = async () => {

        let friends_profiles = []


        let friends_ids = []
        const friend = query(collection(Db_Connection, "friendsBook") , where("user_id", "==", get_props.id))

        const friends_book = await getDocs(friend)


        friends_book.forEach((fr) => {

           

            let friends_data  = fr.data()
            friends_profiles.push(friends_data)
            let friends_id = fr.data().friend_id
            friends_ids.push(friends_id)


        })

        setFriendsID(friends_ids)
        setFriends(friends_profiles)
        setFilteredData(friends_profiles)

        

    } 


    


    
    


    const [message, setMessage] = useState("")

    

    const handle_chat_input = (e) => {

        setMessage(e.target.value)

    }


    const chat_process = async () => {

        if(message == ""){
            alert("Please add the sending message..")
        }else{

            const new_message = {

            sender_id: get_props.id,
            message: message,
            reciever: firstname,
            reciever_id: fr_id,
            sender_name: get_props.f_name,
            timestamp: serverTimestamp()
        
            }

           try{

               const new_doc = await addDoc(collection(Db_Connection, "Messages"), new_message)
               console.log("Data added", new_doc.id)

               setMessage("")
           }catch(e){
              console.log(e)
           }
        }

      

        
    }

    const [firstname, setFirstName] = useState("")
    const [profilename, setProfileName] = useState("")
    const [ischatclicked, setIsChatClicked] = useState(false)
    const [fr_id, setFrId] = useState("")

    const view_chat_profiles = (user_index) => {

        


        if(user_index !== undefined && user_index < friends.length){

            setProfileName(`Chats with ${friends[user_index].firstname}`)
            setFirstName(friends[user_index].firstname)
            setIsChatClicked(true)
            setFrId(friends[user_index].friend_id)
            chat_menu_close()

            
            
            
        }else{
            console.log("No more friends")
        }

        
    }

    const [recieved, setRecivedMsgs]= useState([])
    const [send, setSendMsgs] = useState([])
    const [msglist, setMsgList] = useState([])
    

    const fetch_real_time_messages =  () => {

        

        let fetched_msgs = []
        let send_msg = []
        

        

        const recieving_msgs_query = query(collection(Db_Connection, "Messages") , where("reciever_id", "==", get_props.id), where("sender_id", "==", fr_id))

        const fetched_message = onSnapshot(recieving_msgs_query, (q_snapshot) => {
            

            q_snapshot.docChanges().forEach((change) => {

                

               
                if(change.type == "added"){
                    

                    let data = change.doc.data()
                    fetched_msgs.push(data)
                    
    
                }if(change.type === "modified") {
                    console.log("Modified city: ", change.doc.data());
                }
                if(change.type === "removed") {
                    console.log("Removed city: ", change.doc.data());
                }


                


                
            })

            setRecivedMsgs(fetched_msgs)

            
            


            
        })

        const send_msgs_query = query(collection(Db_Connection, "Messages"), where("sender_id", "==", get_props.id), where("reciever_id", "==", fr_id))

        const fetch_send_msgs = onSnapshot(send_msgs_query, (snapshots) => {

            snapshots.docChanges().forEach((send_msgs) => {

                if(send_msgs.type == "added"){
                    

                    let data = send_msgs.doc.data()
                    send_msg.push(data)

                }
            })

            setSendMsgs(send_msg)

            
            


        })

       

        const new_message = [...recieved.map(msgs => ({ ...msgs, isincomingmsg: true })), ...send.map(msgs => ({ ...msgs, isincomingmsg: false }))]

        new_message.sort((send_t, rec_t) => send_t.timestamp - rec_t.timestamp)
        setMsgList(new_message)

        
        
    }

    




    const [chatwidth, setChatWidth] = useState(window.innerWidth)


    const handle_width = () => {

        setChatWidth(window.innerWidth)
    }


    useEffect(() => {

        fetch_added_friends_profiles()
        window.addEventListener('resize', handle_width)

        

    }, [])



    useEffect(() => {

        fetch_real_time_messages()

    }, [send, recieved])



    
    








    const [searchinput, setSearchInput] = useState("")

    const get_search_input = (e) => {

        setSearchInput(e.target.value)

    }

    

    const searching_users = () => {

        
        if(searchinput == ""){
            setFriends(filtered_friends_data)
        }else{
            
            const search_result = filtered_friends_data.filter(friend_data => friend_data.fullname.toLowerCase().includes(searchinput.toLowerCase()) || friend_data.lastname.includes(searchinput))
            setFriends(search_result)
        }


    }


    useEffect(() => {

        searching_users()
        
    }, [searchinput, filtered_friends_data])


    const chatListClass = useRef(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

const chat_menu_open = () => {
    // Only allow opening on screens smaller than 1200px
    if (chatwidth < 1200) {
        const get_chat_list_class = chatListClass.current
        get_chat_list_class.style.left = '0px'
        get_chat_list_class.classList.add('open')
        setIsMenuOpen(true)
        
        // Add overlay for mobile/tablet
        document.body.style.overflow = 'hidden' // Prevent background scrolling
    }
}

const chat_menu_close = () => {
    // Only allow closing on screens smaller than 1200px
    if (chatwidth < 1200) {
        const get_chat_list_class = chatListClass.current
        get_chat_list_class.style.left = '-350px'
        get_chat_list_class.classList.remove('open')
        setIsMenuOpen(false)
        
        // Remove overlay
        document.body.style.overflow = 'auto' // Restore scrolling
    }
}

// Handle window resize to ensure proper behavior
useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth >= 1200) {
            // On desktop, always show chat list and remove any mobile styles
            const get_chat_list_class = chatListClass.current
            if (get_chat_list_class) {
                get_chat_list_class.style.left = '0px'
                get_chat_list_class.classList.remove('open')
            }
            setIsMenuOpen(false)
            document.body.style.overflow = 'auto'
        } else if (window.innerWidth < 1200 && isMenuOpen) {
            // On mobile/tablet, if menu was open, keep it open
            const get_chat_list_class = chatListClass.current
            if (get_chat_list_class) {
                get_chat_list_class.style.left = '0px'
                get_chat_list_class.classList.add('open')
            }
        }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
}, [isMenuOpen])

// Close menu when clicking outside (mobile/tablet only)
const handleOverlayClick = () => {
    if (chatwidth < 1200) {
        chat_menu_close()
    }
}


    return (
    <div className="chat-main">
        {/* Overlay for mobile/tablet */}
        {isMenuOpen && chatwidth < 1200 && (
            <div className="chat-overlay active" onClick={handleOverlayClick}></div>
        )}

        <div className="content-area">
            <div className="chat-list" ref={chatListClass}>
                <div className="chat-active">
                    <h2 className="cht-title">Chat List</h2>

                    <div className="search-bar">
                        <Input onChange={get_search_input} className="search" type="text" placeholder="Search users"></Input>
                        <Button onClick={searching_users} backgroundColor="green.500" className="search-btn">Search</Button>
                    </div>

                    {friends.map((info, index_no) => (
                        <div onClick={() => view_chat_profiles(index_no)} className="chat-friends" key={index_no}>
                            <img className="pro-image-chat" src={info.image} alt="" />
                            <div className="msgs">
                                <span className="names">{info.firstname} {info.lastname}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {ischatclicked !== true ? 
                <div className="cht-intro">
                    {chatwidth < 1200 && !isMenuOpen ? (
                        <svg className="menu-icon" onClick={chat_menu_open} width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M56.6667 51C57.3888 51.0008 58.0834 51.2773 58.6085 51.7731C59.1337 52.2688 59.4497 52.9464 59.492 53.6673C59.5343 54.3882 59.2998 55.0981 58.8363 55.6519C58.3727 56.2057 57.7153 56.5616 56.9982 56.6468L56.6667 56.6667H11.3333C10.6112 56.6659 9.91658 56.3894 9.39146 55.8936C8.86634 55.3979 8.55033 54.7203 8.50801 53.9994C8.46569 53.2785 8.70024 52.5686 9.16375 52.0148C9.62726 51.461 10.2847 51.1051 11.0018 51.0198L11.3333 51H56.6667ZM56.6667 31.1667C57.4181 31.1667 58.1388 31.4652 58.6701 31.9965C59.2015 32.5279 59.5 33.2486 59.5 34C59.5 34.7515 59.2015 35.4721 58.6701 36.0035C58.1388 36.5348 57.4181 36.8333 56.6667 36.8333H11.3333C10.5819 36.8333 9.86122 36.5348 9.32986 36.0035C8.79851 35.4721 8.5 34.7515 8.5 34C8.5 33.2486 8.79851 32.5279 9.32986 31.9965C9.86122 31.4652 10.5819 31.1667 11.3333 31.1667H56.6667ZM56.6667 11.3333C57.4181 11.3333 58.1388 11.6319 58.6701 12.1632C59.2015 12.6946 59.5 13.4152 59.5 14.1667C59.5 14.9181 59.2015 15.6388 58.6701 16.1701C58.1388 16.7015 57.4181 17 56.6667 17H11.3333C10.5819 17 9.86122 16.7015 9.32986 16.1701C8.79851 15.6388 8.5 14.9181 8.5 14.1667C8.5 13.4152 8.79851 12.6946 9.32986 12.1632C9.86122 11.6319 10.5819 11.3333 11.3333 11.3333H56.6667Z" fill="white"/>
                        </svg> 
                    ) : null}

                    <div className="cht-intro-content">
                        <h1>Welcome to Your Friends Square</h1>
                        <img className="cht-intro-img" src={"https://dpfydaomjpydlfrlpsia.supabase.co/storage/v1/object/public/assets/Img-07.png"} alt="" />
                    </div>
                </div>
                :
                <div className="chat-area">
                    {chatwidth < 1200 && !isMenuOpen ? 
                        <svg className="menu-icon" onClick={chat_menu_open} width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M56.6667 51C57.3888 51.0008 58.0834 51.2773 58.6085 51.7731C59.1337 52.2688 59.4497 52.9464 59.492 53.6673C59.5343 54.3882 59.2998 55.0981 58.8363 55.6519C58.3727 56.2057 57.7153 56.5616 56.9982 56.6468L56.6667 56.6667H11.3333C10.6112 56.6659 9.91658 56.3894 9.39146 55.8936C8.86634 55.3979 8.55033 54.7203 8.50801 53.9994C8.46569 53.2785 8.70024 52.5686 9.16375 52.0148C9.62726 51.461 10.2847 51.1051 11.0018 51.0198L11.3333 51H56.6667ZM56.6667 31.1667C57.4181 31.1667 58.1388 31.4652 58.6701 31.9965C59.2015 32.5279 59.5 33.2486 59.5 34C59.5 34.7515 59.2015 35.4721 58.6701 36.0035C58.1388 36.5348 57.4181 36.8333 56.6667 36.8333H11.3333C10.5819 36.8333 9.86122 36.5348 9.32986 36.0035C8.79851 35.4721 8.5 34.7515 8.5 34C8.5 33.2486 8.79851 32.5279 9.32986 31.9965C9.86122 31.4652 10.5819 31.1667 11.3333 31.1667H56.6667ZM56.6667 11.3333C57.4181 11.3333 58.1388 11.6319 58.6701 12.1632C59.2015 12.6946 59.5 13.4152 59.5 14.1667C59.5 14.9181 59.2015 15.6388 58.6701 16.1701C58.1388 16.7015 57.4181 17 56.6667 17H11.3333C10.5819 17 9.86122 16.7015 9.32986 16.1701C8.79851 15.6388 8.5 14.9181 8.5 14.1667C8.5 13.4152 8.79851 12.6946 9.32986 12.1632C9.86122 11.6319 10.5819 11.3333 11.3333 11.3333H56.6667Z" fill="white"/>
                        </svg> 
                    : null}

                    <h1>{profilename}</h1>

                    <div className="msg-area">
                        <ul>
                            {msglist.map((msgs, index) => (
                                <li key={index} className={msgs.isincomingmsg ? 'incoming' : 'outgoing'}>
                                    <div className="messages">
                                        {msgs.message} 
                                    </div>
                                    <span>{msgs.timestamp?.toDate().toLocaleTimeString()}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="chat-btns-areas">
                        <div className="chat-input">
                            <Input onChange={handle_chat_input} value={message} className="input" placeholder="Send Message"></Input>
                        </div>

                        <div className="send-btn">
                            <IconButton onClick={chat_process} backgroundColor="#3BC191" aria-label="Send" icon={<svg width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M58.8837 9.11625C58.5969 8.8308 58.2346 8.63317 57.8393 8.54659C57.4441 8.46001 57.0323 8.48808 56.6524 8.6275L9.90244 25.6275C9.49926 25.7804 9.15215 26.0524 8.9072 26.4073C8.66225 26.7622 8.53107 27.1832 8.53107 27.6144C8.53107 28.0456 8.66225 28.4666 8.9072 28.8215C9.15215 29.1764 9.49926 29.4483 9.90244 29.6012L28.1562 36.89L41.6287 23.375L44.6249 26.3712L31.0887 39.9075L38.3987 58.1613C38.5562 58.5566 38.8287 58.8956 39.1811 59.1343C39.5334 59.373 39.9493 59.5004 40.3749 59.5C40.8044 59.4912 41.2211 59.3525 41.5701 59.1021C41.9191 58.8517 42.184 58.5015 42.3299 58.0975L59.3299 11.3475C59.4747 10.9715 59.5096 10.5622 59.4306 10.1671C59.3516 9.77206 59.1619 9.40761 58.8837 9.11625Z" fill="#000"/>
                            </svg>}/>
                        </div>
                    </div> 
                </div>
            }
        </div>
    </div>
);
}


export default ChatArea