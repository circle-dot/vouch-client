import React from 'react';
import { useEffect, useState } from "react";
import { usePrivy } from '@privy-io/react-auth';
import {
    TwitterLogoIcon
} from "@radix-ui/react-icons";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from '@/types/user';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { getAvatar } from './getAvatarImg';
import { BlendIcon } from 'lucide-react';
import Link from 'next/link';
import VouchButtonCustom from '@/components/ui/VouchButton';

function truncateWallet(wallet: string) {
    return wallet.slice(0, 6) + '...' + wallet.slice(-4);
}

function truncateName(name: string) {
    const maxLength = 30; // Maximum characters to display before truncating
    if (name.length <= maxLength) {
        return name;
    } else {
        return name.slice(0, maxLength) + '…';
    }
}

const UserCard: React.FC<{ user: User }> = ({ user }) => {
    const { name, wallet, bio, twitter, avatarType, rankScore } = user;

    const [authStatus, setAuthStatus] = useState(false);
    const { ready, authenticated } = usePrivy();

    useEffect(() => {
        if (ready) {
            setAuthStatus(authenticated);
        }
    }, [ready, authenticated]);

    const displayName = truncateName(name) || truncateWallet(wallet);
    const fullName = name || wallet;
    const displayBio = bio || "No bio provided";
    const avatar = getAvatar(wallet, avatarType);

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <Avatar>
                    {typeof avatar === 'string' ? (
                        <AvatarImage src={avatar} alt="Avatar Image" />
                    ) : (
                        avatar
                    )}
                </Avatar>
                <div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href={'/address/' + wallet}>{displayName}</Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                {fullName}
                            </TooltipContent>
                        </Tooltip>
                        {/* TODO: Add ENS / Address sliced */}
                    </TooltipProvider>

                    <div className="flex items-center text-sm">
                        <BlendIcon className="mr-1 h-3 w-3" />
                        Rank Score {rankScore}
                    </div>
                </div>
            </CardHeader>

            <CardDescription>
                {displayBio}
            </CardDescription>

            {/* TODO: Check twitter is connected */}
            <CardContent>
                <div className="flex text-sm text-muted-foreground justify-between mt-auto">
                    {twitter && (
                        <div className="flex items-center">
                            <a target="_blank" href={twitter}><TwitterLogoIcon className="mr-1 h-4 w-4 fill-sky-400 text-sky-400" /></a>
                        </div>
                    )}
                </div>
            </CardContent>

            {authStatus && <div className="flex space-y-1 justify-end">
                <div className="flex items-center rounded-md bg-secondary text-secondary-foreground">
                    <VouchButtonCustom recipient={wallet} authStatus={authStatus} />
                </div>
            </div>
            }

        </Card>
    );
}

export default UserCard;
