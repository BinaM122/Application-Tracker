import { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import {auth} from "../auth/firebase"



const  LoginPage = () => {
    const navigate = useNavigate()

    const handleGoogleLogin = async () => {
        try {
             var provider = new GoogleAuthProvider();
                const result = await signInWithPopup(auth,provider)
                const user = result.user
                navigate('/dashboard')
                


        } catch (error) {
            console.error(error)
        }
    }

    const handleGitHubLogin = async () => {
        try {
    var provider = new GithubAuthProvider()
    const result = await signInWithPopup(auth, provider)
    navigate('/dashboard')
} catch (error) {
    console.error(error)
}

    }





    return (
        <div>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
        <button onClick={handleGitHubLogin}>Sign in with Github</button>
            
        </div>
    )
}










export default LoginPage
