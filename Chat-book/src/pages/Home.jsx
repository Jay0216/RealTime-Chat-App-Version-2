import { Button } from "@chakra-ui/react"
import "./Home.css"
import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { getDownloadURL, getStorage, ref } from "firebase/storage"



const Home = () => {

    const firebase_storage = getStorage()


    const [width, setWidth] = useState(window.innerWidth)

    const handle_width = () => {

        setWidth(window.innerWidth)
    }



    useEffect(() => {
        window.addEventListener('resize', handle_width)
    }, [])

    const btnsClass = useRef(null)



    const home_menu_open = () => {

        const btn_class = btnsClass.current
        btn_class.style.right = "0"
        

    }

    //const [downloadurl, setDownloadUrl] = useState("")

    //useEffect(() => {

        //const image_ref = ref(firebase_storage, `assets/Img-04.png`)


        //getDownloadURL(image_ref)

          //.then((url) => {
            //setDownloadUrl(url)
            
        //})
    //},[])



    
    return(

        <div className="main-home">

                   
            
            <div className="navbar">

            
            
                <div className="logo">

                    
                    <a href="">FriendSquare</a>

                    
                </div>
                <div className="menu-btn-area">

                    {width < 600 ? 
                    
                    <svg className="menu-icon-1" onClick={home_menu_open}  width="28" height="28" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                     
                     <path d="M56.6667 51C57.3888 51.0008 58.0834 51.2773 58.6085 51.7731C59.1337 52.2688 59.4497 52.9464 59.492 53.6673C59.5343 54.3882 59.2998 55.0981 58.8363 55.6519C58.3727 56.2057 57.7153 56.5616 56.9982 56.6468L56.6667 56.6667H11.3333C10.6112 56.6659 9.91658 56.3894 9.39146 55.8936C8.86634 55.3979 8.55033 54.7203 8.50801 53.9994C8.46569 53.2785 8.70024 52.5686 9.16375 52.0148C9.62726 51.461 10.2847 51.1051 11.0018 51.0198L11.3333 51H56.6667ZM56.6667 31.1667C57.4181 31.1667 58.1388 31.4652 58.6701 31.9965C59.2015 32.5279 59.5 33.2486 59.5 34C59.5 34.7515 59.2015 35.4721 58.6701 36.0035C58.1388 36.5348 57.4181 36.8333 56.6667 36.8333H11.3333C10.5819 36.8333 9.86122 36.5348 9.32986 36.0035C8.79851 35.4721 8.5 34.7515 8.5 34C8.5 33.2486 8.79851 32.5279 9.32986 31.9965C9.86122 31.4652 10.5819 31.1667 11.3333 31.1667H56.6667ZM56.6667 11.3333C57.4181 11.3333 58.1388 11.6319 58.6701 12.1632C59.2015 12.6946 59.5 13.4152 59.5 14.1667C59.5 14.9181 59.2015 15.6388 58.6701 16.1701C58.1388 16.7015 57.4181 17 56.6667 17H11.3333C10.5819 17 9.86122 16.7015 9.32986 16.1701C8.79851 15.6388 8.5 14.9181 8.5 14.1667C8.5 13.4152 8.79851 12.6946 9.32986 12.1632C9.86122 11.6319 10.5819 11.3333 11.3333 11.3333H56.6667Z" fill="white"/>
                     
                    </svg> : null}

                </div>

                

                    

                <div ref={btnsClass} className="btns">

                    

                  
                <Link to="/signin"><Button className="login-btn">Login</Button></Link>

                  

                  
                <Link to="/signup"><Button className="signup-btn-1" backgroundColor="green.600">Signup</Button></Link>
                  
                </div>
                
            </div>

            


            <div className="content-row">

                <div className="content">

                    <h1><span>Chat with friends</span>, Share Your Ideas, Share<br></br> your expiriences.</h1>

                    <Button className="seemore-btn" backgroundColor="green.600">See more</Button>
                </div>

                <div className="content-img">
                    <img src={"https://dpfydaomjpydlfrlpsia.supabase.co/storage/v1/object/public/assets/Img-04.png"} alt="" width="500px"/>
                    
                </div>


                


            </div>
        </div>
    )
}





export default Home