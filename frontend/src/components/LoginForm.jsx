// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const LoginForm = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/admin/signin",
//         {
//           email,
//           password,
//         }
//       );
//       if (response.status === 200) {
//         const { token, message, role } = response.data;
//         setSuccess(message);
//         setEmail("");
//         setPassword("");

//         localStorage.setItem("token", token);
//         localStorage.setItem("role", role);

//         console.log("role-----------", role);
//         console.log("token-----------", token);

//         setTimeout(() => {
//           if (role === "admin") {
//             navigate("/admin-tasks"); // Redirect to admin task page
//           } else if (role === "user") {
//             navigate("/user-tasks"); // Redirect to user task page
//           } else {
//             navigate("/dashboard"); // Default fallback
//           }
//         }, 100);
//       } else {
//         setError(response.data.message || "Unexpected error occurred.");
//       }
//       console.log(response.data);
//     } catch (error) {
//       if (error.response) {
//         setError(error.response.data.message);
//       } else {
//         setError("Network error or server not reachable.");
//       }
//     }
//   };
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
//         <form onSubmit={handleSubmit}>
//           {success && (
//             <div className="mb-4 text-green-600 bg-green-100 p-2 rounded text-center">
//               {success}
//             </div>
//           )}
//           {error && (
//             <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
//               {error}
//             </div>
//           )}

//           <div className="mb-4">
//             <label className="block text-gray-700 text-left mb-2">Email</label>
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-left mb-2">
//               Password
//             </label>
//             <input
//               type="Password"
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Password"
//               required
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
//           >
//             login
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/signin",
        {
          email,
          password,
        }
      );
      if (response.status === 200) {
        const { token, message, role, userId } = response.data;
        setSuccess(message);
        setEmail("");
        setPassword("");

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        localStorage.setItem("userId", userId); // Store userId

        console.log("role-----------", role);
        console.log("token-----------", token);
        console.log("userId---- login-------", userId); // Debugging log

        // Route mapping based on the role
        const roleRoutes = {
          admin: "/admin-tasks",
          user: "/user-tasks",
        };

        setTimeout(() => {
          navigate(roleRoutes[role] || "/dashboard"); // Default to dashboard if no match
        }, 100);
      } else {
        setError(response.data.message || "Unexpected error occurred.");
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      } else {
        setError("Network error or server not reachable.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit}>
          {success && (
            <div className="mb-4 text-green-600 bg-green-100 p-2 rounded text-center">
              {success}
            </div>
          )}
          {error && (
            <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-left mb-2">Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-left mb-2">
              Password
            </label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
