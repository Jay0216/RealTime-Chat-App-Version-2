import { Box, Button, Input, useToast, InputGroup, InputRightElement } from "@chakra-ui/react"
import "./Signup.css"
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, addDoc, collection, doc } from "firebase/firestore"
import { getDownloadURL, getStorage, ref } from "firebase/storage"
import { firebase_services } from "../utils/FirebaseServices"
import { useReducer, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const Signup = () => {

  
  
  const authentication = getAuth(firebase_services)
  const firebase_storage = getStorage()

  
  const [user_email, setEmail] = useState("")
  const [user_password, setPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false); // toggle state

  const togglePassword = () => setShowPassword(!showPassword);

  
  const Initial_States = {

    firstname: "",
    lastname: "",
    
  }



  const Reducer_Func = (state, action) => {

    

    switch(action.type){

      case 'GET_FIRST_INPUT':
        
        
        return{

          ...state,
          firstname: action.usernames,
          
        }
      case 'GET_SECOND_INPUT':
        return{
          ...state,
          lastname: action.usernames
        }
      default:
        return state
    }

    
  }



  


  const [state, dispatch] = useReducer(Reducer_Func, Initial_States)

  const navigation = useNavigate()
  

  const Sign_up_process = () => {

    if(user_email == "" || user_password == "" || state.firstname == "" || state.lastname == ""){
      error_toast()
    }else{

     add_user_details()

     createUserWithEmailAndPassword(authentication, user_email, user_password)

       .then((userCredentials) =>{
          const created_user = userCredentials.user
          console.log(created_user) 
          success_toast()
       })
       .catch((error) => {
          const error_msg = error.message

          console.log(error_msg)
       })

       

       const User_Data_Prop = {
        firstname: state.firstname,
        lastname: state.lastname,
        email: user_email
       }


       
       navigation('/account', {state : User_Data_Prop})

       

    }
  } 

    
    
  

  


  const add_user_details = async () => {

    

    
     

     const db_Connection =  getFirestore(firebase_services)

     try{

      const Db_Doc_1 = await addDoc(collection(db_Connection, "userDetails"), {
        Firstname : state.firstname,
        Lastname : state.lastname,
      })
      
      success_toast()
     }catch(e){
      console.log("Can't Added Data to the Firestore DB..!!", e)
     }


  

  }

  const toast_alert = useToast()


  const success_toast = () => {

    toast_alert({
      title: 'Account created.',
      description: "We've created your account for you.",
      status: 'success',
      duration: 9000,
      isClosable: true,
  })
  } 


  const error_toast = () => {

    toast_alert({
      
      title: 'Can"t Create Account.',
      description: "Fill the All Fields.",
      isClosable: true,
      status: 'error',
      duration: 9000
    })
  }

  //const [downloadurl, setDownloadUrl] = useState("")

    //useEffect(() => {

        //const image_ref = ref(firebase_storage, `assets/Img-01.png`)


        //getDownloadURL(image_ref)

          //.then((url) => {
            //setDownloadUrl(url)
            
        //})
    //},[])


  
  
    return(

        <div className="main-area-1">

           <div className="main-area-2">

                
            

                <div className="img">
                  <img src={"https://dpfydaomjpydlfrlpsia.supabase.co/storage/v1/object/public/assets/Img-01.png"} alt="" width="550px" />

                </div>
             
                

                <div>

                    <div className="forms-area">
                      <h1>Get Started</h1>
                      <h3>Already Have an account ? <Link className="link" to="/signin">Login</Link></h3>

                  <div>
                      <div className="first-fields">

                        <div>
                          <Input className="firstname" onChange={(e) => dispatch({type: "GET_FIRST_INPUT" , usernames: e.target.value})} placeholder="First Name" width="120px"></Input>

                        </div>

                        <div>
                          <Input className="lastname" onChange={(e) => dispatch({type: "GET_SECOND_INPUT",  usernames: e.target.value})} placeholder="Last Name" width="120px"></Input>

                        </div>
                      </div>

                       <div>
                          <Input className="email-signup" onChange={(e) => setEmail(e.target.value) } placeholder="Email" width="280px"></Input>
                       </div>

                       <div>
    <div className="password-field-container">
        <Input
            className="password-signup"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={user_password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
            type="button"
        >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
        </button>
    </div>
</div>


                       <div>
                          <Button className="signup-btn" onClick={Sign_up_process} loadingText="Creating"  spinnerPlacement="start" backgroundColor="#3BC191" width="280px" >Create account</Button>

                          
                       </div>
                      </div>
                    </div>
                    
                </div>
            </div>
                           
            
        </div>
    )
}


export default Signup