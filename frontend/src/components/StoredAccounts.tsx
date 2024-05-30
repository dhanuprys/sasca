'use client';

import useUser from "@/hooks/useUser";
import axios from "axios";
import { useCallback, useEffect, useReducer, useState } from "react";
import { IoIosAddCircleOutline } from "react-icons/io";

interface AccountCardProps {
    account: {
        id: number;
        role: string;
        user: {
            avatar_path: string;
            name: string;
        }
    },
    refresh?: () => void;
}

function AccountCard({ account, refresh }: AccountCardProps) {
    const { getToken, deleteToken } = useUser();

    const deleteTokenById = (tokenId: number) => {
        deleteToken(tokenId);
        refresh && refresh();
    }

    const loginUsingTokenId = useCallback((tokenId: number) => {
        const token = getToken(tokenId);

        if (!token) return;

        axios.post('/api/v1/auth/store', {
            token
        }).then(() => {
            window.location.href = '/';
        }).catch(() => {
            // silent
        });
    }, []);

    return (
        <div className="flex gap-2 md:gap-4 hover:bg-slate-100 px-1 py-2 md:px-6 md:py-4">
            <img src={account.user.avatar_path ? `/api/_static/${account.user.avatar_path}` : '/user.webp'} className="w-[50px] md:w-[70px] h-[50px] md:h-[70px] rounded-full shrink-0" />
            <div className="flex-auto flex flex-col justify-center">
                <h3 className="font-semibold">{account.user.name}</h3>
                <span className="text-xs md:text-sm text-slate-400">{account.role}</span>
                <div className="mt-2 flex gap-2">
                    <span onClick={() => deleteTokenById(account.id)} className="font-semibold text-red-700 text-sm py-1 hover:cursor-pointer">hapus</span>
                    <span onClick={() => loginUsingTokenId(account.id)} className="font-semibold text-sky-800 hover:bg-sky-200 hover:cursor-pointer text-sm px-2 py-1 rounded bg-sky-100">masuk</span>
                </div>
            </div>
        </div>
    );
}

interface StoredAccountsProps {
    excludeId?: number[];
    withSignInButton?: boolean;
}

function StoredAccounts({ excludeId = [], withSignInButton = false }: StoredAccountsProps) {
    const { getAllToken, signIn } = useUser();
    const [isLoading, setLoading] = useState(true);
    const [accountList, setAccounts] = useState<any>([]);
    const [x, refresh] = useReducer((x) => x + 1, 0);

    useEffect(() => {
        axios.post('/api/v1/auth/store/profile', {
            tokens: getAllToken()
        }).then((response) => {
            setAccounts(response.data);
        }).catch(() => {

        }).finally(() => {
            setLoading(false);
        });
    }, [x]);

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <div>
            <div className="flex flex-col">
                <div>
                    {
                        accountList && accountList.length > 0
                            ? accountList.map((account: any) => {
                                if (excludeId.includes(account.id)) return null;

                                return (
                                    <AccountCard refresh={refresh} account={account} />
                                )
                            })
                            : <div>
                                Belum ada akun yang tersimpan
                            </div>
                    }
                    {
                        withSignInButton && (
                            <div onClick={() => signIn(true)} className="p-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex gap-2 justify-center items-center mt-6">
                                <IoIosAddCircleOutline className="text-xl" />
                                Tambahkan akun
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default StoredAccounts;