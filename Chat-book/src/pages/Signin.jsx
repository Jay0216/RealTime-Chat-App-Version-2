import { Button, Input, useToast } from "@chakra-ui/react"
import "./Signin.css"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { firebase_services, getFirebaseAuth } from "../utils/FirebaseServices"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";


const Signin = () => {
    

    const sign_in_auth = getAuth(firebase_services)
    const firebase_storage = getStorage()

    const [signin_email, setSigninEmail] = useState("")
    const [signin_password, setSigninPassword] = useState("")

    const [showPassword, setShowPassword] = useState(false);

    const navigation_hook = useNavigate()

    //const Sign_in_process = async () => {


        
        //if(signin_email == "" || signin_password == ""){

            //input_err_toast()

       // }else{

        

         //try{

           // const Signin = await signInWithEmailAndPassword(sign_in_auth, signin_email, signin_password)
           // success_toast()
          //  navigation_hook("/profile", {state : signin_email})



            
        // }catch(e){

           // console.log(e)
           // credntials_err_toast()
        // }

       // }


    
  //  }

const Sign_in_process = async () => {
  if (signin_email === "" || signin_password === "") {
    input_err_toast();
    return;
  }

  try {
    // Each login gets a new auth instance tied to a unique app name
    const appName = "user_" + Date.now();
    const auth = getFirebaseAuth(appName);

    const result = await signInWithEmailAndPassword(auth, signin_email, signin_password);
    const user = result.user;
    const token = await user.getIdToken();

    // Save user session in localStorage (persist across browser sessions)
    let sessions = JSON.parse(localStorage.getItem("sessions") || "[]");

    // Optional: prevent duplicates for the same UID
    if (!sessions.find(s => s.uid === user.uid)) {
      sessions.push({ uid: user.uid, email: user.email, token, appName });
      localStorage.setItem("sessions", JSON.stringify(sessions));
    }

    // Mark this user as active for THIS browser tab
    sessionStorage.setItem("activeUserId", user.uid);

    success_toast();

    // Navigate to profile (no email in URL!)
    navigation_hook("/profile");
  } catch (e) {
    console.error(e);
    credntials_err_toast();
  }
};



    const toast = useToast()

    const input_err_toast = () => {


        toast({

            status: 'error',
            title: "Can't Login..",
            isClosable: true,
            description: "Please Fill the Input Fields..",
            duration: 9000
        })
    }


    const credntials_err_toast = () => {


        toast({

            status: 'error',
            title: "Can't Login..",
            isClosable: true,
            description: "Please Check Your Credentials Again..",
            duration: 9000
        })
    }


    const success_toast = () => {

        toast({

            status: 'success',
            title: "Successfully Login..",
            description: "Your Credentials are Matched..",
            duration: 9000,
            isClosable: true
        })
    }

    //const [downloadurl, setDownloadUrl] = useState("")

    //useEffect(() => {

        //const image_ref = ref(firebase_storage, `assets/Img-03.png`)


        //getDownloadURL(image_ref)

          //.then((url) => {
            //setDownloadUrl(url)
            
        //})
   // },[])



    return(

        <div className="main">


            <div className="main-class">

                
            

                <div className="img-area">
                  
                  <img  src={"https://dpfydaomjpydlfrlpsia.supabase.co/storage/v1/object/public/assets/Img-03.png"} alt="" width="550px" />

                </div>
             
                

                <div>

                    <div className="form-fields">
                      <h1>Enjoy the Chat.</h1>
                      <h3>Login into your Account</h3>
    

                  <div>
                      

                       <div>
                          <Input  className="email" onChange={(e) => setSigninEmail(e.target.value)} placeholder="Email" width="280px"></Input>
                       </div>

                      <div className="password-field-container">
    <Input
        className="password"
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={signin_password}
        onChange={(e) => setSigninPassword(e.target.value)}
    />
    <button
        className="password-toggle-icon"
        onClick={() => setShowPassword(!showPassword)}
        type="button"
    >
        {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
    </button>
</div>


                       <div >
                          <Button className="signin-btn" onClick={Sign_in_process} backgroundColor="#3BC191" width="280px">Sign in</Button>
                       </div>
                      </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}




export default Signin