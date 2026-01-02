import { Button, Input } from "@chakra-ui/react"
import "./Profile.css"
import { useEffect, useState, useRef } from "react"
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  deleteDoc, 
  updateDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  getFirestore  // Add this import
} from 'firebase/firestore';
import { firebase_services } from "../utils/FirebaseServices"
import { useLocation, useNavigate } from "react-router-dom"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { getAuth, signOut } from "firebase/auth"
import { getActiveUser } from "../utils/Session";


const Profile = () => {

    const firebase_storage = getStorage()

    

    const db = getFirestore(firebase_services)

    //const signin_email_prop = useLocation()
    //const signin_email = signin_email_prop.state

    const activeUser = getActiveUser();
    const signin_email = activeUser?.email;


    //const [downloadurl, setDownloadUrl] = useState("")

    //useEffect(() => {

        //const image_ref = ref(firebase_storage, `assets/Img-06.png`)


        //getDownloadURL(image_ref)

          //.then((url) => {
            //setDownloadUrl(url)
            
        //})
   // },[])



    // getting friends data except teh logged user.(related infor of that data)
    const [data, setData] = useState([])
    const [user_ids, setUserIDS] = useState([])
    const [filtered_data, setFilteredData] = useState([])


    
    const fetch_all_profile_data =  async () => {


      try{

       const read_loggedout_profiles = query(collection(db, "accountDetails"), where("email", "!=", signin_email))  

      

       const readData = await getDocs(read_loggedout_profiles)

       const fetched_data = []
       const fetched_id = []

          readData.forEach((data_docs) => {

            let backend_data = data_docs.data()
            fetched_data.push(backend_data)
            fetched_id.push(data_docs.id)
          })

          setUserIDS(fetched_id)
          setData(fetched_data)
          setFilteredData(fetched_data)

      }catch(e){
         console.log(e)
      }
    }

    

    const [loggeduser, setLoggedUser] = useState([])
    const [user_doc_id, setUserDocID] = useState()
    const [user, setUsername] = useState("")
    const [loggeduser_username, setLoggedUsername] = useState("")
    const [user_image_url, setUserImage] = useState("")
    const [loggeduser_firstname, setLoggedUserFirstname] = useState("")
    const [loggeduser_lastname, setLoggedUserLastname] = useState("")

    
    

    // getting the logged user profile data.
    const fetch_user_profile_data = async () => {

      


      const logged_user_data = []

      



      const read_user_query = query(collection(db, "accountDetails"), where("email", "==", signin_email))

      const read_user = await getDocs(read_user_query)

      read_user.forEach((user_profile) => {

        let fetched_profile = user_profile.data()
        let fetched_profile_id = user_profile.id
        logged_user_data.push(fetched_profile)
        setUserDocID(fetched_profile_id)
        
 

      })

      setLoggedUser(logged_user_data)
      setUsername(logged_user_data[0].Firstname)
      setUserImage(logged_user_data[0].image_url)
      setLoggedUserFirstname(logged_user_data[0].Firstname)
      setLoggedUserLastname(logged_user_data[0].Lastname)
      setLoggedUsername(logged_user_data[0].username)


      



    }

    const [already_added, setAlreadyAdded] = useState([])


    // already registered users.
    // Enhanced get_already_added_friends with proper error handling
const get_already_added_friends = () => {
  if (!user_doc_id) {
    console.log("user_doc_id not available yet, skipping friends query");
    return;
  }

  console.log("Loading friends for user:", user_doc_id);

  const find_added_friends_query = query(
    collection(db, "friendsBook"), 
    where("user_id", "==", user_doc_id)
  );

  const fetch_added_friends = onSnapshot(find_added_friends_query, (find_added_profiles) => {
    let added_profiles_data = [];
    
    find_added_profiles.forEach((profiles) => {
      let friend_id = profiles.data().friend_id;
      
      // Prevent duplicates in the array
      if (!added_profiles_data.includes(friend_id)) {
        added_profiles_data.push(friend_id);
      }
    });

    console.log("Real-time friends update:", added_profiles_data);
    setAlreadyAdded(added_profiles_data);

    // IMPORTANT: Update button status when friends list changes
    if (id && added_profiles_data.includes(id)) {
      setAddStatus("Added");
    }

  }, (error) => {
    console.error("Error fetching friends:", error);
  });

  return fetch_added_friends;
};

  
    

    
    
    



    useEffect(() => {

      fetch_all_profile_data()
      fetch_user_profile_data()

      
    }, [])

    

    useEffect(() => {

      get_already_added_friends()

    }, [user])


    



    const [nickname, setNickName] = useState("")
    const [users_usernames, setOtherUsersUserName] = useState("")

    const [firstname, setFirstName] = useState("")
    const [lastname, setLastName] = useState("")
    const [image_url, setProfileImage] = useState("")


    const [index, setIndex] = useState(0)
    

    let [profile_clicked, setProfileClicked] = useState(false)

    const[id, setIDs] = useState()

    // profile clicking process and that passes that user data to the view.

    const view_user = (index) => {

      console.log("User Clicked")


      

      
      


      if(index !== undefined && index < data.length ){

        setNickName(data[index].nickname)
        setFirstName(data[index].Firstname)
        setLastName(data[index].Lastname)
        setProfileImage(data[index].image_url)
        setOtherUsersUserName(data[index].username)
        setIndex(index)
        setProfileClicked(true)
        

        menu_close()
        view_friends_id(index)

        
        

      }else{

        console.log("Array is Over..")
      }


    






      
     
    }


    const view_friends_id = (doc_index) => {

      if(doc_index !== undefined && doc_index < user_ids.length){
        
        setIDs(user_ids[doc_index])
        mark_add_friends(user_ids[doc_index])

      }else{
        console.log("ID Not Found")
      }
    }



    const navigate = useNavigate()
    

    const sign_out = async () => {

      //const auth = getAuth(firebase_services)
      //await signOut(auth)
      //navigate("/")
      

       const user = getActiveUser();
       if (!user) return; // no active user in this tab

       // Remove this user's session from localStorage
       const sessions = JSON.parse(localStorage.getItem("sessions") || "[]");
       const updatedSessions = sessions.filter((s) => s.uid !== user.uid);
       localStorage.setItem("sessions", JSON.stringify(updatedSessions));

       // Remove the active user from this tab
       sessionStorage.removeItem("activeUserId");

       // Redirect to home or signin page
       navigate("/", { replace: true });

    }

    
    

    const navigation = useNavigate()


    const chat_page = () => {


      
      const all_props = {
        id: user_doc_id,
        f_name: loggeduser[0].Firstname
      }


      navigation('/chat', {state: all_props})

    }



    let [ismenu_clicked, setIsMenuClicked] = useState(false)
    let [width, setWidth] = useState(window.innerWidth)

    

    

    const getClass = useRef(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)


    const styles = {
      right: '300px'
    }

    const menu_open = () => {

      if (width < 1200) {
        const get_list_class = getClass.current
        get_list_class.style.left = '0px'
        get_list_class.classList.add('open')
        setIsMenuOpen(true)
        
        // Add overlay for mobile/tablet
        document.body.style.overflow = 'hidden' // Prevent background scrolling
    }

      
      
    
      

      
      

      

    }


    const menu_close = () => {

      

      //const list_class = getClass.current
      //list_class.style.left = '-350px'

      // Only allow closing on screens smaller than 1200px
      if (width < 1200) {
        const get_list_class = getClass.current
        get_list_class.style.left = '-350px'
        get_list_class.classList.remove('open')
        setIsMenuOpen(false)
        
        // Remove overlay
        document.body.style.overflow = 'auto' // Restore scrolling
      }

      

      
    }

    

    

    useEffect(() => {

      const handle_width = () => {

        setWidth(window.innerWidth)

      }
      window.addEventListener('resize', handle_width)

    }, [width])



    const [searchinput, setSearchInput] = useState("")
    

    const handle_search_input = (e) => {

      setSearchInput(e.target.value)

    }

    


    const search_users = () => {

      

     if(searchinput == ""){

       setData(filtered_data)
     }else{
       
       const search_result = filtered_data.filter(profiles => profiles.username.toLowerCase().includes(searchinput.toLowerCase()))
       setData(search_result)


     }

    }

    

    useEffect(() => {

      search_users()

    }, [searchinput, filtered_data])

    // Friend Request System
    const [add_status, setAddStatus] = useState("Add to Square");
    const [friendRequests, setFriendRequests] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [sentRequests, setSentRequests] = useState([]);

    // Real-time listener for incoming friend requests
    useEffect(() => {
      if (!user_doc_id) return;

      const q = query(
        collection(db, "friendRequests"),
        where("to_user_id", "==", user_doc_id),
        where("status", "==", "pending")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({
            id: doc.id,
            ...doc.data()
          });
        });
        setFriendRequests(requests);
      });

      return () => unsubscribe();
    }, [user_doc_id]);

    // Real-time listener for sent requests (to update button status)
    useEffect(() => {
      if (!user_doc_id) return;

      const q = query(
        collection(db, "friendRequests"),
        where("from_user_id", "==", user_doc_id),
        where("status", "==", "pending")
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const requests = [];
        querySnapshot.forEach((doc) => {
          requests.push({
            id: doc.id,
            to_user_id: doc.data().to_user_id
          });
        });
        setSentRequests(requests);
      });

      return () => unsubscribe();
    }, [user_doc_id]);

    // Check if request already sent or users are already friends
    // Enhanced checkRequestStatus with better logic
