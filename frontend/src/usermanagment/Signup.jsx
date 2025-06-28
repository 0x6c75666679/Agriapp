import { useState } from "react";
import toast from "react-hot-toast";
import { createUserAPI } from "../api/api";
import agriImage from "../assets/image_login_signup.png";
import bgImage from "../assets/background_image.png";

function Register(){


  const validatePassword = (password) => {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  };
  
  const [formData,setFormData] = useState({
    username:"",
    email: "",
    password: "",
    confirm_password : ""
  })
  const handleChange = (e) =>{
      setFormData({...formData,[e.target.name]:e.target.value})
  }

  const submit  = async () => {
    if(formData.email === "" || formData.username === "" | formData.password === ""){
      return toast.error("please enter all field");
    }
    if (!validatePassword(formData.password)){
      return toast.error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number");
    }
    if(formData.password !== formData.confirm_password){
      return toast.error("The Password is not equal to confrm password")
    }
    try{
      const response = await createUserAPI(formData)
      console.log(response)
      if (response.data.success){
        toast.success(`thank you for your registration ${formData.username}\n your email is ${formData.email}\n`);
        console.log(response.data.message)
        console.log("WHy is it no poping up")

      } else {
        return toast.error('error: '+ response.data.message);
      }
   } catch (error){
     return toast.error('something went wrong!'+ error);
    }
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-green-100 relative overflow-hidden">
      {/* Blurred background image */}
      <img src={bgImage} alt="Background" className="absolute inset-0 w-full h-full object-cover z-0 blur-md opacity-60" />
      {/* Elevated ground/card for both sides with hover/focus effect */}
      <div tabIndex={0} className="flex w-full max-w-4xl min-h-[70vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 m-2 relative z-10 transition-all duration-300 focus-within:shadow-green-300 focus-within:scale-[1.015] hover:shadow-green-300 hover:scale-[1.015] outline-none group">
        {/* Left: Green background, titles, form */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-8 bg-green-100">
          <div className="w-full max-w-sm">
            <h2 className="text-3xl md:text-4xl font-extrabold text-green-800 mb-2 text-center">AGRI APP</h2>
            <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-8 text-center">Sign Up</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="space-y-5"
            >
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-3 border border-green-200 rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-300 placeholder-brown-400 hover:ring-2 hover:ring-green-300"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full p-3 border border-green-200 rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-300 placeholder-brown-400 hover:ring-2 hover:ring-green-300"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border border-green-200 rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-300 placeholder-brown-400 hover:ring-2 hover:ring-green-300"
              />
              <input
                type="password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full p-3 border border-green-200 rounded-md bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 focus:bg-white transition-all duration-300 placeholder-brown-400 hover:ring-2 hover:ring-green-300"
              />
              <button
                type="submit"
                className="w-full py-3 bg-green-800 text-white font-bold text-lg rounded-md shadow-md hover:bg-green-900 transition-all duration-300 mt-2 tracking-wide transform hover:scale-105 focus:scale-105 focus:outline-none"
              >
                Sign Up
              </button>
              <div className="flex justify-center mt-4">
                <span className="text-green-700 text-sm">Have an account?</span>
                <a href="/login" className="ml-2 text-green-900 font-semibold hover:underline">Log In</a>
              </div>
            </form>
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="hidden md:block w-px bg-green-300 h-5/6 my-auto"></div>
        {/* Right: Agriculture Image with NO hover effect */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-green-300">
          <img src={agriImage} alt="Agriculture" className="h-full max-h-[60vh] w-auto object-contain" />
        </div>
      </div>
    </div>
  )

}

export default Register