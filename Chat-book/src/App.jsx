import { ChakraProvider } from "@chakra-ui/react"
import Signup from "./pages/Signup"
import Home from "./pages/Home"
import Signin from "./pages/Signin"
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from "react-router-dom"
import ChatArea from "./pages/Chat"
import Account from "./pages/Accout"
import Profile from "./pages/Profile"
import ProtectedRoute from "./pages/ProtectedRoute"


function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      
         <Route>
           <Route path="/" element={ <Home/> }/>
           <Route path="/signup" element={ <Signup/> }/>
           <Route path="/signin" element={ <Signin/> }/>
           <Route path="/chat" element={ <ChatArea/> }/>
           <Route path="/account" element={ <Account/> }/>

            <Route
             path="/profile"
             element={
             <ProtectedRoute>
               <Profile />
             </ProtectedRoute>
            }
            />
           
          </Route>
        
       
    )
  )

  return (
    <>
      <ChakraProvider>
          <RouterProvider router={router}/>

    </ChakraProvider>
    </>
  )
}

export default App
