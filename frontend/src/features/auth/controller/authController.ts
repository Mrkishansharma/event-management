import toast from "react-hot-toast";
import { ApiService } from "../../../services/apiService";
import { appToast } from "../../../utils/utils";
import { RegisterUserType } from "../authTypes";
import { BASE_URL } from "../../../App";

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const registerUser = async ({ name, email, password, confirmPassword }: RegisterUserType, e: React.FormEvent<HTMLFormElement>) => {
  try {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
       toast.error('fill all the required fields!');
       return false
    }

    if (!emailRegex.test(email)) {
       toast.error('enter valid email!');
       return false
    }

    if (password !== confirmPassword) {
       toast.error('password and confirm password should be same!');
       return false
    }

    const response = await ApiService.postRestCall(`${BASE_URL}/auth/register`, { name, email, password });
    const data: any = response.data;
    console.log(data);
    if (data.error) {
      appToast(data.message || 'something went wrong! try again', 'error');
      //   localStorage.setItem('auth-token', );
      return data;
    }
    appToast(data.message, 'success');


    return data;
  } catch (error: any) {
    appToast(error.message, 'error');
    return false
  }
}

export { registerUser };