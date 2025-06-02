import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginUser, logoutUser } from "../redux/slices/authSlice";
import { AuthService } from "../services/AuthService";
import { useNavigate } from "react-router";
type LoginParams = {
  access_token: string;
  refresh_token: string;
  email: string;
};
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.auth.email);
  const doLogin = (params: LoginParams) => {
    dispatch(
      loginUser({
        email: params.email,
      })
    );
  };
  const doLogout = () => {
    new AuthService()
      .logout()
      .then(() => {
        dispatch(logoutUser());
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error al cerrar sesión: ", error);
      });
  };
  useEffect(() => {
    new AuthService().me().then((response) => {
      if (response.email) {
        console.log("User is logged in with email:", response.email);
        dispatch(
          loginUser({
            email: response.email,
            is_staff: response.is_staff,
            first_name: response.first_name,
            last_name: response.last_name,
          })
        );
      }
    });
  }, []);

  return { email, doLogin, doLogout };
};
