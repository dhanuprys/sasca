'use client';

import axios, { AxiosError } from 'axios';
import { Formik, Form, Field } from 'formik';
import { useRouter } from 'next/navigation';
import { mutate } from 'swr';
import ApplicationTestingBanner from './common/ApplicationTestingBanner';
import { useCallback, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

function LoginCard() {
    const router = useRouter();
    const [loginSuccess, setLoginSuccess] = useState(false);
    const loginUser = useCallback((username: string, password: string) => {
        return axios.post('/api/v1/auth/login', {
            username,
            password
        });
    }, []);

    if (loginSuccess) {
        return (
            <div className="p-4 rounded-2xl border mt-7 bg-white flex justify-center items-center min-h-[200px]">
                <AiOutlineLoading3Quarters className="text-8xl animate-spin text-slate-500" />
            </div>
        )
    }

    return (
        <div className="mt-7 bg-white border border-gray-200 rounded-xl shadow-xl dark:bg-neutral-900 dark:border-neutral-700">
            <div className="py-12 px-4 sm:p-7">
                <div className="text-center">
                    <h1 className="block text-3xl font-bold text-gray-800 dark:text-white">Selamat Datang</h1>
                    <p className="text-slate-400 py-3 text-sm">Halo, harap untuk mengisi informasi dengan benar</p>
                </div>

                <div className="mt-5">
                    <Formik
                        initialValues={{ username: '', password: '' }}
                        onSubmit={async ({ username, password }, { setSubmitting, setErrors }) => {
                            let loginResponse = null;

                            try {
                                loginResponse = await loginUser(username, password);

                                if (loginResponse.status === 200) {
                                    setLoginSuccess(true);
                                    await mutate('/api/v1/me');
                                    
                                    setTimeout(() => {
                                        router.replace('/student/home');
                                    }, 1000);
                                }
                            } catch (error) {
                                if (error && axios.isAxiosError(error)) {
                                    setErrors({
                                        username: 'Akun tidak dapat ditemukan'
                                    });
                                } else {
                                    setErrors({
                                        username: 'Server tidak dapat dijangkau'
                                    });
                                }

                                setSubmitting(false);
                            }
                        }}>
                        {({ isSubmitting, errors, touched }) => (
                            <Form>
                                {
                                    errors.username 
                                    && touched.username 
                                    && <p className="text-sm text-center text-red-600 my-2">{errors.username}</p>
                                }
                                <div className="grid gap-y-4">
                                    {/* <!-- Form Group --> */}
                                    <div>
                                        <label htmlFor="username-input" className="block text-sm mb-2 dark:text-white font-semibold">Username</label>
                                        <div className="relative">
                                            <Field type="text" id="username-input" placeholder="21693" name="username" className="py-3 px-4 block w-full border-2 bg-slate-100 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required aria-describedby="email-error" />
                                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Form Group --> */}

                                    {/* <!-- Form Group --> */}
                                    <div>
                                        <div className="flex justify-between items-center">
                                            <label htmlFor="password-input" className="block text-sm mb-2 dark:text-white font-semibold">Password</label>
                                            {/* <a className="text-sm text-blue-600 decoration-2 hover:underline font-medium" href="../examples/html/recover-account.html">Forgot password?</a> */}
                                        </div>
                                        <div className="relative">
                                            <Field type="text" id="password-input" placeholder="0056530862" name="password" className="py-3 px-4 block w-full border-2 bg-slate-100 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" required aria-describedby="email-error" />
                                            <div className="hidden absolute inset-y-0 end-0 pointer-events-none pe-3">
                                                <svg className="size-5 text-red-500" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <p className="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                                    </div>
                                    {/* <!-- End Form Group --> */}

                                    {/* <!-- Checkbox --> */}
                                    {/* <div className="flex items-center">
                                        <div className="flex">
                                            <input id="remember-me" name="remember-me" type="checkbox" className="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-neutral-800 dark:border-neutral-700 dark:checked:bg-blue-500 dark:checked:border-blue-500 dark:focus:ring-offset-gray-800" />
                                        </div>
                                        <div className="ms-3">
                                            <label htmlFor="remember-me" className="text-sm dark:text-white">Remember me</label>
                                        </div>
                                    </div> */}
                                    {/* <!-- End Checkbox --> */}

                                    <button disabled={isSubmitting} type="submit" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none">
                                        Masuk
                                    </button>
                                </div>
                            </Form>)}
                    </Formik>
                    {/* <!-- End Form --> */}
                </div>

                <div className="mt-5">
                    <ApplicationTestingBanner />
                </div>
            </div>
        </div >
    );
}

export default LoginCard;