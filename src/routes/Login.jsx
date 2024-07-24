import { useNavigate, Navigate } from 'react-router-dom';
import '../assets/styles/login.css'
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../auth/constants'
import { useState } from 'react';

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const auth = useAuth();
    const goTo = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });

            if (response.ok) {
                const json = await response.json();
                console.log(json);
                auth.setUser();
                goTo("/menu");

            } else {
                const json = await response.json();
                // toast.error(json.message);

            }

        } catch (error) {
            console.log('Error: ', error);
        }

    }

    return (
        <>
            <div className="container" onSubmit={handleSubmit}>
                <form className="form">
                    <h1 className="title_form">MongoAnalyzer</h1>
                    <input
                        className="input"
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        className="input"
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='button'>
                        Entrar
                    </button>
                </form>
            </div>
        </>
    )
}

export default Login;