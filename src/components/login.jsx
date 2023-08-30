import { GoogleLogin } from 'react-google-login';

const clientId =
  '1031338802217-9qjuctk4fugp5r9k5ldip4v4brmfre7o.apps.googleusercontent.com';

const Login = () => {
  const onSuccess = (res) => {
    console.log('Login Success! Current User : ', res.profileObj);
  };

  const onFailure = (res) => {
    console.log('Login failed : ', res);
  };

  return (
    <div>
      <GoogleLogin
        clientId={clientId}
        buttonText="Login With Google"
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy={'single_host_origin'}
        isSignedIn={true}
      />
    </div>
  );
};

export default Login;
