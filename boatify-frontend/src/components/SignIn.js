import UserForm from './UserForm';
import useSessionRedirect from '../hooks/useSessionRedirect';

const SignIn = () => {
    useSessionRedirect(true);

    return (
        <div>
            <UserForm isSignUp={false} />
        </div>
    );
};

export default SignIn;
