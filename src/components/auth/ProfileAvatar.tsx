"use client"

import React from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { usePrivy, useLogin } from '@privy-io/react-auth';
import Link from 'next/link';
import { Wallet } from 'lucide-react';
import iconLogo from '../../../public/agora.png'
import Image from 'next/image';
import createUser from '@/utils/createUser';
import Swal from 'sweetalert2';

function ProfileAvatar() {
    const { authenticated, logout, ready } = usePrivy();
    const { login } = useLogin({
        onComplete: async (user, isNewUser, wasAlreadyAuthenticated, loginMethod) => {
            if (isNewUser) {
                // Show loading Swal
                Swal.fire({
                    title: 'Creating user...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                try {
                    // Call createUser function for new users
                    await createUser(user);

                    // Show success Swal
                    Swal.fire({
                        icon: 'success',
                        title: 'User created successfully!',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        // Trigger component update or redirect
                        window.location.reload();
                    });
                } catch (error) {
                    // Show error Swal
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to create user. Please try again.'
                    });
                }
            }
        },
        onError: (error) => {
            console.log(error);
            // Show error Swal
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Login failed. Please try again.'
            });
        },
    });

    // Disable login when Privy is not ready or the user is already authenticated
    const disableLogin = !ready || (ready && authenticated);

    return (
        <>
            {authenticated ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="rounded-full">
                            <Image
                                src={iconLogo}
                                alt="Company Logo"
                                width={36}
                                height={36}
                                className='cursor-pointer'
                            />
                            <span className="sr-only">Toggle user menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href='/agora/me' className='cursor-pointer'>My Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><a href="#" className='cursor-pointer'>Support</a></DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <button disabled={disableLogin} onClick={login}>
                    <Wallet className='h-5 w-5 lg:hidden' />
                    <p className='hidden lg:flex border border-gray-200 bg-gray-50 font-medium px-4 py-2 rounded-full cursor-pointer items-center'>Connect with wallet</p>
                </button>
            )}
        </>
    );
}

export default ProfileAvatar;
