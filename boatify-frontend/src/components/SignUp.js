import UserForm from './UserForm';
import useSessionRedirect from '../hooks/useSessionRedirect';

const SignUp = () => {
    useSessionRedirect(true);

    return (
        <div>
            <UserForm isSignUp={true} />
        </div>
    );
};

export default SignUp;
