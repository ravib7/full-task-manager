"use client"
import { useSendOtpMutation, useSigninMutation, useVerifyOtpMutation } from '@/redux/apis/auth.api'
import { SEND_OTP_REQUEST, SIGNIN_REQUEST, VERIFY_OTP_REQUEST } from '@/types/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const Login = () => {

    const [showLoginWithOtp, setShowLoginWithOtp] = useState(false)

    const [signin, { isLoading }] = useSigninMutation()
    const router = useRouter()

    const loginSchema = z.object({
        email: z.string().min(1).email(),
        password: z.string().min(1),
    }) satisfies z.ZodType<SIGNIN_REQUEST>

    const { handleSubmit, register, reset, formState: { errors, touchedFields } } = useForm<SIGNIN_REQUEST>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(loginSchema)
    })

    const handleLogin = async (data: SIGNIN_REQUEST) => {
        try {
            const { result } = await signin(data).unwrap()
            toast.success("Login success")
            reset()
            console.log(result)

            if (result.role === "admin") {
                router.push("/admin")
                router.refresh()
            } else {
                router.push("/employee")
                router.refresh()
            }
        } catch (error) {
            console.log(error)
            toast.error("unable to login")
        }
    }

    const handleClasses = (key: keyof SIGNIN_REQUEST) => clsx({
        "form-control my-2": true,
        "is-invalid": errors[key],
        "is-valid": touchedFields[key] && !errors[key],
    })

    return <>
        <div className="container">
            <div className="row">
                <div className="col-sm-6 offset-sm-3">
                    <div className="card">
                        <div className="card-header">Login</div>
                        <div className="card-body">
                            {
                                showLoginWithOtp
                                    ? <LoginWithOTP />
                                    : <form onSubmit={handleSubmit(handleLogin)}>
                                        <div>
                                            <input
                                                {...register("email")}
                                                type="email"
                                                placeholder='email@example.com'
                                                className={handleClasses("email")} />
                                            <div className="invalid-feedback">{errors && errors.email?.message}</div>
                                        </div>
                                        <div>
                                            <input
                                                {...register("password")}
                                                type="password"
                                                placeholder='************'
                                                className={handleClasses("password")} />
                                            <div className="invalid-feedback">{errors && errors.password?.message}</div>
                                        </div>
                                        <button disabled={isLoading} className='btn btn-lg btn-primary mt-2 w-100'>
                                            {
                                                isLoading
                                                    ? <span className='spinner spinner-border'></span>
                                                    : "Login"
                                            }
                                        </button>
                                    </form>
                            }

                            <hr />

                            <div className='d-flex justify-justify-content-between'>
                                {
                                    showLoginWithOtp
                                        ? <button onClick={e => setShowLoginWithOtp(false)} className="btn btn-link">Login With Email/Password</button>
                                        : <button onClick={e => setShowLoginWithOtp(true)} className="btn btn-link">Login With OTP</button>
                                }
                                <button className="btn btn-link">Forget Password</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}

const LoginWithOTP = () => {

    const [showotp, setShowotp] = useState(false)
    const router = useRouter()

    const [sendotp, { isSuccess }] = useSendOtpMutation()
    const [verifyotp] = useVerifyOtpMutation()

    const loginSchema = z.object({
        username: z.string().min(1),
        otp: z.string(),
    }) satisfies z.ZodType<SEND_OTP_REQUEST>

    const { handleSubmit, register, reset, formState: { errors, touchedFields } } = useForm<SEND_OTP_REQUEST>({
        defaultValues: {
            username: "",
            otp: "",
        },
        resolver: zodResolver(loginSchema)
    })

    const handleSendOtp = async (data: SEND_OTP_REQUEST) => {
        try {
            await sendotp(data).unwrap()
            toast.success("otp send sucess")
            setShowotp(true)
        } catch (error) {
            console.log(error)
            toast.error("unable to send otp")
        }
    }

    const handleVerifyOtp = async (data: VERIFY_OTP_REQUEST) => {
        try {
            const { result } = await verifyotp(data).unwrap()
            toast.success("otp verify sucess")

            if (result.role === "admin") {
                router.push("/admin")
                router.refresh()
            } else {
                router.push("/employee")
                router.refresh()
            }

        } catch (error) {
            console.log(error)
            toast.error("unable to send otp")
        }
    }

    const handleOTP = (data: SEND_OTP_REQUEST) => {
        if (showotp) {
            handleVerifyOtp(data)
        } else {
            handleSendOtp(data)
        }
    }

    return <>
        <form onSubmit={handleSubmit(handleOTP)}>
            {
                showotp
                    ? <div>
                        <input {...register("otp")} type="text" className="form-control my-2" placeholder='Enter Your OTP' />
                        <button type="submit" className="btn btn-primary w-100 btn-lg">Verify OTP</button>
                    </div>
                    : <div>
                        <input {...register("username")} type="text" className="form-control my-2" placeholder='Enter Your Email/Mobile' />
                        <button type="submit" className="btn btn-primary w-100 btn-lg">Send OTP</button>
                    </div>
            }

        </form>
    </>
}

export default Login