import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form"
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { LoginRequest } from "../models/dto/LoginRequest";
import { AuthService } from "../services/AuthService";
import { URLS } from "../navigation/CONSTANTS";
import { useAuth } from "../hooks/useAuth";
import {useAppSelector } from "../redux/hooks";

type Inputs = {
  username: string;
  password: string;
};

export const LoginForm = () => {
  const navigate = useNavigate();
  const { doLogin } = useAuth()
  const [formData, setFormData] = useState<Inputs>({
    username: "",
    password: "",
  });
  const email = useAppSelector((state) => state.auth.email);
  const is_staff = useAppSelector((state) => state.auth.is_staff);
  
  useEffect(() => {
    if (email) {
      if (is_staff) {
        navigate(URLS.ADMIN);
      }else{
      navigate(URLS.HOME);
    }
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
    const login: LoginRequest = {
      username: data.username,
      password: data.password,
    };
    new AuthService().login(login.username, login.password).then((response) => {
      console.log("Login successful", response);
      doLogin({
                    access_token: response.access,
                    refresh_token: response.refresh,
                    email: login.username,
                });
      navigate(URLS.HOME);
    }).catch((error) => {
      console.error("Login failed", error);
      alert("Error en el inicio de sesión. Verifica tus credenciales.");
    });
  };

  const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/30">
            <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-lg transition-transform duration-300 transform hover:scale-[1.02]">
        <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
          Login
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="username"
              {...register("username", { required: true })}
              name="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.username ? "border-destructive" : "border-input"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-transparent peer placeholder-transparent`}
              placeholder="Username"
              aria-label="Username"
            />
            <label
              htmlFor="username"
              className="absolute left-4 -top-2.5 bg-card px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-sm text-accent"
            >
              Username
            </label>
            {errors.username && (
              <p className="mt-1 text-sm text-destructive">Este campo es requerido</p>
            )}
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              {...register("password", { required: true })}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-2 border ${
                errors.password ? "border-destructive" : "border-input"
              } rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-transparent peer placeholder-transparent pr-10`}
              placeholder="Password"
              aria-label="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-2.5 bg-card px-1 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-focus:-top-2.5 peer-focus:text-sm text-accent"
            >
              Password
            </label>
            {errors.password && (
              <p className="mt-1 text-sm text-destructive">Este campo es requerido</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-sm text-center text-accent">
            No tienes una cuenta?{" "}
            <a href="/register" className="text-primary hover:underline">
              Registrate
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

