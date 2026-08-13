import React, { useEffect, useRef, useState } from 'react'
import styles from './Search.module.scss'
import { useGetUsersPerQueryQuery } from '@/store'
import Avatar from '../Avatar/Avatar'
import { ISelectedItem } from '@/components/CreateChatModal/CreateChatModal'

type Size = 'small' | 'fullScreen'

interface SearchProps {
    query: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder?: string
    searchResultSize?: Size
    selected?: ISelectedItem[]
    setSelected?: React.Dispatch<React.SetStateAction<ISelectedItem[]>>
    setWrongVisible?: React.Dispatch<React.SetStateAction<boolean>>
}

interface IResult {
    id: number
    name: string
    avatar: string
}

function Search({query, onChange, placeholder, searchResultSize="fullScreen", selected, setSelected, setWrongVisible}: SearchProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const placeholderRef = useRef<HTMLParagraphElement>(null);
    const resultRef = useRef<HTMLDivElement>(null);

    const [searchResult, setSearchResult] = useState<IResult[]>([]);
    const [excludes, setExcludes] = useState<number[]>([]);

    const { data } = useGetUsersPerQueryQuery({searchQuery: query, excludes})

    const userAgent = navigator.userAgent || ''; 
    const isMobile = /android|ios|iphone|ipad|ipod/i.test(userAgent.toLowerCase());

    const handeClickToItem = (id: number, name: string) => {
        if (searchResultSize === "fullScreen") {
            if (isMobile) {
                window.location.href = `/chat/${id}`
            } else {

            }
        } else {
            if (selected.length < 7) {
                setSelected(prev => [...prev, {id: id, name: name}])
                setExcludes(prev => [...prev, Number(id)])
            } else {
                setWrongVisible(true)
            }
        }
    }

    useEffect(() => {
        if (data?.getUsersPerQuery) {
            setSearchResult([])
            data.getUsersPerQuery.map(user => {
                setSearchResult(prev => [...prev, {
                    id: user.id, 
                    name: user.name, 
                    avatar: `${user.avatar && `${__BACKEND_URL__}/media/${user.avatar}`}`
                }])
            })
        }
        if (!query) {
            setSearchResult([])
        }
    }, [query, excludes, data])

    return ( 
        <div className={styles.input_wrapper}>
            <input ref={inputRef} type="text" className={styles.input} value={query} onChange={onChange} placeholder={placeholder}/>
            {query && data.getUsersPerQuery.length > 0 && <div ref={resultRef} className={`${styles.search_result} ${styles[searchResultSize]} ${isMobile && styles.mobile}`}>
                {searchResult.map(user => (
                    <div onClick={() => handeClickToItem(user.id, user.name)} key={user.id} className={styles.search_result_item}>
                        <Avatar/>
                        <p className={styles.search_result_name}>{user.name}</p>
                    </div>
                ))}
            </div>
            }
        </div>
    );
}

export default Search;


