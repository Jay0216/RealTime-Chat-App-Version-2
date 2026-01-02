import { useState, useEffect } from "react";
import "./setAccount.css"
import {  Button, Image, Input, useToast } from "@chakra-ui/react";
import { addDoc, collection, doc, getFirestore, updateDoc } from "firebase/firestore"
import { firebase_services } from "../utils/FirebaseServices";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../utils/SuperBaseServices";


const Account = () => {


  let [step_count, setStepCount] = useState(1)

    
  const [image, setImage] = useState("")
  const [image_url, setImageUrl] = useState("")
  const [first_step, setFirst] = useState(false)

  const [username, setUserName] = useState("")
  const [nickname, setNickName] = useState("")
  const [second_step, setSecond] = useState(false)


  const [download_url, setDownloadUrl] = useState("")

  const firebase_storage = getStorage()




  const get_profile_picture = (e) => {


    const file_types = ["image/jpeg", "image/jpg"]

    if(!file_types.includes(e.target.files[0].type)){
      alert("Please Insert Jpeg or Jpg Files")
      location.reload()
    }else{

      setImageUrl(URL.createObjectURL(e.target.files[0]))
      setImage(e.target.files[0])
      setFirst(true)
      


    }
    
    

  }

  const [progress, setProgress] = useState("0%")
  const [progress_value, setProgressValue] = useState(0)
  const [button_status, setButtonStatus] = useState("Upload")

  // Upload to Supabase Storage
  const upload_profile_picture = async () => {
  if (!image) return alert("Please select an image")

  setProgress("Uploading...")
  setButtonStatus("Uploading...")

  const bucketName = "profileimages";

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(image.name, image, { upsert: true });

    if (error) throw error;

    const { data: urlData } = supabase.storage
     .from(bucketName)
     .getPublicUrl(image.name);

    setDownloadUrl(urlData.publicUrl)
    setProgress("Added")
    setProgressValue(100)
    setButtonStatus("Next")
  } catch (err) {
    console.error("Upload failed:", err)
    setProgress("Upload failed")
    setButtonStatus("Retry")
  }
}


  

  

  

  useEffect(() => {


    if(download_url != ""){
      console.log(download_url)
      setProgress("Added")
      setButtonStatus("Next")
    }
  }, [download_url])


  const get_username = (e) => {

    setUserName(e.target.value)
    setSecond(true)

  }

  const get_nickname = (e) => {

    setNickName(e.target.value)
    setSecond(true)
  }

  const check_first_step = () => {


    if(first_step && progress_value == 100){
      
      setStepCount(2)
    }
  }


  const add_profile_image = () => {


    if(image_url == ""){
      alert("Please insert a Image")
    }
    else{
      upload_profile_picture()
      check_first_step()
    }

    
  }

  const check_second_step = () => {

    if(second_step){
      setStepCount(3)
    }
  }

  const add_userdetails = () => {

    if(username == "" || nickname == ""){
      alert("Please Fill Input Fields..")
    }else{

      
      check_second_step()
      
    }

  }

  const toast_alert = useToast()


  const success_toast = () => {

    toast_alert({
      title: 'Profile Settings Done.',
      description: "We've setting up your Profile.",
      status: 'success',
      duration: 9000,
      isClosable: true,
  })
  } 

  const error_toast = () => {

    toast_alert({
      
      title: 'Can"t Setting Up Your Profile',
      description: "Something went wrong",
      isClosable: true,
      status: 'error',
      duration: 9000
    })
  }


  const Db_connection = getFirestore(firebase_services)


  
  const user_props_location = useLocation()
  const user_props = user_props_location.state


  const navigation_to_login = useNavigate()



  const profile_submit = async () => {

    try{

      const Profile_details = await addDoc(collection(Db_connection, "accountDetails"), {

        Firstname: user_props.firstname,
        Lastname: user_props.lastname,
        image_url: download_url,
        nickname: nickname,
        username: username,
        email: user_props.email,
        
      })

      console.log(Profile_details.id)
      success_toast()

      navigation_to_login("/signin")


    }catch(e){

      console.log(e)
      error_toast()
    }






  }



  
    return(
 
     <div className="main-cls">
 
 
       <div className="main-content">
 
       <div className="title">
         <h1>Setting up Your Account..</h1>
       </div>
 
       <div className="component">

          {step_count == 1 ? 
          
          <div className="upload-main">

            <div className="main-area">

               <h1 className="step-title">1. Set up Profile Picture</h1>
               


           <div className="image-upload-area">
             <Image className="upload-img" src={image_url} borderRadius="full" border="1px"/>
           </div>


            <div className="input-area">

              <input onChange={get_profile_picture} type="file" name="file" />

              
              <Button backgroundColor="green.600" onClick={add_profile_image}>{button_status}</Button> 

              
              
            </div>

             <progress value={progress_value} max="100"></progress>
             <h3>{`${progress_value} %`}</h3>
           </div>

         </div>
          
        : null}

          

        { first_step === true && step_count == 2 ? 
          
          
          
             <div className="main-area">
               <h1 className="step-title">2. User Details</h1>

             <div className="input-areas">
              <div className="username-area input-area">
               <label htmlFor="username">Username</label>
               <Input
                id="username"
                onChange={get_username}
                className="username"
                type="text"
                placeholder="Provide a Username"
               />
             </div>

             <div className="nickname-area input-area">
               <label htmlFor="nickname">Nickname</label>
               <Input
                id="nickname"
                onChange={get_nickname}
                className="username"
                type="text"
                placeholder="Provide a Nickname"
                />
             </div>

             <div className="add-btn-2">
               <Button backgroundColor="green.600" onClick={add_userdetails}>
                  Add
               </Button>
             </div>
           </div>
         </div>             
    
        : null }


        { second_step === true && step_count == 3 ? 
        
          <div className="main-area">


            <h1 className="step-title">3. Finish up Your Account.</h1>



            <div className="tasks-done">

              <h2>1. Profile Picture Uploaded.</h2>
              <h2>2. Username and Nickname Added.</h2>
              <h2>3. Finish Your Account.</h2>
            </div>

            <div className="submit-btn">

              <Button backgroundColor="green.600" marginTop="50px" onClick={profile_submit} >Submit</Button>
             </div>
           </div> 
        
         : null}
          
         </div>



       


           
     
 
 
       
 
       <div className="step-counter">
 
         <h3>{step_count}/3</h3>
       </div>
 
 
 
 
       </div>
     </div>
    )
   
 
   
 }
 
 
 export default Account