const checkRequestStatus = async (friend_id) => {
  if (!friend_id || !user_doc_id) {
    console.log("Missing required IDs in checkRequestStatus");
    setAddStatus("Add to Square");
    return;
  }

  console.log("Checking status for friend:", friend_id);
  console.log("Already added friends:", already_added);

  // Check if already friends
  if (already_added.includes(friend_id)) {
    console.log("Already friends - setting status to Added");
    setAddStatus("Added");
    return;
  }

  // Check if request already sent
  const sentRequest = sentRequests.find(req => req.to_user_id === friend_id);
  if (sentRequest) {
    console.log("Request sent - setting status to Request Sent");
    setAddStatus("Request Sent");
    return;
  }

  try {
    // Check if there's a pending request from the other user
    const q = query(
      collection(db, "friendRequests"),
      where("from_user_id", "==", friend_id),
      where("to_user_id", "==", user_doc_id),
      where("status", "==", "pending")
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("Incoming request - setting status to Accept Request");
      setAddStatus("Accept Request");
      return;
    }

    console.log("No relationship - setting status to Add to Square");
    setAddStatus("Add to Square");
  } catch (error) {
    console.error("Error in checkRequestStatus:", error);
    setAddStatus("Add to Square");
  }
};

// Add effect to re-check button status when friends list updates
useEffect(() => {
  if (id && user_doc_id) {
    console.log("Re-checking button status due to friends list or profile change");
    mark_add_friends(id);
  }
}, [already_added, id, user_doc_id]);


    


    



    //const [add_status, setAddStatus] = useState("Add to Square")

    //const add_to_book = async () => {

      

      


      //const add_friends = await addDoc(collection(db, "friendsBook"), {

        //user_id: user_doc_id,// logged user id
        //nickname: nickname,
        //firstname: firstname,
        //lastname: lastname,
        //fullname: firstname + " " + lastname,
        //image: image_url,
        //added_user: user,
        //friend_id: id // other users ids
      //})

      
      //setAddStatus("Added")

    //}

    

    //const mark_add_friends =  (friend_id) => {


      

  
      //if(already_added.includes(friend_id)){
        
        //setAddStatus("Added")
      //}else{
        
        //setAddStatus("Add to Square")
      //}



    //}

    //const [friendRequests, setFriendRequests] = useState([
    //{
      //id: 1,
      //username: "Alice",
      //image_url: "https://randomuser.me/api/portraits/women/44.jpg",
      //time: "2 mins ago",
   // },
   // {
     // id: 2,
     // username: "Bob",
     // image_url: "https://randomuser.me/api/portraits/men/32.jpg",
     // time: "5 mins ago",
    //},
    //{
     // id: 3,
     // username: "Charlie",
      //image_url: "https://randomuser.me/api/portraits/men/65.jpg",
     // time: "10 mins ago",
   // },

    //{
     // id: 3,
     // username: "Charlie",
     // image_url: "https://randomuser.me/api/portraits/men/65.jpg",
    //  time: "10 mins ago",
    //},
  //]);

  
  
  //const [showNotifications, setShowNotifications] = useState(false);

   

  // Dummy Functions
  //const handleAcceptRequest = (id) => {
    //alert(`Accepted friend request ID: ${id}`);
    //setFriendRequests(friendRequests.filter((req) => req.id !== id));
  //};

  // Handle decline request
    const handleDeclineRequest = async (requestId) => {
      try {
        await updateDoc(doc(db, "friendRequests", requestId), {
          status: "declined",
          declined_at: serverTimestamp()
        });
      } catch (error) {
        console.error("Error declining request:", error);
      }
    };

  const send_friend_requests = async () => {
    

    try {
        if (add_status === "Added") return;
        
        if (add_status === "Accept Request") {
          // Accept the incoming request
          await handleAcceptRequest(requestDoc.id);
          return;
        }

        if (add_status === "Request Sent") return;

        // Send new friend request
        await addDoc(collection(db, "friendRequests"), {
          from_user_id: user_doc_id, // logged user id
          to_user_id: id, // other users id (other user id's means not logged user id)
          from_username: loggeduser_username, // request sent user username (logged user)
          from_firstname: loggeduser_firstname, // request sent user firstname (logged user)
          from_lastname: loggeduser_lastname, // request sent user lastname (logged user)
          from_image_url: user_image_url, // request sent user image (logged user)
          to_username: users_usernames, // selected user to request sent
          to_firstname: firstname, // selected user to reequest sent
          to_lastname: lastname, // selected user to reequest sent
          to_image_url: image_url, // selected user to reequest sent
          status: "pending",
          timestamp: serverTimestamp()
        });

        setAddStatus("Request Sent");
      } catch (error) {
        console.error("Error sending friend request:", error);
      }



    // first get the sending user id.
    // second get the selected user id.(selected for request sent)
  }


  // fetching request real time. ()
  


