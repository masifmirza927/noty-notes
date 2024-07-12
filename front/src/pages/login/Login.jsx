import { useForm } from "react-hook-form";

const Login = () => {

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  return (
    <div id='login' className='login-page'>
      <div className='login-form p-10'>
        <h1 className='text-center text-3xl font-bold my-3 mb-10'>login form</h1>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
          <div className="mb-10">
            <input type='text' {...register('username', {
              required: {
                value: true,
                message: "Username name field is required."
              }
            })} className='w-full p-5 rounded-md bg-transparent border text-white' placeholder='Email address' />

            {
              errors.username && <p className="text-red-600 my-3 bg-gray-50 p-2">
                <span>{errors.username.message}</span>
              </p>
            }
          </div>

          <input type='password' {...register('password', {
            required: {
              value: true,
              message: "Password field is required"
            }
          })} placeholder='Password' className='w-full p-5 mb-3 rounded-md bg-transparent border text-white' />


          {
            errors.password && <p className="text-red-600 my-3 bg-gray-50 p-2">
              <span>{errors.password.message}</span>
            </p>
          }

          <button className='w-full p-5 mb-3 rounded-md bg-gray-900 text-white border-0 text-xl mt-3 hover:bg-gray-800'>Login to noty</button>
        </form>
      </div>
    </div>
  )
}

export default Login