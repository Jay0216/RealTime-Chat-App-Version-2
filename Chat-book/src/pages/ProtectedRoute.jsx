// ProtectedRoute.jsx
//import { useEffect, useState } from "react"
//import { Navigate } from "react-router-dom"
//import { getAuth, onAuthStateChanged } from "firebase/auth"
//import { firebase_services } from "../utils/FirebaseServices" // adjust path as needed

//const ProtectedRoute = ({ children }) => {
 // const [user, setUser] = useState(null)
 // const [loading, setLoading] = useState(true)

 // useEffect(() => {
    //const auth = getAuth(firebase_services)
   // const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
     // setUser(currentUser)
     // setLoading(false)
    //})

    //return () => unsubscribe()
  //}, [])

  //if (loading) return null // or a spinner

 // return user ? children : <Navigate to="/" />
//}

//export default ProtectedRoute


// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { getActiveUser } from "../utils/Session";

const ProtectedRoute = ({ children }) => {
  const user = getActiveUser(); // only checks sessionStorage

  return user ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