const handleAcceptRequest = async (requestId) => {
  try {
    // Get the specific request document more efficiently
    const requestDocRef = doc(db, "friendRequests", requestId);
    const requestDoc = await getDoc(requestDocRef);
    
    if (!requestDoc.exists()) {
      console.log("Request not found");
      return;
    }

    const requestData = requestDoc.data();

    // Add to LOGGED USER's friends list (person accepting the request)
    await addDoc(collection(db, "friendsBook"), {
      user_id: user_doc_id,                    // Current logged user
      nickname: requestData.from_username,
      firstname: requestData.from_firstname,
      lastname: requestData.from_lastname,
      fullname: requestData.from_firstname + " " + requestData.from_lastname,
      image: requestData.from_image_url,
      added_user: user,                        // Current user's username
      friend_id: requestData.from_user_id      // Person who sent the request
    });

    // Add to REQUEST SENDER's friends list (person who sent the request)
    await addDoc(collection(db, "friendsBook"), {
      user_id: requestData.from_user_id,       // Person who sent the request
      nickname: user,                          // Current user's username
      firstname: loggeduser_firstname,
      lastname: loggeduser_lastname,
      fullname: loggeduser_firstname + " " + loggeduser_lastname,
      image: user_image_url,
      added_user: requestData.from_username,   // Request sender's username
      friend_id: user_doc_id                   // Current logged user
    });

    // Update request status to accepted
    await updateDoc(requestDocRef, {
      status: "accepted",
      accepted_at: serverTimestamp()
    });

    console.log("Friend request accepted successfully!");

  } catch (error) {
    console.error("Error accepting request:", error);
  }
};


    // Updated mark_add_friends function
    const mark_add_friends = async (friend_id) => {
      await checkRequestStatus(friend_id);
    };

    // Format timestamp for display in popup
    const formatTime = (timestamp) => {
      if (!timestamp) return 'Just now';
      
      const now = new Date();
      const requestTime = timestamp.toDate();
      const diffMs = now - requestTime;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    };

    

  

  


   

    return(
        <div className="profile-main">
          <div className="pro-content-2">
              <div className="friends-list" ref={getClass} style={styles}>
                <div className="your-profile">
                <img width="60px" src={user_image_url}  alt="" />
                  <h2>{user} </h2>
                  <Button className="view-btn" onClick={sign_out}>Sign out</Button>
                </div>

                <div className="list">
                  <h1>Friends list</h1>
                  <div className="search-bar">
                    <Input onChange={handle_search_input} className="search" type="text" placeholder="Search by usernames"></Input>
                    <Button onClick={search_users} backgroundColor="green.500" className="search-btn">Search</Button>
                  </div>

                    {data.map((d, index) => (
                      <div className="user-list" key={index} onClick={() => view_user(index)}>  
                      <img src={d.image_url} alt="" className="pro-image-1" /> 
                      <span className="usernames">{d.username}</span>
                      </div>
                    ))}
                </div>
              </div>

              {profile_clicked !== false ? 
              
              <div className="pro-main">
                   {/* Notification Icon */}
                   <div className="notification-container">
                     <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 2.34 11.34 1 13 1C14.66 1 16 2.34 16 4C16 4.1 16 4.19 16 4.29C18.97 5.17 21 7.9 21 11V17L23 19ZM7 18H17V11C17 8.52 15.48 7 13 7C10.52 7 9 8.52 9 11V18Z" fill="white"/>
                       </svg>
                       {friendRequests && friendRequests.length > 0 && (
                         <span className="notification-badge">{friendRequests.length}</span>
                       )}
                     </div>
                     
                     {/* Notification Popup */}
                     {showNotifications && (
                       <div className="notification-popup">
                         <div className="notification-header">
                           <h3>Friend Requests</h3>
                           <button 
                             className="close-btn" 
                             onClick={() => setShowNotifications(false)}
                           >
                             ×
                           </button>
                         </div>
                         <div className="notification-content">
                           {friendRequests && friendRequests.length > 0 ? (
                             friendRequests.map((request, index) => (
                               <div key={index} className="request-item">
                                 <img src={request.from_image_url} alt="" className="request-avatar" />
                                 <div className="request-info">
                                   <span className="request-name">{request.from_username}</span>
                                   <span className="request-time">{formatTime(request.timestamp)}</span>
                                 </div>
                                 <div className="request-actions">
                                   <button 
                                     className="accept-btn"
                                     onClick={() => handleAcceptRequest(request.id)}
                                   >
                                     Accept
                                   </button>
                                   <button 
                                     className="decline-btn"
                                     onClick={() => handleDeclineRequest(request.id)}
                                   >
                                     Decline
                                   </button>
                                 </div>
                               </div>
                             ))
                           ) : (
                             <div className="no-requests">
                               <p>No pending friend requests</p>
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                   </div>

                   {width < 1000 && !isMenuOpen ? 
                   <svg className="menu-icon" onClick={menu_open} width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M56.6667 51C57.3888 51.0008 58.0834 51.2773 58.6085 51.7731C59.1337 52.2688 59.4497 52.9464 59.492 53.6673C59.5343 54.3882 59.2998 55.0981 58.8363 55.6519C58.3727 56.2057 57.7153 56.5616 56.9982 56.6468L56.6667 56.6667H11.3333C10.6112 56.6659 9.91658 56.3894 9.39146 55.8936C8.86634 55.3979 8.55033 54.7203 8.50801 53.9994C8.46569 53.2785 8.70024 52.5686 9.16375 52.0148C9.62726 51.461 10.2847 51.1051 11.0018 51.0198L11.3333 51H56.6667ZM56.6667 31.1667C57.4181 31.1667 58.1388 31.4652 58.6701 31.9965C59.2015 32.5279 59.5 33.2486 59.5 34C59.5 34.7515 59.2015 35.4721 58.6701 36.0035C58.1388 36.5348 57.4181 36.8333 56.6667 36.8333H11.3333C10.5819 36.8333 9.86122 36.5348 9.32986 36.0035C8.79851 35.4721 8.5 34.7515 8.5 34C8.5 33.2486 8.79851 32.5279 9.32986 31.9965C9.86122 31.4652 10.5819 31.1667 11.3333 31.1667H56.6667ZM56.6667 11.3333C57.4181 11.3333 58.1388 11.6319 58.6701 12.1632C59.2015 12.6946 59.5 13.4152 59.5 14.1667C59.5 14.9181 59.2015 15.6388 58.6701 16.1701C58.1388 16.7015 57.4181 17 56.6667 17H11.3333C10.5819 17 9.86122 16.7015 9.32986 16.1701C8.79851 15.6388 8.5 14.9181 8.5 14.1667C8.5 13.4152 8.79851 12.6946 9.32986 12.1632C9.86122 11.6319 10.5819 11.3333 11.3333 11.3333H56.6667Z" fill="white"/>
                    </svg> : null} 
              
                   <div className="profile-details">
                     <h1 className="pro-title">Discover Peoples</h1>
                     <h2>Profile Details.</h2>

                     <div className="pro-image">
                        <img className="pro-image-2" src={image_url} alt="" />
                     </div>

                     <div className="name">
                        <h1>{firstname}  {lastname}</h1>
                     </div>

                     <div className="pro-info">
                       <div className="friends-count">
                       </div>
                       <div className="email">
                          <h1>Nickname : {nickname}</h1>
                       </div>
                     </div>

                     <div className="btn-section">
                       <div className="add-chat-btn">
                         <Button onClick={send_friend_requests}>{add_status}</Button>
                       </div>
                       <div className="chat-btn">
                         <Button backgroundColor="green.500" onClick={chat_page} >Chat</Button>
                       </div>
                     </div>
                   </div> 
              </div>
              
              : 
              
              <div className="intro-main">
                   {/* Notification Icon for intro page as well */}
                   <div className="notification-container">
                     <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                         <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 19V20H3V19L5 17V11C5 7.9 7.03 5.17 10 4.29C10 4.19 10 4.1 10 4C10 2.34 11.34 1 13 1C14.66 1 16 2.34 16 4C16 4.1 16 4.19 16 4.29C18.97 5.17 21 7.9 21 11V17L23 19ZM7 18H17V11C17 8.52 15.48 7 13 7C10.52 7 9 8.52 9 11V18Z" fill="white"/>
                       </svg>
                       {friendRequests && friendRequests.length > 0 && (
                         <span className="notification-badge">{friendRequests.length}</span>
                       )}
                     </div>
                     
                     {/* Notification Popup */}
                     {showNotifications && (
                       <div className="notification-popup">
                         <div className="notification-header">
                           <h3>Friend Requests</h3>
                           <button 
                             className="close-btn" 
                             onClick={() => setShowNotifications(false)}
                           >
                             ×
                           </button>
                         </div>
                         <div className="notification-content">
                           {friendRequests && friendRequests.length > 0 ? (
                             friendRequests.map((request, index) => (
                               <div key={index} className="request-item">
                                 <img src={request.from_image_url} alt="" className="request-avatar" />
                                 <div className="request-info">
                                   <span className="request-name">{request.from_username}</span>
                                   <span className="request-time">{formatTime(request.timestamp)}</span>
                                 </div>
                                 <div className="request-actions">
                                   <button 
                                     className="accept-btn"
                                     onClick={() => handleAcceptRequest(request.id)}
                                   >
                                     Accept
                                   </button>
                                   <button 
                                     className="decline-btn"
                                     onClick={() => handleDeclineRequest(request.id)}
                                   >
                                     Decline
                                   </button>
                                 </div>
                               </div>
                             ))
                           ) : (
                             <div className="no-requests">
                               <p>No pending friend requests</p>
                             </div>
                           )}
                         </div>
                       </div>
                     )}
                   </div>

                    {width < 1000 && !isMenuOpen ? 
                    <svg className="menu-icon" onClick={menu_open} width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M56.6667 51C57.3888 51.0008 58.0834 51.2773 58.6085 51.7731C59.1337 52.2688 59.4497 52.9464 59.492 53.6673C59.5343 54.3882 59.2998 55.0981 58.8363 55.6519C58.3727 56.2057 57.7153 56.5616 56.9982 56.6468L56.6667 56.6667H11.3333C10.6112 56.6659 9.91658 56.3894 9.39146 55.8936C8.86634 55.3979 8.55033 54.7203 8.50801 53.9994C8.46569 53.2785 8.70024 52.5686 9.16375 52.0148C9.62726 51.461 10.2847 51.1051 11.0018 51.0198L11.3333 51H56.6667ZM56.6667 31.1667C57.4181 31.1667 58.1388 31.4652 58.6701 31.9965C59.2015 32.5279 59.5 33.2486 59.5 34C59.5 34.7515 59.2015 35.4721 58.6701 36.0035C58.1388 36.5348 57.4181 36.8333 56.6667 36.8333H11.3333C10.5819 36.8333 9.86122 36.5348 9.32986 36.0035C8.79851 35.4721 8.5 34.7515 8.5 34C8.5 33.2486 8.79851 32.5279 9.32986 31.9965C9.86122 31.4652 10.5819 31.1667 11.3333 31.1667H56.6667ZM56.6667 11.3333C57.4181 11.3333 58.1388 11.6319 58.6701 12.1632C59.2015 12.6946 59.5 13.4152 59.5 14.1667C59.5 14.9181 59.2015 15.6388 58.6701 16.1701C58.1388 16.7015 57.4181 17 56.6667 17H11.3333C10.5819 17 9.86122 16.7015 9.32986 16.1701C8.79851 15.6388 8.5 14.9181 8.5 14.1667C8.5 13.4152 8.79851 12.6946 9.32986 12.1632C9.86122 11.6319 10.5819 11.3333 11.3333 11.3333H56.6667Z" fill="white"/>
                    </svg> : null}

                <div className="intro">
                 <div className="intro-content">
                  <h1>Welcome to Profile {user}</h1>
                  <h3>Discover Friends and Share The Expirience With Them.</h3>
                 </div>
                 <img className="intro-img" src={"https://dpfydaomjpydlfrlpsia.supabase.co/storage/v1/object/public/assets/Img-06.png"} alt="" width="420px"/>
                 </div>
              </div>}
            </div>
        </div>
    )
}



export default Profile