import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import Login from './auth/login';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <meta name="description" content="Welcome to our application!" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="flex flex-col items-center p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {auth.user ? (
                    <Link
                        href={route('dashboard')}
                        className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                    >
                        Dashboard
                    </Link>
                ) : (
                    <>
                        <Login canResetPassword={true} />
                    </>
                )}
            </div>
        </>
    );
}
